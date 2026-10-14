import React from 'react';
import { Calendar, Users, ArrowRight, Check, MapPin } from 'lucide-react';
import { EventDetails, LocalGroup } from '../types/community';

interface SidebarRightProps {
  events: EventDetails[];
  groups: LocalGroup[];
  onOpenEventsTab: () => void;
  onOpenGroupsTab: () => void;
  onRsvpEvent: (eventId: string, status: 'going' | 'interested' | 'declined') => void;
  onToggleGroup: (groupId: string) => void;
  onSelectEvent: (event: EventDetails) => void;
}

export const SidebarRight: React.FC<SidebarRightProps> = ({
  events,
  groups,
  onOpenEventsTab,
  onOpenGroupsTab,
  onRsvpEvent,
  onToggleGroup,
  onSelectEvent,
}) => {
  return (
    <aside className="w-full space-y-4">
      {/* Upcoming Events Mini Widget */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Upcoming Local Events</span>
          </div>
          <button
            onClick={onOpenEventsTab}
            className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-0.5"
          >
            <span>See all</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3">
          {events.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="group border border-neutral-100 hover:border-neutral-200 rounded-lg p-2.5 transition-all bg-neutral-50/50 hover:bg-white"
            >
              <div 
                className="cursor-pointer"
                onClick={() => onSelectEvent(event)}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-neutral-200 shrink-0">
                    <img
                      src={event.coverImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=100&auto=format&fit=crop&q=80'}
                      alt={event.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {event.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-medium">
                      {event.date.split(',')[1] || event.date} · {event.time.split('-')[0]}
                    </p>
                    <p className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick RSVP Bar */}
              <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                <span className="text-neutral-500 font-medium tabular-nums">
                  {event.rsvpCount} going
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onRsvpEvent(event.id, event.userRsvp === 'going' ? 'declined' : 'going')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      event.userRsvp === 'going'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {event.userRsvp === 'going' ? 'Going ✓' : 'RSVP'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Local Groups */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Neighborhood Groups</span>
          </div>
          <button
            onClick={onOpenGroupsTab}
            className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-0.5"
          >
            <span>Browse</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {groups.slice(0, 3).map((group) => (
            <div key={group.id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={group.image}
                  alt={group.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover shrink-0 border border-neutral-200"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-neutral-900 truncate">
                    {group.name}
                  </h4>
                  <p className="text-[10px] text-neutral-500 tabular-nums">
                    {group.memberCount} neighbors
                  </p>
                </div>
              </div>

              <button
                onClick={() => onToggleGroup(group.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors shrink-0 ${
                  group.isMember
                    ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {group.isMember ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Joined
                  </span>
                ) : (
                  'Join'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Neighbor Code of Conduct Notice */}
      <div className="p-3 text-[11px] text-neutral-500 space-y-1">
        <p className="font-semibold text-neutral-700">Neighbor Principles</p>
        <p>
          Be respectful, helpful, and kind. Real names and verified local streets build community trust.
        </p>
      </div>
    </aside>
  );
};
