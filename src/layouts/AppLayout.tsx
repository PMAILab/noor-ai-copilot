import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wand2, 
  Megaphone, 
  Send, 
  BarChart2, 
  Settings as SettingsIcon,
  Plus,
  Search,
  Bell,
  UserCircle
} from 'lucide-react';
import Logo from '../components/Logo';

export default function AppLayout() {
  return (
    <div className="bg-fdfaf6 text-on-surface font-body-md text-body-md min-h-screen flex">
      {/* SideNavBar */}
      <nav className="bg-surface-container-lowest dark:bg-surface-container-low fixed left-0 top-0 h-screen w-[240px] border-r border-outline-variant flex flex-col py-8 z-50">
        <div className="px-6 mb-8">
          <Logo className="w-full h-auto mb-2" />
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">AI Marketing Co-pilot</p>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/marketing-plan" icon={<Wand2 size={20} />} label="Marketing Plan" />
          <NavItem to="/social-media" icon={<Megaphone size={20} />} label="Social Media" />
          <NavItem to="/campaigns" icon={<Send size={20} />} label="Campaigns" />
          <NavItem to="/insights" icon={<BarChart2 size={20} />} label="Client Insights" />
          <div className="mt-auto">
            <NavItem to="/settings" icon={<SettingsIcon size={20} />} label="Settings" />
          </div>
        </div>

        <div className="px-6 mt-6">
          <button className="w-full bg-primary-container text-on-primary py-3 rounded-full font-label-sm text-label-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Plus size={18} />
            Launch New Campaign
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="ml-[240px] flex-1 flex flex-col min-h-screen">
        {/* TopNavBar */}
        <header className="bg-surface dark:bg-surface docked full-width top-0 sticky z-40 shadow-sm flex justify-between items-center h-20 px-margin-page w-full">
          <div className="flex items-center gap-8">
            <h1 className="font-h2 text-h2 text-primary tracking-tight">Noor</h1>
            <div className="flex items-center bg-surface-container-lowest border border-ede8e0 rounded-full px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <Search className="text-outline mr-2" size={18} />
              <input 
                className="bg-transparent border-none focus:ring-0 text-body-md font-body-md text-on-surface placeholder-outline-variant outline-none w-64" 
                placeholder="Search..." 
                type="text" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="flex gap-6">
              <NavLink 
                to="/insights" 
                className={({ isActive }) => `font-label-sm text-label-sm transition-colors ${isActive ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}
              >
                Analytics
              </NavLink>
              <NavLink 
                to="/inbox" 
                className={({ isActive }) => `font-label-sm text-label-sm transition-colors ${isActive ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}
              >
                Inbox
              </NavLink>
            </nav>
            <div className="flex items-center gap-4 border-l border-outline-variant pl-6">
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <Bell size={20} />
              </button>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <UserCircle size={20} />
              </button>
              <span className="text-primary-container font-label-sm text-label-sm border border-primary-container rounded-full px-3 py-1 bg-surface-container-high">
                Pro Plan
              </span>
              <a href="#" className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary">Support</a>
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center gap-3 px-6 py-3 transition-all duration-200 ${
          isActive 
            ? 'text-primary font-bold border-l-4 border-primary bg-surface-container-high scale-[0.99]' 
            : 'text-on-surface-variant font-medium hover:bg-surface-container hover:text-primary'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
