import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  MessageSquare, 
  Calendar, 
  ShieldAlert, 
  Heart, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Zap
} from 'lucide-react';
import { AppNotification } from '../types/community';

interface NotificationCenterDropdownProps {
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onOpenNotification: (notif: AppNotification) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSimulateNotification: (type: 'comment' | 'event_reminder' | 'safety_alert' | 'event_rsvp') => void;
  onClose: () => void;
}

export const NotificationCenterDropdown: React.FC<NotificationCenterDropdownProps> = ({
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onOpenNotification,
  soundEnabled,
  onToggleSound,
  onSimulateNotification,
  onClose,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'comments' | 'events' | 'alerts'>('all');
  const [showSimulateBar, setShowSimulateBar] = useState(false);

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'comments') return n.type === 'comment';
    if (filter === 'events') return n.type === 'event_reminder' || n.type === 'event_rsvp';
    if (filter === 'alerts') return n.type === 'safety_alert';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />;
      case 'event_reminder':
      case 'event_rsvp':
        return <Calendar className="w-3.5 h-3.5 text-blue-600" />;
      case 'safety_alert':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />;
      case 'reaction':
        return <Heart className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
      
      {/* Header */}
      <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-neutral-900">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md tabular-nums">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
            title={soundEnabled ? 'Alert chimes on' : 'Alert chimes muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
          </button>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-emerald-700 hover:underline font-semibold flex items-center gap-1"
            >
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>Mark read</span>
            </button>
          )}

          <button
            onClick={() => setShowSimulateBar(!showSimulateBar)}
            className={`p-1 rounded-md transition-colors ${
              showSimulateBar ? 'bg-amber-100 text-amber-800' : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100'
            }`}
            title="Test / simulate incoming notifications"
          >
            <Zap className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Simulation Helper Bar */}
      {showSimulateBar && (
        <div className="p-3 bg-amber-50/70 border-b border-amber-200 text-xs">
          <p className="font-semibold text-amber-900 text-[11px] mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Simulate Live Incoming Alerts:</span>
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onSimulateNotification('comment')}
              className="px-2 py-1 bg-white hover:bg-amber-100 text-neutral-800 text-[11px] font-medium rounded border border-amber-200 text-left transition-colors truncate"
            >
              💬 New Comment
            </button>
            <button
              onClick={() => onSimulateNotification('event_reminder')}
              className="px-2 py-1 bg-white hover:bg-amber-100 text-neutral-800 text-[11px] font-medium rounded border border-amber-200 text-left transition-colors truncate"
            >
              📅 Event Reminder
            </button>
            <button
              onClick={() => onSimulateNotification('safety_alert')}
              className="px-2 py-1 bg-white hover:bg-amber-100 text-neutral-800 text-[11px] font-medium rounded border border-amber-200 text-left transition-colors truncate"
            >
              🚨 Urgent Safety Alert
            </button>
            <button
              onClick={() => onSimulateNotification('event_rsvp')}
              className="px-2 py-1 bg-white hover:bg-amber-100 text-neutral-800 text-[11px] font-medium rounded border border-amber-200 text-left transition-colors truncate"
            >
              🤝 Neighbor RSVP'd
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="px-3 pt-2 pb-1 flex items-center gap-1 border-b border-neutral-100 overflow-x-auto scrollbar-none text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors whitespace-nowrap ${
            filter === 'all' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors whitespace-nowrap ${
            filter === 'unread' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('comments')}
          className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors whitespace-nowrap ${
            filter === 'comments' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Comments
        </button>
        <button
          onClick={() => setFilter('events')}
          className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors whitespace-nowrap ${
            filter === 'events' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setFilter('alerts')}
          className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors whitespace-nowrap ${
            filter === 'alerts' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Alerts
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onOpenNotification(notif)}
              className={`p-3.5 hover:bg-neutral-50 cursor-pointer transition-colors text-xs flex items-start gap-3 relative ${
                !notif.read ? 'bg-emerald-50/30' : ''
              }`}
            >
              {/* Unread indicator */}
              {!notif.read && (
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
              )}

              {/* Avatar or Icon */}
              <div className="relative shrink-0">
                {notif.sender?.avatar ? (
                  <img
                    src={notif.sender.avatar}
                    alt={notif.sender.name}
                    className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                  />
                ) : (
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    notif.priority === 'urgent' ? 'bg-rose-100' : 'bg-neutral-100'
                  }`}>
                    {getIcon(notif.type)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-neutral-100 shadow-xs">
                  {getIcon(notif.type)}
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-1 mb-0.5">
                  <span className={`font-bold truncate text-xs ${
                    notif.priority === 'urgent' ? 'text-rose-700' : 'text-neutral-900'
                  }`}>
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono tabular-nums shrink-0">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-neutral-700 text-xs line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
                {notif.sender?.street && (
                  <span className="text-[10px] text-neutral-400 mt-0.5 block">
                    From {notif.sender.street}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-neutral-400">
            No notifications in this filter.
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-2.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs">
          <span className="text-[11px] text-neutral-500">
            Chimes are {soundEnabled ? 'active' : 'muted'}
          </span>
          <button
            onClick={onClearAll}
            className="text-[11px] text-neutral-500 hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear history</span>
          </button>
        </div>
      )}

    </div>
  );
};
