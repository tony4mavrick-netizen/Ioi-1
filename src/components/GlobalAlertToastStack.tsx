import React, { useEffect } from 'react';
import { 
  MessageSquare, 
  Calendar, 
  AlertTriangle, 
  Heart, 
  X, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  BellRing 
} from 'lucide-react';
import { AppNotification } from '../types/community';

export interface ToastItem {
  notification: AppNotification;
  id: string;
}

interface GlobalAlertToastStackProps {
  toasts: ToastItem[];
  onDismissToast: (id: string) => void;
  onOpenNotification: (notification: AppNotification) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const GlobalAlertToastStack: React.FC<GlobalAlertToastStackProps> = ({
  toasts,
  onDismissToast,
  onOpenNotification,
  soundEnabled,
  onToggleSound,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none px-3"
      role="region"
      aria-label="Global Notifications"
    >
      {toasts.map(({ notification, id }) => (
        <ToastCard
          key={id}
          notification={notification}
          onDismiss={() => onDismissToast(id)}
          onOpen={() => {
            onOpenNotification(notification);
            onDismissToast(id);
          }}
          soundEnabled={soundEnabled}
          onToggleSound={onToggleSound}
        />
      ))}
    </div>
  );
};

interface ToastCardProps {
  notification: AppNotification;
  onDismiss: () => void;
  onOpen: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const ToastCard: React.FC<ToastCardProps> = ({
  notification,
  onDismiss,
  onOpen,
  soundEnabled,
  onToggleSound,
}) => {
  const isUrgent = notification.priority === 'urgent' || notification.type === 'safety_alert';

  // Auto-dismiss timer (6 seconds, 9 for urgent)
  useEffect(() => {
    const duration = isUrgent ? 9000 : 6000;
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [isUrgent, onDismiss]);

  const getIcon = () => {
    switch (notification.type) {
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case 'event_reminder':
      case 'event_rsvp':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'safety_alert':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'reaction':
        return <Heart className="w-4 h-4 text-rose-500" />;
      default:
        return <BellRing className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div
      className={`pointer-events-auto rounded-xl p-4 shadow-xl border transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in ${
        isUrgent
          ? 'bg-rose-50/95 border-rose-300 text-neutral-900 shadow-rose-900/10'
          : 'bg-white/95 backdrop-blur border-neutral-200 text-neutral-900 shadow-neutral-900/10'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar or Icon */}
        <div className="relative shrink-0">
          {notification.sender?.avatar ? (
            <img
              src={notification.sender.avatar}
              alt={notification.sender.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-neutral-200"
            />
          ) : (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isUrgent ? 'bg-rose-100' : 'bg-emerald-50'
            }`}>
              {getIcon()}
            </div>
          )}
          
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs border border-neutral-100">
            {getIcon()}
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              isUrgent ? 'text-rose-700' : 'text-emerald-700'
            }`}>
              {notification.type === 'safety_alert' ? 'Neighborhood Alert' : notification.title}
            </span>
            <span className="text-[10px] text-neutral-400 font-mono tabular-nums shrink-0">
              {notification.timestamp}
            </span>
          </div>

          <p className="text-xs text-neutral-800 font-medium line-clamp-2 leading-relaxed">
            {notification.message}
          </p>

          {/* Action Row */}
          <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-neutral-200/50">
            <button
              onClick={onOpen}
              className={`text-xs font-bold flex items-center gap-1 hover:underline transition-colors ${
                isUrgent ? 'text-rose-700' : 'text-emerald-700'
              }`}
            >
              <span>View details</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSound();
                }}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                title={soundEnabled ? 'Mute alert chimes' : 'Unmute alert chimes'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onDismiss}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
