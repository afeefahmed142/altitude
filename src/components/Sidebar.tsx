import React from 'react';
import {
  FileText,
  BarChart2,
  Users2,
  Settings,
  Home,
  Plus,
} from 'lucide-react';

interface SidebarProps {
  currentTab: 'home' | 'forms' | 'analytics' | 'team' | 'settings';
  onSelectTab: (tab: 'home' | 'forms' | 'analytics' | 'team' | 'settings') => void;
  onCreateNewForm: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onCreateNewForm,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'forms', label: 'Forms', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'team', label: 'Team', icon: Users2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <aside
      id="main-sidebar"
      className="w-64 bg-[#fbfbfe] border-r border-[#e8ebf3] flex flex-col justify-between h-screen select-none shrink-0"
    >
      {/* Brand & Create Button */}
      <div className="p-5 flex flex-col gap-6">
        {/* Brand */}
        <div
          id="brand-header"
          onClick={() => onSelectTab('forms')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Logo icon matching screenshot: 4 squares with inner circle */}
          <div className="w-9 h-9 rounded-lg bg-[#3b2bee] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-[#111827] leading-none">
              FormX
            </h1>
            <p className="text-[10px] tracking-wider uppercase font-semibold text-[#6b7280] mt-1 font-mono">
              Precision Intelligence
            </p>
          </div>
        </div>

        {/* Create New Form Button */}
        <button
          id="btn-create-new-form"
          onClick={onCreateNewForm}
          className="w-full bg-[#3b2bee] hover:bg-[#3020d6] active:scale-[0.98] text-white font-medium py-3 px-4 rounded-xl shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create New Form</span>
        </button>

        {/* Nav list */}
        <nav className="flex flex-col gap-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#eef2ff] text-[#3b2bee] font-semibold'
                    : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f8]'
                }`}
              >
                <Icon
                  className={`w-4.5 h-4.5 transition-colors ${
                    isActive ? 'text-[#3b2bee]' : 'text-[#6b7280]'
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute right-0 top-1.5 bottom-1.5 w-1 bg-[#3b2bee] rounded-l-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-[#e8ebf3] bg-[#fbfbfe]">
        <div
          id="user-profile-footer"
          onClick={() => onSelectTab('settings')}
          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#f3f4f8] transition-colors cursor-pointer"
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#d1d5db] shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
              alt="Alex Carter"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-[#111827] truncate leading-tight">
              Alex Carter
            </span>
            <span className="text-xs text-[#6b7280] truncate font-mono">
              Admin
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
