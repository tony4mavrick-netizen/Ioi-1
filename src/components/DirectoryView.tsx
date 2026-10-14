import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  Search, 
  Heart, 
  Sparkles, 
  Send, 
  Check, 
  X,
  Clock
} from 'lucide-react';
import { User, Neighborhood, AppNotification } from '../types/community';

interface DirectoryViewProps {
  users: User[];
  currentUser: User;
  onSelectAuthor: (user: User) => void;
  selectedNeighborhood: Neighborhood;
  onTriggerNotification?: (notif: AppNotification) => void;
}

interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  users,
  currentUser,
  onSelectAuthor,
  selectedNeighborhood,
  onTriggerNotification,
}) => {
  const [search, setSearch] = useState('');
  const [messagingUser, setMessagingUser] = useState<User | null>(null);
  const [messageText, setMessageText] = useState('');
  const [chatHistory, setChatHistory] = useState<Record<string, DirectMessage[]>>({
    'user-elena': [
      {
        id: 'm1',
        senderId: 'user-elena',
        senderName: 'Elena Rostova',
        senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        text: 'Hi neighbor! Thanks for lending the pruning shears last week. I left some freshly baked pumpkin bread on your porch.',
        timestamp: 'Yesterday at 5:15 PM',
      },
    ],
    'user-marcus': [
      {
        id: 'm2',
        senderId: 'user-marcus',
        senderName: 'Marcus Chen',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Hey Tony, will make sure to save two fresh sourdough batards for you at Saturday morning market!',
        timestamp: '3 days ago',
      },
    ],
  });

  const filteredUsers = users.filter((u) => {
    if (search.trim()) {
      const match = (u.name + u.street + u.neighborhood + (u.badge || '') + (u.bio || '')).toLowerCase();
      if (!match.includes(search.toLowerCase())) return false;
    }
    if (selectedNeighborhood !== 'All Neighborhoods' && u.neighborhood !== selectedNeighborhood) {
      return false;
    }
    return true;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !messagingUser) return;

    const userMessage: DirectMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: messageText.trim(),
      timestamp: 'Just now',
    };

    const targetUserId = messagingUser.id;
    const targetUserName = messagingUser.name;
    const targetUserAvatar = messagingUser.avatar;
    const targetUserStreet = messagingUser.street;

    setChatHistory((prev) => ({
      ...prev,
      [targetUserId]: [...(prev[targetUserId] || []), userMessage],
    }));

    setMessageText('');

    // Simulate neighbor response after a brief delay
    setTimeout(() => {
      const replies = [
        `Thanks for reaching out, ${currentUser.name.split(' ')[0]}! Great to hear from you. I will see you around the neighborhood!`,
        `Hi ${currentUser.name.split(' ')[0]}! Thanks for the note. Let's catch up at the upcoming block event!`,
        `Got your note! Appreciate you reaching out neighbor. Have a wonderful week!`,
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const neighborReply: DirectMessage = {
        id: `msg-${Date.now()}`,
        senderId: targetUserId,
        senderName: targetUserName,
        senderAvatar: targetUserAvatar,
        text: randomReply,
        timestamp: 'Just now',
      };

      setChatHistory((prev) => ({
        ...prev,
        [targetUserId]: [...(prev[targetUserId] || []), neighborReply],
      }));

      // Trigger global notification alert + audio chime!
      if (onTriggerNotification) {
        onTriggerNotification({
          id: `notif-${Date.now()}`,
          type: 'comment',
          title: `Direct Note from ${targetUserName}`,
          message: `"${randomReply}"`,
          timestamp: 'Just now',
          createdAtMs: Date.now(),
          read: false,
          sender: {
            name: targetUserName,
            avatar: targetUserAvatar,
            street: targetUserStreet,
          },
          targetType: 'post',
          priority: 'normal',
        });
      }
    }, 1400);
  };

  const currentThread = messagingUser ? chatHistory[messagingUser.id] || [] : [];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>VERIFIED RESIDENTS & LOCAL BUSINESSES</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Neighbor Directory
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Meet your local neighbors, community stewards, and neighborhood artisans living in {selectedNeighborhood}.
        </p>

        {/* Search */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by neighbor or street..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-100/80 focus:bg-white border border-neutral-200 focus:border-emerald-500 rounded-lg outline-none transition-all placeholder:text-neutral-400"
            />
          </div>
          <span className="text-xs text-neutral-500 font-medium tabular-nums hidden sm:block">
            {filteredUsers.length} verified residents
          </span>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-3.5">
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/20 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-neutral-900 truncate">
                      {user.name}
                    </h3>
                    {user.isVerified && (
                      <span className="text-emerald-600 shrink-0" title="Verified Address">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  {user.badge && (
                    <span className="text-[11px] font-semibold text-emerald-700 block truncate">
                      {user.badge}
                    </span>
                  )}
                  <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                    <span>{user.street}</span>
                  </p>
                </div>
              </div>

              {user.bio && (
                <p className="text-xs text-neutral-600 mt-3.5 line-clamp-2 leading-relaxed">
                  {user.bio}
                </p>
              )}

              <div className="mt-3 pt-3 border-t border-neutral-100 text-[11px] text-neutral-400 flex items-center justify-between">
                <span>Neighbor since {user.joinedYear}</span>
                <span>{user.neighborhood}</span>
              </div>
            </div>

            <div className="mt-4 pt-2">
              <button
                onClick={() => setMessagingUser(user)}
                className="w-full py-2 text-xs font-semibold text-neutral-700 hover:text-emerald-800 bg-neutral-100 hover:bg-emerald-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Say Hello / Message</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Two-Way Chat Modal */}
      {messagingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-neutral-200 overflow-hidden flex flex-col h-[520px]">
            {/* Modal Header */}
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-3">
                <img
                  src={messagingUser.avatar}
                  alt={messagingUser.name}
                  className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-neutral-900">{messagingUser.name}</h3>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-[10px] text-neutral-500">{messagingUser.street} · {messagingUser.neighborhood}</p>
                </div>
              </div>

              <button
                onClick={() => setMessagingUser(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-100/40">
              <div className="text-center py-1">
                <span className="text-[10px] text-neutral-400 bg-white px-2 py-0.5 rounded-full border border-neutral-200/80">
                  Direct Neighbor Note
                </span>
              </div>

              {currentThread.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
                  >
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-neutral-200"
                    />
                    <div className={`max-w-[75%] rounded-2xl p-3 text-xs shadow-2xs ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-tr-xs'
                        : 'bg-white text-neutral-800 border border-neutral-200/80 rounded-tl-xs'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <span className={`text-[9px] block mt-1 font-mono tabular-nums ${
                        isMe ? 'text-emerald-100 text-right' : 'text-neutral-400'
                      }`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-100 bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder={`Write to ${messagingUser.name.split(' ')[0]}...`}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-neutral-200 focus:border-emerald-600 rounded-full outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-full transition-colors shrink-0 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
