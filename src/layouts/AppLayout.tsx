import React from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wand2, 
  Calendar, 
  Send, 
  BarChart2, 
  Settings as SettingsIcon,
  Plus,
  Search,
  Bell,
  UserCircle,
  MessageCircle,
  BarChart,
  Users,
  LogOut,
  Loader2,
} from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';

export default function AppLayout() {
  const navigate = useNavigate();
  const { user, loading, signOut, salon } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-fdfaf6 text-on-surface font-body-md text-body-md min-h-screen flex">
      {/* SideNavBar */}
      <nav className="bg-surface-container-lowest dark:bg-surface-container-low fixed left-0 top-0 h-screen w-[240px] border-r border-outline-variant flex flex-col py-8 z-50 overflow-y-auto">
        <div className="px-6 mb-8">
          <Logo className="w-full h-auto mb-2" />
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">AI Marketing Co-pilot</p>
        </div>

        <div className="flex-1 flex flex-col gap-0.5 px-2">
          <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest px-4 mb-1 mt-2">Main</p>
          <NavItem to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem to="/marketing-plan" icon={<Wand2 size={18} />} label="Marketing Plan" />
          <NavItem to="/campaigns" icon={<Send size={18} />} label="Campaigns" end />
          
          <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest px-4 mb-1 mt-4">Outreach</p>
          <NavItem to="/broadcasts" icon={<MessageCircle size={18} />} label="WA Broadcasts" />
          <NavItem to="/social-media" icon={<Calendar size={18} />} label="Festival Calendar" />
          
          <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest px-4 mb-1 mt-4">Insights</p>
          <NavItem to="/inbox" icon={<Users size={18} />} label="Lead Inbox" />
          <NavItem to="/insights" icon={<BarChart2 size={18} />} label="Analytics" />
          <NavItem to="/reports" icon={<BarChart size={18} />} label="ROI Reports" />
          
          <div className="mt-auto pt-4">
            <div className="h-px bg-outline-variant mx-2 mb-3" />
            <NavItem to="/settings" icon={<SettingsIcon size={18} />} label="Settings" />
          </div>
        </div>

        <div className="px-4 mt-4">
          <button
            onClick={() => navigate('/campaigns/new')}
            className="w-full bg-primary text-white py-3 rounded-xl font-label-sm text-[13px] hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Plus size={16} />
            New Campaign
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="ml-[240px] flex-1 flex flex-col min-h-screen">
        {/* TopNavBar */}
        <header className="bg-surface dark:bg-surface fixed top-0 right-0 left-[240px] z-40 shadow-sm flex justify-between items-center h-16 px-8 w-auto border-b border-outline-variant">
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-surface-container-lowest border border-outline-variant rounded-full px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <Search className="text-outline mr-2" size={16} />
              <input 
                className="bg-transparent border-none focus:ring-0 font-body-md text-sm text-on-surface placeholder-outline-variant outline-none w-52" 
                placeholder="Search campaigns, leads..." 
                type="text" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:text-primary transition-colors relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="flex items-center gap-2 border-l border-outline-variant pl-4">
              <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-xs text-primary">
                {(salon?.salon_name || user?.email || '?')[0].toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="font-label-sm text-xs text-on-surface font-bold">{salon?.salon_name || 'My Salon'}</p>
                <p className="font-label-sm text-[10px] text-on-surface-variant truncate max-w-[120px]">{user?.email}</p>
              </div>
              <button
                onClick={() => { signOut(); navigate('/login'); }}
                title="Sign Out"
                className="ml-1 p-1.5 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </header>

        {/* Page content — offset by header height */}
        <div className="mt-16 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, end }: { to: string; icon: React.ReactNode; label: string; end?: boolean }) {
  return (
    <NavLink 
      to={to}
      end={end}
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-150 ${
          isActive 
            ? 'text-primary font-bold bg-primary/10' 
            : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
        }`
      }
    >
      {icon}
      <span className="font-label-sm text-[13px]">{label}</span>
    </NavLink>
  );
}
