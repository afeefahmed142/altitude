import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FormBuilder } from './components/builder/FormBuilder';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { TeamView } from './components/team/TeamView';
import { RespondentForm } from './components/respondent/RespondentForm';
import { HomeView } from './components/home/HomeView';
import { SettingsView } from './components/settings/SettingsView';
import {
  DevTicketModal,
  QuarantineModal,
  ShareModal,
  NewFolderModal,
  ManagePermissionsModal,
} from './components/modals/Modals';
import {
  INITIAL_FORMS,
  INITIAL_ANALYTICS,
  INITIAL_DIRECTORIES,
  INITIAL_WORKFLOWS,
  INITIAL_TEAM_MEMBERS,
} from './data/initialData';
import { FormItem, AnalyticsData, DirectoryFolder, Workflow, TeamMember } from './types';
import { Check, Sparkles, X } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'forms' | 'analytics' | 'team' | 'settings'>('forms');
  const [builderSubTab, setBuilderSubTab] = useState<'build' | 'settings' | 'logic'>('build');
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'dashboard' | 'workflows'>('dashboard');

  const [forms, setForms] = useState<FormItem[]>(INITIAL_FORMS);
  const [activeFormId, setActiveFormId] = useState<string>('form-vendor-onboarding');

  const [analytics, setAnalytics] = useState<AnalyticsData>(INITIAL_ANALYTICS);
  const [directories, setDirectories] = useState<DirectoryFolder[]>(INITIAL_DIRECTORIES);
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [devTicketModalOpen, setDevTicketModalOpen] = useState(false);
  const [quarantineModalOpen, setQuarantineModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
  const [managePermissionsModalOpen, setManagePermissionsModalOpen] = useState(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeForm = forms.find((f) => f.id === activeFormId) || forms[0];

  const handleUpdateActiveForm = (updated: FormItem) => {
    setForms((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const handleCreateNewForm = () => {
    const newFormId = `form_${Date.now()}`;
    const newForm: FormItem = {
      id: newFormId,
      title: 'Untitled Form',
      description: 'Form description...',
      category: 'General',
      status: 'draft',
      responsesCount: 0,
      updatedAt: 'Just now',
      fields: [
        {
          id: `f_${Date.now()}_name`,
          type: 'short_text',
          label: 'Full Name',
          placeholder: 'Short answer text',
          required: true,
        },
      ],
    };
    setForms((prev) => [newForm, ...prev]);
    setActiveFormId(newFormId);
    setCurrentTab('forms');
    setBuilderSubTab('build');
    showToast('Created new form draft');
  };

  const handleToggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
    showToast('Workflow automation status updated');
  };

  const handleAddFolder = (folder: DirectoryFolder) => {
    setDirectories((prev) => [...prev, folder]);
    showToast(`Directory "${folder.name}" created`);
  };

  const handleAddTeamMember = (member: TeamMember) => {
    setTeamMembers((prev) => [...prev, member]);
    showToast(`Invited ${member.name} (${member.role})`);
  };

  const handleUpdateRole = (id: string, role: 'ADMIN' | 'EDITOR' | 'VIEWER') => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role } : m))
    );
    showToast('Role permissions updated');
  };

  const handleRespondentSubmit = (data: any) => {
    // Increment form response counter and add real-time live feed entry
    setForms((prev) =>
      prev.map((f) =>
        f.id === activeFormId ? { ...f, responsesCount: f.responsesCount + 1 } : f
      )
    );

    setAnalytics((prev) => ({
      ...prev,
      responsesCount: prev.responsesCount + 1,
      updatedText: 'JUST NOW',
      liveFeed: [
        {
          id: `#${Math.floor(1000 + Math.random() * 9000)}`,
          sentiment: 'positive',
          comment: `Submitted onboarding for ${data.legalEntityName || 'Enterprise Vendor'}. Signed cryptographically.`,
          timestamp: 'Just now',
          rating: 5,
        },
        ...prev.liveFeed,
      ],
    }));

    showToast('Form submission processed & recorded!');
  };

  const handlePublish = () => {
    showToast(`"${activeForm.title}" published successfully! URL is now live.`);
  };

  // If in Respondent Preview Mode (Image 7)
  if (isPreviewMode) {
    return (
      <RespondentForm
        form={activeForm}
        onBackToBuilder={() => setIsPreviewMode(false)}
        onSubmitSuccess={handleRespondentSubmit}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fbfbfe] text-[#111827] antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e1b4b] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3">
          <Sparkles className="w-3.5 h-3.5 text-[#a5b4fc]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'analytics') {
            setAnalyticsSubTab('dashboard');
          }
        }}
        onCreateNewForm={handleCreateNewForm}
      />

      {/* Content Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          builderSubTab={builderSubTab}
          analyticsSubTab={analyticsSubTab}
          onSelectBuilderSubTab={setBuilderSubTab}
          onSelectAnalyticsSubTab={(sub) => {
            setAnalyticsSubTab(sub);
            if (sub === 'workflows') {
              setCurrentTab('team');
            } else if (sub === 'dashboard') {
              setCurrentTab('analytics');
            }
          }}
          onOpenLivePreview={() => setIsPreviewMode(true)}
          onOpenShareModal={() => setShareModalOpen(true)}
          onPublish={handlePublish}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* View Routing */}
        {currentTab === 'home' && (
          <HomeView
            forms={forms}
            onSelectForm={(form) => {
              setActiveFormId(form.id);
              setCurrentTab('forms');
            }}
            onCreateNewForm={handleCreateNewForm}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'forms' && (
          <FormBuilder
            form={activeForm}
            onChangeForm={handleUpdateActiveForm}
            onOpenLivePreview={() => setIsPreviewMode(true)}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView
            analytics={analytics}
            onOpenDevTicketModal={() => setDevTicketModalOpen(true)}
            onOpenQuarantineModal={() => setQuarantineModalOpen(true)}
            onShareInsights={() => setShareModalOpen(true)}
            onExportPDF={() => showToast('Exporting Analytics PDF Report...')}
          />
        )}

        {currentTab === 'team' && (
          <TeamView
            directories={directories}
            workflows={workflows}
            teamMembers={teamMembers}
            onOpenNewFolderModal={() => setNewFolderModalOpen(true)}
            onOpenManagePermissionsModal={() => setManagePermissionsModalOpen(true)}
            onToggleWorkflow={handleToggleWorkflow}
            onExportReport={() => showToast('Exporting Workspace Report...')}
            onSelectDirectory={(dirId) => {
              showToast(`Opened directory folder`);
            }}
          />
        )}

        {currentTab === 'settings' && <SettingsView />}
      </div>

      {/* Modals */}
      <DevTicketModal
        isOpen={devTicketModalOpen}
        onClose={() => setDevTicketModalOpen(false)}
        onTicketCreated={(t) => showToast(`Created ticket: "${t.title}"`)}
      />

      <QuarantineModal
        isOpen={quarantineModalOpen}
        onClose={() => setQuarantineModalOpen(false)}
        onQuarantineResolved={() => {
          setAnalytics((prev) => ({
            ...prev,
            dataIntegrityAlert: {
              ...prev.dataIntegrityAlert,
              suspiciousPct: 0,
              description: 'All 6 suspicious entries quarantined.',
              botCount: 0,
              botTimeWindow: 'N/A',
            },
          }));
          showToast('Quarantined 6 bot entries from analytics stream');
        }}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        formTitle={activeForm.title}
      />

      <NewFolderModal
        isOpen={newFolderModalOpen}
        onClose={() => setNewFolderModalOpen(false)}
        onAddFolder={handleAddFolder}
      />

      <ManagePermissionsModal
        isOpen={managePermissionsModalOpen}
        onClose={() => setManagePermissionsModalOpen(false)}
        teamMembers={teamMembers}
        onAddMember={handleAddTeamMember}
        onUpdateRole={handleUpdateRole}
      />
    </div>
  );
}

export default App;
