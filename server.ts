import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Gemini initialization with lazy/safe pattern
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", aiEnabled: Boolean(process.env.GEMINI_API_KEY) });
});

// AI Sidekick Form Builder Assistant Endpoint
app.post("/api/ai/sidekick", async (req, res) => {
  const { prompt, currentForm } = req.body;

  try {
    const ai = getAiClient();
    if (ai) {
      const systemInstruction = `You are FormX AI Sidekick, a precision form design assistant.
The user wants to generate, modify, or extend a form.
Based on the user's prompt and current form state, respond with a helpful short conversational message and a list of new field objects to add to the form.
Supported field types: 'short_text', 'long_text', 'email', 'multiple_choice', 'digital_signature', 'calendar_booking', 'multi_language', 'voice_input'.
Field options are required for 'multiple_choice'.
Return valid JSON adhering to the schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `User request: "${prompt}". Current form: ${JSON.stringify(currentForm || {})}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              message: {
                type: Type.STRING,
                description: "Friendly, helpful response message explaining the added fields.",
              },
              suggestedTitle: {
                type: Type.STRING,
                description: "Optional revised or refined form title.",
              },
              suggestedDescription: {
                type: Type.STRING,
                description: "Optional revised form description.",
              },
              fields: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING },
                    label: { type: Type.STRING },
                    placeholder: { type: Type.STRING },
                    required: { type: Type.BOOLEAN },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    aiSuggested: { type: Type.BOOLEAN },
                  },
                  required: ["type", "label"],
                },
              },
            },
            required: ["message", "fields"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    }
  } catch (err) {
    console.error("Gemini API call failed, falling back to smart heuristic:", err);
  }

  // Smart heuristic fallback if API key missing or error
  const lower = (prompt || "").toLowerCase();
  let message = "I've generated the requested fields for your form!";
  let fields: any[] = [];
  let suggestedTitle = "";
  let suggestedDescription = "";

  if (lower.includes("contact")) {
    message = "I've added a complete contact information section with name, email, and phone number fields.";
    fields = [
      { id: `f_${Date.now()}_1`, type: "short_text", label: "Full Name", placeholder: "e.g. Alex Morgan", required: true },
      { id: `f_${Date.now()}_2`, type: "email", label: "Business Email Address", placeholder: "alex@company.com", required: true },
      { id: `f_${Date.now()}_3`, type: "short_text", label: "Phone Number", placeholder: "+1 (555) 019-2834", required: false },
    ];
  } else if (lower.includes("feedback") || lower.includes("survey")) {
    suggestedTitle = "Customer Experience & Feedback Survey";
    suggestedDescription = "Help us improve by providing honest feedback on your recent experience.";
    message = "I've generated a comprehensive feedback survey with rating scales and open feedback fields.";
    fields = [
      {
        id: `f_${Date.now()}_1`,
        type: "multiple_choice",
        label: "Overall Satisfaction Rating",
        options: ["Very Satisfied", "Satisfied", "Neutral", "Unsatisfied"],
        required: true,
      },
      {
        id: `f_${Date.now()}_2`,
        type: "long_text",
        label: "What feature or experience did you value the most?",
        placeholder: "Tell us about what worked well...",
        required: false,
      },
      {
        id: `f_${Date.now()}_3`,
        type: "long_text",
        label: "What could we improve?",
        placeholder: "Tell us about any friction points...",
        required: false,
      },
    ];
  } else if (lower.includes("appointment") || lower.includes("booking") || lower.includes("schedule")) {
    message = "I've added appointment preferences and calendar scheduling blocks.";
    fields = [
      {
        id: `f_${Date.now()}_1`,
        type: "multiple_choice",
        label: "Appointment Preference",
        options: ["Morning (9AM - 12PM)", "Afternoon (1PM - 5PM)", "Evening (5PM - 8PM)"],
        aiSuggested: true,
        required: true,
      },
      {
        id: `f_${Date.now()}_2`,
        type: "calendar_booking",
        label: "Select Preferred Date & Time Slot",
        placeholder: "Pick a date on the calendar",
        required: true,
      },
    ];
  } else if (lower.includes("vendor") || lower.includes("onboard")) {
    suggestedTitle = "Enterprise Vendor Onboarding";
    suggestedDescription = "Please complete this securely to establish your vendor profile. Ensure all technical documentation is attached.";
    message = "I've built an Enterprise Vendor Onboarding form with legal entity verification and digital signature.";
    fields = [
      { id: `f_${Date.now()}_1`, type: "short_text", label: "Legal Entity Name", placeholder: "e.g. Acme Corp LLC", required: true },
      { id: `f_${Date.now()}_2`, type: "short_text", label: "Doing Business As (DBA)", placeholder: "Optional trading name", required: false },
      { id: `f_${Date.now()}_3`, type: "long_text", label: "Primary Services Provided", placeholder: "Describe the core services or products...", required: true },
      { id: `f_${Date.now()}_4`, type: "digital_signature", label: "Digital Authorization Signature", placeholder: "Sign here", required: true },
    ];
  } else {
    message = `I've structured 3 tailored fields matching "${prompt}".`;
    fields = [
      { id: `f_${Date.now()}_1`, type: "short_text", label: `${prompt} - Primary Detail`, placeholder: "Enter details here...", required: true },
      { id: `f_${Date.now()}_2`, type: "long_text", label: "Additional Context & Notes", placeholder: "Provide any additional context...", required: false },
      {
        id: `f_${Date.now()}_3`,
        type: "multiple_choice",
        label: "Priority Status",
        options: ["Standard", "Expedited", "Critical"],
        required: false,
      },
    ];
  }

  res.json({
    message,
    suggestedTitle,
    suggestedDescription,
    fields,
  });
});

// AI Summarize Text / NLP Refinement Endpoint
app.post("/api/ai/summarize", async (req, res) => {
  const { text, context } = req.body;
  if (!text || text.trim() === "") {
    return res.json({ summary: "" });
  }

  try {
    const ai = getAiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `Summarize and concisely polish this vendor service or feedback text in 1-2 crisp professional sentences: "${text}". Context: ${context || "Enterprise business form"}`,
      });
      return res.json({ summary: response.text?.trim() || text });
    }
  } catch (err) {
    console.error("Gemini summarize error:", err);
  }

  // Fallback summarizer
  const words = text.split(/\s+/);
  const shortened = words.length > 20 ? words.slice(0, 18).join(" ") + " [Structured vendor service offering]." : text;
  res.json({ summary: `Key Focus: ${shortened}` });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FormX server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
