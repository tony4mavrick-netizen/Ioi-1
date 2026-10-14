import React, { useState } from 'react';
import { 
  ThumbsUp, 
  Lightbulb, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  MapPin, 
  ShieldAlert, 
  Calendar, 
  Tag, 
  Send, 
  Check, 
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Post, User, EventDetails } from '../types/community';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onReact: (postId: string, reactionType: 'like' | 'helpful' | 'heart') => void;
  onAddComment: (postId: string, text: string) => void;
  onToggleCommentLike: (postId: string, commentId: string) => void;
  onToggleSave: (postId: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onRsvpEvent?: (eventId: string, status: 'going' | 'interested' | 'declined') => void;
  onSelectEvent?: (event: EventDetails) => void;
  onSelectAuthor?: (author: User) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onReact,
  onAddComment,
  onToggleCommentLike,
  onToggleSave,
  onVotePoll,
  onRsvpEvent,
  onSelectEvent,
  onSelectAuthor,
}) => {
  const [showComments, setShowComments] = useState(post.comments.length > 0);
  const [commentText, setCommentText] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText('');
    setShowComments(true);
  };

  return (
    <article className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden transition-all">
      {/* Alert Header if Post is an Alert */}
      {post.category === 'alert' && (
        <div className={`px-4 py-2 flex items-center justify-between text-xs font-semibold ${
          post.alertSeverity === 'urgent'
            ? 'bg-rose-600 text-white'
            : post.alertSeverity === 'warning'
            ? 'bg-amber-500 text-neutral-900'
            : 'bg-neutral-800 text-white'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Community Alert: {post.alertType || 'Notice'}</span>
          </div>
          <span className="text-[11px] uppercase tracking-wider font-bold">
            {post.alertSeverity || 'Notice'}
          </span>
        </div>
      )}

      <div className="p-4 sm:p-5">
        {/* Post Header: Author info & metadata */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectAuthor?.(post.author)}
              className="relative shrink-0 focus:outline-none"
            >
              <img
                src={post.author.avatar}
                alt={post.author.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-neutral-200 hover:ring-2 hover:ring-emerald-500 transition-all"
              />
            </button>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => onSelectAuthor?.(post.author)}
                  className="font-bold text-sm text-neutral-900 hover:text-emerald-700 transition-colors text-left"
                >
                  {post.author.name}
                </button>
                {post.author.isVerified && (
                  <span className="text-emerald-600" title="Verified Local Resident">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
                {post.author.badge && (
                  <span className="text-xs text-neutral-500 font-medium">
                    · {post.author.badge}
                  </span>
                )}
              </div>

              {/* Clean unboxed metadata according to frontend design guidelines */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                <span className="font-medium text-neutral-700">{post.author.street}</span>
                <span aria-hidden="true">·</span>
                <span>{post.neighborhood}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  {post.createdAt}
                </span>
              </div>
            </div>
          </div>

          {/* Save / Bookmark Button */}
          <button
            onClick={() => onToggleSave(post.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              post.isSaved
                ? 'text-purple-600 bg-purple-50'
                : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100'
            }`}
            title={post.isSaved ? 'Saved to bookmarks' : 'Save post'}
          >
            <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Post Text Content */}
        <p className="text-sm text-neutral-800 leading-relaxed whitespace-pre-line mb-3">
          {post.content}
        </p>

        {/* Embedded Post Image */}
        {post.image && (
          <div className="mb-3 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
            <img
              src={post.image}
              alt="Community update visual"
              referrerPolicy="no-referrer"
              className="w-full max-h-96 object-cover hover:scale-[1.01] transition-transform duration-200"
            />
          </div>
        )}

        {/* Embedded Event Card (If post is an event) */}
        {post.event && (
          <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 transition-all">
            <div className="flex flex-col sm:flex-row gap-4">
              {post.event.coverImage && (
                <div className="w-full sm:w-44 h-32 rounded-lg overflow-hidden shrink-0 bg-neutral-200">
                  <img
                    src={post.event.coverImage}
                    alt={post.event.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>COMMUNITY EVENT · {post.event.category}</span>
                </div>
                <h4 className="font-bold text-base text-neutral-900 leading-snug">
                  {post.event.title}
                </h4>
                <div className="mt-2 space-y-1 text-xs text-neutral-600">
                  <p className="font-semibold text-neutral-900">
                    📅 {post.event.date} · {post.event.time}
                  </p>
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{post.event.location}</span>
                  </p>
                </div>

                {/* Event Actions & RSVP */}
                <div className="mt-3 pt-3 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-700 tabular-nums">
                      {post.event.rsvpCount} Neighbors Attending
                    </span>
                    <div className="flex -space-x-1.5">
                      {post.event.attendees.slice(0, 3).map((a, i) => (
                        <img
                          key={i}
                          src={a.avatar}
                          alt={a.name}
                          className="w-5 h-5 rounded-full ring-2 ring-white object-cover"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onRsvpEvent?.(post.event!.id, post.event!.userRsvp === 'going' ? 'declined' : 'going')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                        post.event.userRsvp === 'going'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300'
                      }`}
                    >
                      {post.event.userRsvp === 'going' ? 'Going ✓' : 'RSVP Going'}
                    </button>
                    {onSelectEvent && (
                      <button
                        onClick={() => onSelectEvent(post.event!)}
                        className="px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-md transition-colors"
                      >
                        Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Embedded Marketplace / Curb Alert Card */}
        {post.marketplace && (
          <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3.5 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 mb-0.5">
                <Tag className="w-3.5 h-3.5" />
                <span>NEIGHBORHOOD LISTING</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900">{post.marketplace.itemTitle}</h4>
              <p className="text-xs text-neutral-600 mt-0.5">Condition: {post.marketplace.condition}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg font-bold text-emerald-700 font-mono">
                {post.marketplace.price}
              </span>
              <p className="text-[11px] text-neutral-500 font-semibold">{post.marketplace.status}</p>
            </div>
          </div>
        )}

        {/* Embedded Community Poll */}
        {post.poll && (
          <div className="mb-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
            <h4 className="text-xs font-bold text-neutral-900 mb-2.5">
              {post.poll.question}
            </h4>
            <div className="space-y-2">
              {post.poll.options.map((opt) => {
                const percentage = post.poll!.totalVotes > 0 
                  ? Math.round((opt.votes / post.poll!.totalVotes) * 100) 
                  : 0;
                const isUserVote = post.poll!.userVotedOptionId === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => onVotePoll(post.id, opt.id)}
                    className={`w-full text-left relative overflow-hidden rounded-lg border p-2.5 text-xs transition-all ${
                      isUserVote 
                        ? 'border-emerald-600 bg-emerald-50/50 font-semibold' 
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    {/* Visual Progress Bar */}
                    <div 
                      className="absolute inset-y-0 left-0 bg-emerald-100/60 -z-0 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                    
                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <span className="text-neutral-900 flex items-center gap-1.5">
                        {isUserVote && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        {opt.text}
                      </span>
                      <span className="font-mono text-neutral-500 text-[11px] shrink-0 tabular-nums">
                        {percentage}% ({opt.votes})
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-neutral-400 font-medium mt-2 tabular-nums">
              {post.poll.totalVotes} total neighbor votes
            </p>
          </div>
        )}

        {/* Reaction Bar & Engagement Counters */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 font-semibold text-neutral-700 tabular-nums">
              <span className="text-sm">👍</span>
              <span>{post.reactions.like + post.reactions.helpful + post.reactions.heart}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowComments(!showComments)}
              className="hover:underline text-neutral-600 font-medium tabular-nums"
            >
              {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
            </button>
          </div>
        </div>

        {/* Primary Interactive Action Buttons (Like / Helpful / Heart / Comment / Share) */}
        <div className="mt-2 pt-2 border-t border-neutral-100 grid grid-cols-4 gap-1 text-xs">
          {/* Like Button */}
          <button
            onClick={() => onReact(post.id, 'like')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold transition-colors ${
              post.userReaction === 'like'
                ? 'text-emerald-700 bg-emerald-50'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${post.userReaction === 'like' ? 'fill-current' : ''}`} />
            <span>Like</span>
          </button>

          {/* Helpful Button (Community Specific) */}
          <button
            onClick={() => onReact(post.id, 'helpful')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold transition-colors ${
              post.userReaction === 'helpful'
                ? 'text-amber-700 bg-amber-50'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Lightbulb className={`w-4 h-4 ${post.userReaction === 'helpful' ? 'fill-current' : ''}`} />
            <span>Helpful</span>
          </button>

          {/* Comment Toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Comment</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            {copiedShare ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* Comment Thread Section */}
        {showComments && (
          <div className="mt-3 pt-3 border-t border-neutral-100 space-y-3">
            {/* Existing Comments */}
            {post.comments.length > 0 && (
              <div className="space-y-2.5">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                    <img
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-neutral-200"
                    />
                    <div className="flex-1 bg-neutral-50 rounded-xl p-2.5 border border-neutral-200/80">
                      <div className="flex items-baseline justify-between mb-0.5">
                        <span className="font-bold text-neutral-900">{comment.authorName}</span>
                        <span className="text-[11px] text-neutral-400">{comment.createdAt}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-medium block mb-1">
                        {comment.authorStreet}
                      </span>
                      <p className="text-neutral-800 leading-normal">{comment.content}</p>

                      {/* Comment Reaction */}
                      <div className="mt-1.5 flex items-center gap-3 text-[11px] text-neutral-500">
                        <button
                          onClick={() => onToggleCommentLike(post.id, comment.id)}
                          className={`font-semibold hover:underline flex items-center gap-1 ${
                            comment.userLiked ? 'text-emerald-700' : 'text-neutral-600'
                          }`}
                        >
                          Like {comment.likes > 0 && `(${comment.likes})`}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover shrink-0 border border-neutral-200"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={`Reply as ${currentUser.name}...`}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 text-xs bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 focus:border-emerald-500 rounded-full outline-none transition-all placeholder:text-neutral-400"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-600 disabled:text-neutral-300 hover:text-emerald-700 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </article>
  );
};
