import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Plus, 
  Check, 
  Star, 
  Users, 
  Search, 
  X, 
  LayoutGrid, 
  Map as MapIcon,
  Navigation,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { EventDetails, User } from '../types/community';

interface EventsViewProps {
  events: EventDetails[];
  currentUser: User;
  onOpenCreateEvent: () => void;
  onRsvpEvent: (eventId: string, status: 'going' | 'interested' | 'declined') => void;
  onSelectEvent: (event: EventDetails) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  currentUser,
  onOpenCreateEvent,
  onRsvpEvent,
  onSelectEvent,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [eventSearch, setEventSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedMapEventId, setSelectedMapEventId] = useState<string>(events[0]?.id || '');

  // Extract month and day for the calendar badge
  const parseDateBadge = (dateStr: string) => {
    const match = dateStr.match(/([A-Za-z]+)\s+(\d{1,2})/);
    if (match) {
      return { month: match[1].substring(0, 3).toUpperCase(), day: match[2] };
    }
    return { month: 'OCT', day: '17' };
  };

  const filteredEvents = events.filter((ev) => {
    if (eventSearch.trim()) {
      const query = eventSearch.toLowerCase().trim();
      const matchTitle = ev.title.toLowerCase().includes(query);
      const matchLocation = ev.location.toLowerCase().includes(query);
      const matchAddress = ev.address.toLowerCase().includes(query);
      const matchDesc = (ev.description || '').toLowerCase().includes(query);
      if (!matchTitle && !matchLocation && !matchAddress && !matchDesc) return false;
    }

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'my_rsvps') return ev.userRsvp === 'going' || ev.userRsvp === 'interested';
    if (selectedFilter === 'weekend') return ev.date.toLowerCase().includes('saturday') || ev.date.toLowerCase().includes('sunday');
    return ev.category.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  const selectedMapEvent = events.find((e) => e.id === selectedMapEventId) || filteredEvents[0];

  // Coordinates mapping for events on the neighborhood map
  const getEventCoordinates = (index: number) => {
    const spots = [
      { x: 35, y: 40, label: 'Town Common' },
      { x: 65, y: 62, label: 'Elm Grove' },
      { x: 25, y: 75, label: 'Creek Trail' },
      { x: 80, y: 30, label: 'River Arts' },
      { x: 50, y: 25, label: 'Highland Crest' },
    ];
    return spots[index % spots.length];
  };

  return (
    <div className="space-y-6">
      {/* Events Hub Banner Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>COMMUNITY CALENDAR & HAPPENINGS</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Local Events & Gatherings
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Discover weekend farmers markets, block parties, volunteer drives, and neighborhood town halls.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* View Mode Switcher: Grid vs Map */}
            <div className="flex items-center p-1 bg-neutral-100 rounded-lg border border-neutral-200/60">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="Neighborhood Map view"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>

            <button
              onClick={onOpenCreateEvent}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Host Event</span>
            </button>
          </div>
        </div>

        {/* Dedicated Search Bar for Title or Location */}
        <div className="mt-5 pt-5 border-t border-neutral-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search events by title or location (e.g., 'Farmers Market', 'Elm Grove', 'Town Common')..."
              value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 text-xs bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 focus:border-emerald-500 rounded-xl outline-none transition-all placeholder:text-neutral-400 text-neutral-900 shadow-2xs"
            />
            {eventSearch && (
              <button
                onClick={() => setEventSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 p-1 rounded-md transition-colors flex items-center gap-1 font-medium"
                title="Clear search"
              >
                <span>Clear</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills & Search Results Indicator */}
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedFilter === 'all'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200/70 text-neutral-700'
                }`}
              >
                All Events ({events.length})
              </button>
              <button
                onClick={() => setSelectedFilter('weekend')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedFilter === 'weekend'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200/70 text-neutral-700'
                }`}
              >
                This Weekend
              </button>
              <button
                onClick={() => setSelectedFilter('markets')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedFilter === 'markets'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200/70 text-neutral-700'
                }`}
              >
                Markets & Food
              </button>
              <button
                onClick={() => setSelectedFilter('volunteer')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedFilter === 'volunteer'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200/70 text-neutral-700'
                }`}
              >
                Civic & Parks
              </button>
              <button
                onClick={() => setSelectedFilter('my_rsvps')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedFilter === 'my_rsvps'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                }`}
              >
                My RSVPs
              </button>
            </div>

            <div className="text-xs text-neutral-500 font-medium tabular-nums flex items-center gap-1.5">
              {eventSearch.trim() ? (
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                  <span>Showing {filteredEvents.length} of {events.length}</span>
                </span>
              ) : (
                <span>{filteredEvents.length} upcoming {filteredEvents.length === 1 ? 'event' : 'events'}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Mode: Interactive Neighborhood Map */}
      {viewMode === 'map' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-neutral-900">Neighborhood Event Map</span>
              <span className="text-xs text-neutral-400">· Click any pin to inspect gathering</span>
            </div>
            <span className="text-[11px] text-neutral-500 font-medium">
              Maplewood Heights & Commons
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            {/* Map Canvas */}
            <div className="lg:col-span-8 bg-neutral-100/90 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-neutral-200 min-h-[340px]">
              {/* Stylized vector map graphics */}
              <svg className="w-full h-full absolute inset-0 select-none" xmlns="http://www.w3.org/2000/svg">
                {/* Municipal Green Park */}
                <rect x="18%" y="28%" width="32%" height="48%" rx="24" fill="#D1FAE5" opacity="0.8" />
                <text x="28%" y="48%" fill="#065F46" fontSize="12" fontWeight="600" opacity="0.6">Town Common Park</text>

                {/* Creek Trail River Ribbon */}
                <path d="M 50 480 Q 200 320 280 200 T 550 50" fill="none" stroke="#BAE6FD" strokeWidth="26" strokeLinecap="round" />
                <path d="M 50 480 Q 200 320 280 200 T 550 50" fill="none" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
                <text x="18%" y="78%" fill="#0284C7" fontSize="11" fontWeight="600" opacity="0.7">Maplewood Creek Trail</text>

                {/* Major Roads */}
                <path d="M 0 160 L 900 160" stroke="#E2E8F0" strokeWidth="14" />
                <path d="M 0 160 L 900 160" stroke="#FFFFFF" strokeWidth="10" />
                <text x="4%" y="152%" fill="#64748B" fontSize="10" fontWeight="500">North Common Way</text>

                <path d="M 450 0 L 450 600" stroke="#E2E8F0" strokeWidth="14" />
                <path d="M 450 0 L 450 600" stroke="#FFFFFF" strokeWidth="10" />
                <text x="456" y="50" fill="#64748B" fontSize="10" fontWeight="500">5th Avenue</text>

                <path d="M 200 400 L 750 400" stroke="#E2E8F0" strokeWidth="12" />
                <path d="M 200 400 L 750 400" stroke="#FFFFFF" strokeWidth="8" />
                <text x="560" y="392" fill="#64748B" fontSize="10" fontWeight="500">Elm Grove Road</text>
              </svg>

              {/* Event Pins */}
              {filteredEvents.map((event, idx) => {
                const coord = getEventCoordinates(idx);
                const isSelected = selectedMapEvent?.id === event.id;

                return (
                  <div
                    key={event.id}
                    style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
                    onClick={() => setSelectedMapEventId(event.id)}
                  >
                    {/* Pulsing beacon if selected */}
                    {isSelected && (
                      <span className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping"></span>
                    )}

                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shadow-md font-bold text-xs transition-transform transform hover:scale-110 ${
                      isSelected
                        ? 'bg-emerald-600 text-white ring-3 ring-emerald-300'
                        : 'bg-white text-neutral-800 hover:bg-neutral-50 border border-neutral-200'
                    }`}>
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="max-w-[110px] truncate">{event.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Event Preview Card */}
            <div className="lg:col-span-4 p-5 flex flex-col justify-between bg-white">
              {selectedMapEvent ? (
                <div className="space-y-4">
                  <div className="h-40 rounded-xl overflow-hidden bg-neutral-100 relative">
                    <img
                      src={selectedMapEvent.coverImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop&q=80'}
                      alt={selectedMapEvent.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-neutral-900/80 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {selectedMapEvent.category}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-neutral-500 mb-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{selectedMapEvent.date} · {selectedMapEvent.time}</span>
                    </div>
                    <h3 className="font-bold text-base text-neutral-900 leading-snug">
                      {selectedMapEvent.title}
                    </h3>
                    <p className="flex items-start gap-1.5 text-xs text-neutral-600 mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{selectedMapEvent.location} ({selectedMapEvent.address})</span>
                    </p>
                    <p className="text-xs text-neutral-500 mt-2 line-clamp-3 leading-relaxed">
                      {selectedMapEvent.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-700 tabular-nums">
                      {selectedMapEvent.rsvpCount} neighbors going
                    </span>
                    <button
                      onClick={() => onSelectEvent(selectedMapEvent)}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <span>Full agenda</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* RSVP actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => onRsvpEvent(selectedMapEvent.id, selectedMapEvent.userRsvp === 'going' ? 'declined' : 'going')}
                      className={`py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                        selectedMapEvent.userRsvp === 'going'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {selectedMapEvent.userRsvp === 'going' ? 'Going ✓' : 'RSVP Going'}
                    </button>
                    <button
                      onClick={() => onRsvpEvent(selectedMapEvent.id, selectedMapEvent.userRsvp === 'interested' ? 'declined' : 'interested')}
                      className={`py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                        selectedMapEvent.userRsvp === 'interested'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${selectedMapEvent.userRsvp === 'interested' ? 'fill-current' : ''}`} />
                      <span>Interested</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-neutral-400">
                  Select an event pin on the map.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Mode: Cards Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => {
            const badge = parseDateBadge(event.date);

            return (
              <div
                key={event.id}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Event Image & Date Badge */}
                <div 
                  className="relative h-44 bg-neutral-200 overflow-hidden cursor-pointer"
                  onClick={() => onSelectEvent(event)}
                >
                  <img
                    src={event.coverImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop&q=80'}
                    alt={event.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Date Square Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur rounded-lg border border-neutral-200/80 p-1.5 text-center shadow-xs min-w-12">
                    <span className="block text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                      {badge.month}
                    </span>
                    <span className="block text-lg font-extrabold text-neutral-900 leading-none">
                      {badge.day}
                    </span>
                  </div>

                  {/* Category kicker */}
                  <div className="absolute top-3 right-3 bg-neutral-900/80 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    {event.category}
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mb-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{event.time}</span>
                    </div>

                    <h3
                      onClick={() => onSelectEvent(event)}
                      className="font-bold text-base text-neutral-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-2 leading-snug"
                    >
                      {event.title}
                    </h3>

                    <p className="flex items-start gap-1.5 text-xs text-neutral-600 mt-2 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium text-neutral-800">{event.location}</span>
                    </p>

                    <p className="text-xs text-neutral-500 mt-2 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Attendees and RSVP Action */}
                  <div className="mt-4 pt-3 border-t border-neutral-100">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {event.attendees.slice(0, 3).map((a, i) => (
                            <img
                              key={i}
                              src={a.avatar}
                              alt={a.name}
                              className="w-5 h-5 rounded-full ring-2 ring-white object-cover"
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-neutral-600 font-medium tabular-nums">
                          {event.rsvpCount} going
                        </span>
                      </div>

                      <span className="text-[11px] text-neutral-400 truncate max-w-[120px]">
                        By {event.organizer.split(' ')[0]}
                      </span>
                    </div>

                    {/* 3 RSVP Buttons: Going, Interested, Decline */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onRsvpEvent(event.id, event.userRsvp === 'going' ? 'declined' : 'going')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                          event.userRsvp === 'going'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {event.userRsvp === 'going' ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Going</span>
                          </>
                        ) : (
                          <span>Going</span>
                        )}
                      </button>

                      <button
                        onClick={() => onRsvpEvent(event.id, event.userRsvp === 'interested' ? 'declined' : 'interested')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                          event.userRsvp === 'interested'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${event.userRsvp === 'interested' ? 'fill-current' : ''}`} />
                        <span>Interested</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredEvents.length === 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">
              {eventSearch.trim() ? `No events found for "${eventSearch}"` : 'No events found matching this filter'}
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              {eventSearch.trim()
                ? 'Try searching with a different keyword, event title, or neighborhood venue.'
                : 'Try choosing another category or host a community meetup yourself!'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            {eventSearch.trim() && (
              <button
                onClick={() => setEventSearch('')}
                className="px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={onOpenCreateEvent}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
            >
              Host Community Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
