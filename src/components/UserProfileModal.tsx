import React from 'react';
import { X, MapPin, ShieldCheck, Calendar, MessageSquare, Award } from 'lucide-react';
import { User, Post } from '../types/community';

interface UserProfileModalProps {
  user: User | null;
  onClose: () => void;
  userPosts: Post[];
  onOpenMessage?: (user: User) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  onClose,
  userPosts,
  onOpenMessage,
}) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        
        {/* Cover / Profile Header */}
        <div className="h-28 bg-gradient-to-r from-emerald-700 to-teal-800 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar floating above banner */}
          <div className="flex items-end justify-between -mt-12 mb-3">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
            />
            {onOpenMessage && (
              <button
                onClick={() => onOpenMessage(user)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message</span>
              </button>
            )}
          </div>

          {/* Name & Badges */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-neutral-900">{user.name}</h2>
              {user.isVerified && (
                <span className="text-emerald-600 flex items-center gap-1 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Resident</span>
                </span>
              )}
            </div>

            {user.badge && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-neutral-100 text-xs font-semibold text-neutral-700">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>{user.badge}</span>
              </div>
            )}

            <p className="flex items-center gap-1.5 text-xs text-neutral-500 pt-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{user.street} · {user.neighborhood}</span>
            </p>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="mt-4 p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs text-neutral-700 leading-relaxed">
              {user.bio}
            </div>
          )}

          {/* Joined info */}
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-neutral-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Community member since {user.joinedYear}</span>
          </div>

          {/* Recent Neighborhood Activity */}
          <div className="mt-6 pt-4 border-t border-neutral-100">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
              Recent Activity & Posts ({userPosts.length})
            </h3>

            {userPosts.length > 0 ? (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {userPosts.map((post) => (
                  <div key={post.id} className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200/60 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                      <span className="font-semibold text-emerald-800 uppercase">{post.category}</span>
                      <span>{post.createdAt}</span>
                    </div>
                    <p className="text-neutral-800 line-clamp-2">{post.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 italic">No public updates yet.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
