import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Check, 
  Star, 
  Share2, 
  Download, 
  MessageSquare,
  Send,
  Navigation
} from 'lucide-react';
import { EventDetails, User } from '../types/community';

interface EventDetailModalProps {
  event: EventDetails | null;
  onClose: () => void;
  currentUser: User;
  onRsvpEvent: (eventId: string, status: 'going' | 'interested' | 'declined') => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  currentUser,
  onRsvpEvent,
}) => {
  if (!event) return null;

  const [copiedLink, setCopiedLink] = useState(false);
  const [qaComments, setQaComments] = useState<Array<{ name: string; avatar: string; text: string; time: string }>>([
    {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      text: 'Are dogs allowed on leash in this section of the park?',
      time: '1 hour ago',
    },
    {
      name: event.organizer,
      avatar: event.organizerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Yes! Leashed friendly pets are very welcome.',
      time: '30 mins ago',
    },
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadIcs = () => {
    // Generate clean .ics calendar file
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TownSquare//Community Events//EN\nBEGIN:VEVENT\nSUMMARY:${event.title}\nDESCRIPTION:${event.description || ''}\nLOCATION:${event.location}, ${event.address}\nSTATUS:CONFIRMED\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setQaComments([
      ...qaComments,
      {
        name: currentUser.name,
        avatar: currentUser.avatar,
        text: newQuestion.trim(),
        time: 'Just now',
      },
    ]);
    setNewQuestion('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        
        {/* Event Banner */}
        <div className="relative h-56 sm:h-72 bg-neutral-900">
          <img
            src={event.coverImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80'}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-xs">
              {event.category}
            </span>
          </div>
        </div>

        {/* Event Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Title & Host info */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug">
              {event.title}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-xs text-neutral-600">
              <span>Hosted by <strong className="text-neutral-900">{event.organizer}</strong></span>
              <span>·</span>
              <span className="text-emerald-700 font-semibold">Verified Community Host</span>
            </div>
          </div>

          {/* Quick Schedule & Venue Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200/80">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-neutral-900">{event.date}</p>
                <p className="text-xs text-neutral-500">{event.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-neutral-900">{event.location}</p>
                <p className="text-xs text-neutral-500">{event.address}</p>
              </div>
            </div>
          </div>

          {/* RSVP Status Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <div>
              <p className="text-xs font-bold text-emerald-950">Will you be attending?</p>
              <p className="text-xs text-neutral-600 mt-0.5 tabular-nums">
                {event.rsvpCount} neighbors currently going
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onRsvpEvent(event.id, event.userRsvp === 'going' ? 'declined' : 'going')}
                className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  event.userRsvp === 'going'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300'
                }`}
              >
                {event.userRsvp === 'going' && <Check className="w-4 h-4 stroke-[2.5]" />}
                <span>{event.userRsvp === 'going' ? 'Going' : 'Going'}</span>
              </button>

              <button
                onClick={() => onRsvpEvent(event.id, event.userRsvp === 'interested' ? 'declined' : 'interested')}
                className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  event.userRsvp === 'interested'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${event.userRsvp === 'interested' ? 'fill-current' : ''}`} />
                <span>Interested</span>
              </button>
            </div>
          </div>

          {/* Event Description */}
          <div>
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
              About This Gathering
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Attendee Roster */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Neighbors Attending ({event.attendees.length})
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {event.attendees.map((attendee, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 rounded-lg text-xs font-medium text-neutral-800"
                >
                  <img
                    src={attendee.avatar}
                    alt={attendee.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span>{attendee.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row: Add to Calendar & Share */}
          <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
            <button
              onClick={handleDownloadIcs}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Add to Calendar (.ics)</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share with Neighbor</span>
                </>
              )}
            </button>
          </div>

          {/* Event Discussion / Q&A Thread */}
          <div className="pt-4 border-t border-neutral-100 space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-neutral-500" />
              <span>Event Questions & Discussion</span>
            </h3>

            <div className="space-y-2.5">
              {qaComments.map((qa, index) => (
                <div key={index} className="flex items-start gap-2.5 text-xs bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60">
                  <img
                    src={qa.avatar}
                    alt={qa.name}
                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900">{qa.name}</span>
                      <span className="text-[10px] text-neutral-400">{qa.time}</span>
                    </div>
                    <p className="text-neutral-700 mt-0.5">{qa.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handlePostQuestion} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Ask the host a question about parking, supplies, or agenda..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 focus:border-emerald-600 rounded-lg outline-none"
              />
              <button
                type="submit"
                disabled={!newQuestion.trim()}
                className="px-3 py-2 bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>Ask</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
