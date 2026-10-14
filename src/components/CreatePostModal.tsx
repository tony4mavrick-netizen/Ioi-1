import React, { useState } from 'react';
import { 
  X, 
  Compass, 
  Calendar, 
  AlertTriangle, 
  Tag, 
  BarChart2, 
  Image as ImageIcon,
  Check,
  MapPin
} from 'lucide-react';
import { User, Post, EventDetails, AlertSeverity } from '../types/community';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  initialTab?: 'update' | 'event' | 'alert' | 'poll' | 'marketplace';
  onCreatePost: (newPost: Partial<Post>) => void;
  onCreateEvent: (newEvent: EventDetails) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialTab = 'update',
  onCreatePost,
  onCreateEvent,
}) => {
  const [activeTab, setActiveTab] = useState<'update' | 'event' | 'alert' | 'poll' | 'marketplace'>(initialTab);

  // Common text content
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Event specific fields
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('Saturday, Oct 24, 2026');
  const [eventTime, setEventTime] = useState('10:00 AM - 1:00 PM');
  const [eventLocation, setEventLocation] = useState('Maplewood Town Common');
  const [eventAddress, setEventAddress] = useState('450 North Common Way');
  const [eventCategory, setEventCategory] = useState<'Markets' | 'Festivals' | 'Civic & Volunteer' | 'Kids & Family' | 'Workshops' | 'Sports & Outdoors'>('Markets');
  const [eventCover, setEventCover] = useState('/src/assets/images/event_farmers_market_1792016689917.jpg');

  // Alert specific fields
  const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>('warning');
  const [alertType, setAlertType] = useState<'Lost Pet' | 'Traffic & Roads' | 'Public Works' | 'Safety' | 'Weather'>('Safety');

  // Marketplace fields
  const [itemTitle, setItemTitle] = useState('');
  const [itemPrice, setItemPrice] = useState('Free');
  const [itemCondition, setItemCondition] = useState<'New' | 'Like New' | 'Good' | 'Fair'>('Good');

  // Poll fields
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['Option 1', 'Option 2']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'event') {
      if (!eventTitle.trim()) return;
      const newEvent: EventDetails = {
        id: `event-${Date.now()}`,
        title: eventTitle.trim(),
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        address: eventAddress,
        category: eventCategory,
        coverImage: eventCover,
        organizer: currentUser.name,
        organizerAvatar: currentUser.avatar,
        rsvpCount: 1,
        userRsvp: 'going',
        attendees: [{ name: currentUser.name, avatar: currentUser.avatar }],
        description: content.trim() || `${eventTitle} organized by ${currentUser.name}. All neighbors welcome!`,
      };

      onCreateEvent(newEvent);

      // Also create an announcement post in feed
      onCreatePost({
        id: `post-${Date.now()}`,
        author: currentUser,
        createdAt: 'Just now',
        category: 'event',
        neighborhood: currentUser.neighborhood,
        content: content.trim() || `I am hosting an event for our neighborhood: ${eventTitle}! Check out details and RSVP below:`,
        event: newEvent,
        reactions: { like: 1, helpful: 0, heart: 1 },
        userReaction: 'like',
        comments: [],
      });
    } else if (activeTab === 'alert') {
      if (!content.trim()) return;
      onCreatePost({
        id: `post-${Date.now()}`,
        author: currentUser,
        createdAt: 'Just now',
        category: 'alert',
        alertSeverity,
        alertType,
        neighborhood: currentUser.neighborhood,
        content: content.trim(),
        reactions: { like: 0, helpful: 1, heart: 0 },
        comments: [],
      });
    } else if (activeTab === 'marketplace') {
      if (!itemTitle.trim() || !content.trim()) return;
      onCreatePost({
        id: `post-${Date.now()}`,
        author: currentUser,
        createdAt: 'Just now',
        category: 'marketplace',
        neighborhood: currentUser.neighborhood,
        content: content.trim(),
        image: selectedImage || undefined,
        marketplace: {
          itemTitle: itemTitle.trim(),
          price: itemPrice,
          condition: itemCondition,
          status: 'Available',
        },
        reactions: { like: 0, helpful: 0, heart: 0 },
        comments: [],
      });
    } else if (activeTab === 'poll') {
      if (!pollQuestion.trim()) return;
      onCreatePost({
        id: `post-${Date.now()}`,
        author: currentUser,
        createdAt: 'Just now',
        category: 'poll',
        neighborhood: currentUser.neighborhood,
        content: content.trim() || pollQuestion.trim(),
        poll: {
          question: pollQuestion.trim(),
          options: pollOptions.filter(o => o.trim()).map((text, idx) => ({
            id: `opt-${idx + 1}`,
            text,
            votes: 0,
          })),
          totalVotes: 0,
        },
        reactions: { like: 0, helpful: 0, heart: 0 },
        comments: [],
      });
    } else {
      // General Update
      if (!content.trim()) return;
      onCreatePost({
        id: `post-${Date.now()}`,
        author: currentUser,
        createdAt: 'Just now',
        category: 'general',
        neighborhood: currentUser.neighborhood,
        content: content.trim(),
        image: selectedImage || undefined,
        reactions: { like: 0, helpful: 0, heart: 0 },
        comments: [],
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base text-neutral-900">Create Community Post</h2>
            <span className="text-xs text-neutral-400">· {currentUser.neighborhood}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Type Selector Tabs */}
        <div className="px-4 pt-3 flex items-center gap-1 border-b border-neutral-100 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('update')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'update'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Update</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('event')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'event'
                ? 'bg-emerald-600 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Community Event</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('alert')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'alert'
                ? 'bg-rose-600 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Safety Alert</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'marketplace'
                ? 'bg-blue-600 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Free / For Sale</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('poll')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'poll'
                ? 'bg-purple-600 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Poll</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Author Badge */}
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-neutral-200"
            />
            <div>
              <span className="font-bold text-xs text-neutral-900 block">{currentUser.name}</span>
              <span className="text-[10px] text-neutral-500 font-medium">Posting to {currentUser.neighborhood}</span>
            </div>
          </div>

          {/* Event Specific Inputs */}
          {activeTab === 'event' && (
            <div className="space-y-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <div>
                <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maplewood Garden & Seed Exchange"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                    Category
                  </label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Markets">Markets & Food</option>
                    <option value="Festivals">Festivals & Social</option>
                    <option value="Civic & Volunteer">Civic & Volunteer</option>
                    <option value="Kids & Family">Kids & Family</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Sports & Outdoors">Sports & Outdoors</option>
                  </select>
                </div>
              </div>

              {/* Cover Photo Selection */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-900 mb-1.5">
                  Choose Event Banner Photo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Market', url: '/src/assets/images/event_farmers_market_1792016689917.jpg' },
                    { label: 'Block Party', url: '/src/assets/images/event_block_party_1792016689793.jpg' },
                    { label: 'Volunteer', url: '/src/assets/images/event_park_cleanup_1792016690687.jpg' },
                  ].map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setEventCover(img.url)}
                      className={`relative rounded-lg overflow-hidden h-16 border-2 transition-all ${
                        eventCover === img.url ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-neutral-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Alert Specific Inputs */}
          {activeTab === 'alert' && (
            <div className="space-y-3 p-3 bg-rose-50/50 rounded-xl border border-rose-100">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-rose-900 mb-1">
                    Alert Urgency
                  </label>
                  <select
                    value={alertSeverity}
                    onChange={(e) => setAlertSeverity(e.target.value as AlertSeverity)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-rose-600"
                  >
                    <option value="warning">Notice / Caution</option>
                    <option value="urgent">Urgent / Immediate Attention</option>
                    <option value="info">General Advisory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-rose-900 mb-1">
                    Category
                  </label>
                  <select
                    value={alertType}
                    onChange={(e) => setAlertType(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-rose-600"
                  >
                    <option value="Safety">Safety & Wildlife</option>
                    <option value="Lost Pet">Lost / Found Pet</option>
                    <option value="Traffic & Roads">Traffic & Road Closure</option>
                    <option value="Public Works">Public Works / Power</option>
                    <option value="Weather">Severe Weather</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Marketplace Inputs */}
          {activeTab === 'marketplace' && (
            <div className="space-y-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-blue-900 mb-1">
                    Item Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vintage wooden dining table"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-blue-900 mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    placeholder="Free or $25"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Poll Inputs */}
          {activeTab === 'poll' && (
            <div className="space-y-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100">
              <div>
                <label className="block text-[11px] font-bold text-purple-900 mb-1">
                  Poll Question *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Should we host an outdoor movie night in August?"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-purple-900 mb-1">
                  Options
                </label>
                <div className="space-y-1.5">
                  {pollOptions.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const copy = [...pollOptions];
                        copy[idx] = e.target.value;
                        setPollOptions(copy);
                      }}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-purple-600"
                    />
                  ))}
                  {pollOptions.length < 4 && (
                    <button
                      type="button"
                      onClick={() => setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`])}
                      className="text-[11px] text-purple-700 font-semibold hover:underline"
                    >
                      + Add another option
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Description / Content Box */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
              {activeTab === 'event' ? 'Event Description & Schedule' : 'Message to Neighbors *'}
            </label>
            <textarea
              rows={4}
              required={activeTab !== 'poll'}
              placeholder={
                activeTab === 'event'
                  ? 'Describe the event, what to bring, and directions...'
                  : activeTab === 'alert'
                  ? 'Details on location, time observed, and safety instructions...'
                  : 'Share details, photos, or ask for recommendations...'
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-emerald-600 placeholder:text-neutral-400"
            />
          </div>

          {/* Photo Attachment Section (Prominent Facebook-style photo selector) */}
          {activeTab !== 'event' && (
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Attach Image to Post</span>
                </span>
                {selectedImage && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Photo attached</span>
                  </span>
                )}
              </div>

              {selectedImage ? (
                <div className="space-y-2">
                  <div className="relative rounded-xl overflow-hidden h-44 bg-neutral-900 border border-neutral-300 shadow-xs group">
                    <img
                      src={selectedImage}
                      alt="Attached preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-lg shadow-sm transition-colors">
                        <span>Change Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                if (ev.target?.result) {
                                  setSelectedImage(ev.target.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setSelectedImage('')}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                      >
                        Remove
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedImage('')}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* File Upload or Preset Picker */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className="cursor-pointer border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800 transition-all text-center">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span>Upload Photo from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                setSelectedImage(ev.target.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {/* Direct Image URL input */}
                    <div className="flex items-center gap-1.5 bg-white border border-neutral-300 rounded-xl p-1.5">
                      <input
                        type="url"
                        placeholder="Paste image URL..."
                        value={selectedImage}
                        onChange={(e) => setSelectedImage(e.target.value)}
                        className="flex-1 px-2 py-1 text-xs outline-none bg-transparent placeholder:text-neutral-400"
                      />
                    </div>
                  </div>

                  {/* Neighborhood Gallery Presets */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 block mb-1.5">
                      Or select a community photo:
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { name: 'Farmers Market', url: '/src/assets/images/event_farmers_market_1792016689917.jpg' },
                        { name: 'Block Party', url: '/src/assets/images/event_block_party_1792016689793.jpg' },
                        { name: 'Park Cleanup', url: '/src/assets/images/event_park_cleanup_1792016690687.jpg' },
                        { name: 'Makers Fair', url: '/src/assets/images/post_art_craft_fair_1792016691027.jpg' },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setSelectedImage(preset.url)}
                          className="group relative h-14 rounded-lg overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all"
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] font-semibold py-0.5 px-1 truncate text-center block">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400">
              Only verified residents in {currentUser.neighborhood}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-xs transition-colors"
              >
                Publish to Community
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
