import React from 'react';
import {
  FileText,
  BarChart2,
  Users,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  Sliders,
  GitBranch,
  Edit3,
} from 'lucide-react';
import { FormItem } from '../../types';

interface HomeViewProps {
  forms: FormItem[];
  onSelectForm: (form: FormItem, subTab?: 'build' | 'settings' | 'logic') => void;
  onCreateNewForm: () => void;
  onNavigateTab: (tab: 'forms' | 'analytics' | 'team' | 'settings') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  forms,
  onSelectForm,
  onCreateNewForm,
  onNavigateTab,
}) => {
  return (
    <div id="home-view-root" className="flex-1 overflow-y-auto bg-[#fbfbfe] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top welcome banner */}
        <div className="bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#3b2bee] rounded-3xl p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#a5b4fc] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Form Intelligence</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Welcome back, Alex.
            </h1>
            <p className="text-xs text-[#c7d2fe] max-w-lg leading-relaxed">
              Your forms collected <strong>1,679 responses</strong> this week across 3 automated pipelines. AI detection prevented 6 invalid bot entries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCreateNewForm}
              className="px-5 py-2.5 bg-white text-[#3b2bee] hover:bg-[#f8f9ff] text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New AI Form</span>
            </button>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <BarChart2 className="w-4 h-4" />
              <span>View Insights</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between text-[#6b7280] text-xs font-semibold">
              <span>Active Forms</span>
              <FileText className="w-4 h-4 text-[#3b2bee]" />
            </div>
            <div className="text-2xl font-black text-[#111827] mt-2">{forms.length}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3" /> +2 published this month
            </div>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between text-[#6b7280] text-xs font-semibold">
              <span>Total Submissions</span>
              <BarChart2 className="w-4 h-4 text-[#7c3aed]" />
            </div>
            <div className="text-2xl font-black text-[#111827] mt-2">1,679</div>
            <div className="text-[11px] text-[#6b7280] mt-1 font-mono">Across all directories</div>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between text-[#6b7280] text-xs font-semibold">
              <span>AI Sentiment Score</span>
              <Sparkles className="w-4 h-4 text-[#059669]" />
            </div>
            <div className="text-2xl font-black text-[#111827] mt-2">85% Positive</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 font-mono">High satisfaction</div>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between text-[#6b7280] text-xs font-semibold">
              <span>Integrity Radar</span>
              <ShieldCheck className="w-4 h-4 text-[#3b2bee]" />
            </div>
            <div className="text-2xl font-black text-[#111827] mt-2">99.5% Verified</div>
            <div className="text-[11px] text-[#6b7280] mt-1 font-mono">6 bots quarantined</div>
          </div>
        </div>

        {/* Live Forms Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#111827]">
              Forms &amp; Workspaces
            </h2>
            <button
              onClick={() => onNavigateTab('forms')}
              className="text-xs font-semibold text-[#3b2bee] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Open in Builder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-white border border-[#e5e7eb] hover:border-[#cbd5e1] rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#eef2ff] text-[#3b2bee] font-mono uppercase">
                      {form.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {form.status.toUpperCase()}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectForm(form, 'build')}
                    className="text-sm font-bold text-[#111827] hover:text-[#3b2bee] transition-colors mt-3 cursor-pointer"
                  >
                    {form.title}
                  </h3>
                  <p className="text-xs text-[#6b7280] mt-1 line-clamp-2 leading-relaxed">
                    {form.description}
                  </p>
                </div>

                <div className="space-y-3 pt-4 mt-4 border-t border-[#f3f4f6]">
                  <div className="flex items-center justify-between text-xs text-[#6b7280] font-mono">
                    <span>{form.responsesCount} responses</span>
                    <span>{form.fields.length} questions</span>
                  </div>

                  {/* Direct Action Buttons: Build, Settings, Logic */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <button
                      type="button"
                      id={`btn-home-build-${form.id}`}
                      onClick={() => onSelectForm(form, 'build')}
                      className="flex items-center justify-center gap-1 py-1.5 px-2 bg-[#f8f9ff] hover:bg-[#eef2ff] text-[#3b2bee] border border-[#e0e7ff] rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                      title="Open Form Builder"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Build</span>
                    </button>

                    <button
                      type="button"
                      id={`btn-home-settings-${form.id}`}
                      onClick={() => onSelectForm(form, 'settings')}
                      className="flex items-center justify-center gap-1 py-1.5 px-2 bg-[#f9fafb] hover:bg-[#f3f4f6] text-[#4b5563] hover:text-[#111827] border border-[#e5e7eb] rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                      title="Form Settings"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Settings</span>
                    </button>

                    <button
                      type="button"
                      id={`btn-home-logic-${form.id}`}
                      onClick={() => onSelectForm(form, 'logic')}
                      className="flex items-center justify-center gap-1 py-1.5 px-2 bg-[#faf5ff] hover:bg-[#f3e8ff] text-[#7c3aed] border border-[#f3e8ff] rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                      title="Conditional Logic"
                    >
                      <GitBranch className="w-3 h-3" />
                      <span>Logic</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
