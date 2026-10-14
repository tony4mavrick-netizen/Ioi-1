import React from 'react';
import { 
  Calendar, 
  AlertTriangle, 
  Image as ImageIcon, 
  BarChart2, 
  Tag, 
  Sparkles,
  SearchX,
  Plus
} from 'lucide-react';
import { Post, User, EventDetails, PostCategory, Neighborhood } from '../types/community';
import { PostCard } from './PostCard';

interface FeedViewProps {
  posts: Post[];
  currentUser: User;
  selectedCategory: PostCategory | 'all' | 'saved';
  onSelectCategory: (cat: PostCategory | 'all' | 'saved') => void;
  selectedNeighborhood: Neighborhood;
  onOpenCreateModal: (defaultTab?: 'update' | 'event' | 'alert' | 'poll' | 'marketplace') => void;
  onReact: (postId: string, reactionType: 'like' | 'helpful' | 'heart') => void;
  onAddComment: (postId: string, text: string) => void;
  onToggleCommentLike: (postId: string, commentId: string) => void;
  onToggleSave: (postId: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onRsvpEvent: (eventId: string, status: 'going' | 'interested' | 'declined') => void;
  onSelectEvent: (event: EventDetails) => void;
  onSelectAuthor: (author: User) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  currentUser,
  selectedCategory,
  onSelectCategory,
  selectedNeighborhood,
  onOpenCreateModal,
  onReact,
  onAddComment,
  onToggleCommentLike,
  onToggleSave,
  onVotePoll,
  onRsvpEvent,
  onSelectEvent,
  onSelectAuthor,
}) => {
  return (
    <div className="space-y-4">
      {/* Quick Composer Box (Facebook / Nextdoor Style) */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
          />
          <button
            onClick={() => onOpenCreateModal('update')}
            className="flex-1 text-left px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200/70 rounded-full text-xs text-neutral-500 font-medium transition-colors"
          >
            What is happening on your street, {currentUser.name.split(' ')[0]}?
          </button>
        </div>

        {/* Quick action shortcuts */}
        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between gap-1 text-xs overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => onOpenCreateModal('update')}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-neutral-700 hover:text-emerald-700 hover:bg-neutral-50 rounded-lg transition-colors font-semibold whitespace-nowrap shrink-0"
          >
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <span>Photo / Image</span>
          </button>

          <button
            onClick={() => onOpenCreateModal('event')}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-neutral-700 hover:text-emerald-700 hover:bg-neutral-50 rounded-lg transition-colors font-semibold whitespace-nowrap shrink-0"
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Add Event</span>
          </button>

          <button
            onClick={() => onOpenCreateModal('alert')}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-neutral-700 hover:text-rose-700 hover:bg-neutral-50 rounded-lg transition-colors font-semibold whitespace-nowrap shrink-0"
          >
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Safety Alert</span>
          </button>

          <button
            onClick={() => onOpenCreateModal('marketplace')}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-neutral-700 hover:text-blue-700 hover:bg-neutral-50 rounded-lg transition-colors font-semibold whitespace-nowrap shrink-0"
          >
            <Tag className="w-4 h-4 text-blue-500" />
            <span>Free / Sale</span>
          </button>

          <button
            onClick={() => onOpenCreateModal('poll')}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-neutral-700 hover:text-purple-700 hover:bg-neutral-50 rounded-lg transition-colors font-semibold whitespace-nowrap shrink-0"
          >
            <BarChart2 className="w-4 h-4 text-purple-500" />
            <span>Ask Poll</span>
          </button>
        </div>
      </div>

      {/* Feed Filters Segmented Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-neutral-900 text-white'
              : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200'
          }`}
        >
          All Updates
        </button>

        <button
          onClick={() => onSelectCategory('event')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            selectedCategory === 'event'
              ? 'bg-neutral-900 text-white'
              : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Events</span>
        </button>

        <button
          onClick={() => onSelectCategory('alert')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            selectedCategory === 'alert'
              ? 'bg-neutral-900 text-white'
              : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span>Safety Notices</span>
        </button>

        <button
          onClick={() => onSelectCategory('recommendation')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            selectedCategory === 'recommendation'
              ? 'bg-neutral-900 text-white'
              : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Recommendations</span>
        </button>

        <button
          onClick={() => onSelectCategory('marketplace')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            selectedCategory === 'marketplace'
              ? 'bg-neutral-900 text-white'
              : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200'
          }`}
        >
          <Tag className="w-3.5 h-3.5 text-blue-500" />
          <span>Free & For Sale</span>
        </button>
      </div>

      {/* Feed Stream */}
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onReact={onReact}
              onAddComment={onAddComment}
              onToggleCommentLike={onToggleCommentLike}
              onToggleSave={onToggleSave}
              onVotePoll={onVotePoll}
              onRsvpEvent={onRsvpEvent}
              onSelectEvent={onSelectEvent}
              onSelectAuthor={onSelectAuthor}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <SearchX className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">No posts found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              There are no updates in this category for {selectedNeighborhood}. Be the first neighbor to start the conversation!
            </p>
          </div>
          <button
            onClick={() => onOpenCreateModal('update')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Post</span>
          </button>
        </div>
      )}
    </div>
  );
};
