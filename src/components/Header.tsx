import React, { useState } from 'react';
import { 
  Compass, 
  Calendar, 
  Users, 
  MapPin, 
  Plus, 
  Search, 
  Bell, 
  ChevronDown,
  Check,
  ShieldCheck,
  Film
} from 'lucide-react';
import { Neighborhood, User, AppNotification } from '../types/community';
import { NEIGHBORHOOD_OPTIONS, SAMPLE_USERS } from '../data/mockData';
import { NotificationCenterDropdown } from './NotificationCenterDropdown';

interface HeaderProps {
  currentTab: 'feed' | 'events' | 'groups' | 'directory' | 'reels';
  onSelectTab: (tab: 'feed' | 'events' | 'groups' | 'directory' | 'reels') => void;
  selectedNeighborhood: Neighborhood;
  onSelectNeighborhood: (n: Neighborhood) => void;
  currentUser: User;
  onSwitchUser: (user: User) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCreateModal: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearAllNotifications: () => void;
  onOpenNotification: (notif: AppNotification) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSimulateNotification: (type: 'comment' | 'event_reminder' | 'safety_alert' | 'event_rsvp') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  selectedNeighborhood,
  onSelectNeighborhood,
  currentUser,
  onSwitchUser,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  notifications,
  onMarkAllAsRead,
  onClearAllNotifications,
  onOpenNotification,
  soundEnabled,
  onToggleSound,
  onSimulateNotification,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNeighborhoodMenu, setShowNeighborhoodMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;


  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand & Neighborhood selector */}
          <div className="flex items-center gap-4 shrink-0">
            <button 
              onClick={() => onSelectTab('feed')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-xs">
                T
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-neutral-900 tracking-tight leading-none block">
                  TownSquare
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  Local Community Network
                </span>
              </div>
            </button>

            {/* Neighborhood Pill Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNeighborhoodMenu(!showNeighborhoodMenu);
                  setShowUserMenu(false);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 rounded-lg transition-colors border border-neutral-200/60"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="max-w-[130px] md:max-w-[180px] truncate">{selectedNeighborhood}</span>
                <ChevronDown className="w-3 h-3 text-neutral-500 shrink-0" />
              </button>

              {showNeighborhoodMenu && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Select Your Area
                  </div>
                  {NEIGHBORHOOD_OPTIONS.map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        onSelectNeighborhood(n);
                        setShowNeighborhoodMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left hover:bg-neutral-50 transition-colors ${
                        selectedNeighborhood === n ? 'text-emerald-700 bg-emerald-50/70 font-semibold' : 'text-neutral-700'
                      }`}
                    >
                      <span>{n}</span>
                      {selectedNeighborhood === n && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Zone 2: Navigation Links (Center Tabs) */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('feed')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'feed'
                  ? 'text-emerald-700 bg-emerald-50/80'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Feed & Updates</span>
            </button>
            <button
              onClick={() => onSelectTab('events')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'events'
                  ? 'text-emerald-700 bg-emerald-50/80'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Events & Calendar</span>
            </button>
            <button
              onClick={() => onSelectTab('groups')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'groups'
                  ? 'text-emerald-700 bg-emerald-50/80'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Local Groups</span>
            </button>
            <button
              onClick={() => onSelectTab('directory')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'directory'
                  ? 'text-emerald-700 bg-emerald-50/80'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Neighbors</span>
            </button>
            <button
              onClick={() => onSelectTab('reels')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'reels'
                  ? 'text-emerald-700 bg-emerald-50/80'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Reels & Videos</span>
            </button>
          </nav>

          {/* Zone 3: Search, Create Action & User Persona */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Search Input */}
            <div className="relative hidden lg:block w-48 xl:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search posts, events..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-emerald-500 rounded-lg outline-none transition-all placeholder:text-neutral-400"
              />
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                  setShowNeighborhoodMenu(false);
                }}
                className={`p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg relative transition-colors ${
                  unreadCount > 0 ? 'text-neutral-900' : ''
                }`}
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-bounce-subtle' : ''}`} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 ring-2 ring-white"></span>
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationCenterDropdown
                  notifications={notifications}
                  onMarkAllAsRead={onMarkAllAsRead}
                  onClearAll={onClearAllNotifications}
                  onOpenNotification={(notif) => {
                    onOpenNotification(notif);
                    setShowNotifications(false);
                  }}
                  soundEnabled={soundEnabled}
                  onToggleSound={onToggleSound}
                  onSimulateNotification={onSimulateNotification}
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>

            {/* Create Post / Event Button */}
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-xs transition-all whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Post / Event</span>
              <span className="sm:hidden">Post</span>
            </button>

            {/* Current User Switcher Avatar */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNeighborhoodMenu(false);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 transition-colors focus:outline-none"
                title="Switch active neighbor persona"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-neutral-300"
                />
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500 hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-neutral-900">{currentUser.name}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-[11px] text-neutral-500 block">{currentUser.street} · {currentUser.neighborhood}</span>
                  </div>

                  <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Switch Test Neighbor Persona
                  </div>
                  {SAMPLE_USERS.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSwitchUser(user);
                        setShowUserMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-neutral-50 transition-colors ${
                        currentUser.id === user.id ? 'bg-emerald-50/60 font-semibold' : ''
                      }`}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-neutral-900 font-medium truncate">{user.name}</p>
                        <p className="text-[10px] text-neutral-500 truncate">{user.badge || user.street}</p>
                      </div>
                      {currentUser.id === user.id && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-200 bg-white py-2 px-2 text-xs">
        <button
          onClick={() => onSelectTab('feed')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 font-medium ${
            currentTab === 'feed' ? 'text-emerald-700 font-bold' : 'text-neutral-600'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Feed</span>
        </button>
        <button
          onClick={() => onSelectTab('events')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 font-medium ${
            currentTab === 'events' ? 'text-emerald-700 font-bold' : 'text-neutral-600'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Events</span>
        </button>
        <button
          onClick={() => onSelectTab('groups')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 font-medium ${
            currentTab === 'groups' ? 'text-emerald-700 font-bold' : 'text-neutral-600'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Groups</span>
        </button>
        <button
          onClick={() => onSelectTab('directory')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 font-medium ${
            currentTab === 'directory' ? 'text-emerald-700 font-bold' : 'text-neutral-600'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Neighbors</span>
        </button>
        <button
          onClick={() => onSelectTab('reels')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 font-medium ${
            currentTab === 'reels' ? 'text-emerald-700 font-bold' : 'text-neutral-600'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Reels</span>
        </button>
      </div>
    </header>
  );
};
