import React, { useState, useRef, useEffect } from 'react';
import { 
  Film, 
  Heart, 
  MessageSquare, 
  Share2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Music, 
  Check, 
  MapPin, 
  X, 
  Send,
  Eye,
  Clock,
  Sparkles,
  Compass
} from 'lucide-react';
import { CommunityReel, User, Neighborhood } from '../types/community';

interface ReelsViewProps {
  reels: CommunityReel[];
  currentUser: User;
  selectedNeighborhood: Neighborhood;
  onLikeReel: (reelId: string) => void;
  onAddReelComment: (reelId: string, text: string) => void;
  onCreateReel: (newReel: Partial<CommunityReel>) => void;
  onSelectAuthor: (author: User) => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  reels,
  currentUser,
  selectedNeighborhood,
  onLikeReel,
  onAddReelComment,
  onCreateReel,
  onSelectAuthor,
}) => {
  const [activeTab, setActiveTab] = useState<'reels' | 'videos'>('reels');
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New reel form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'Reels' | 'Nature & Parks' | 'Food & Sourdough' | 'Events' | 'Crafts' | 'Wildlife'>('Reels');
  const [newVideoUrl, setNewVideoUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-vegetables-at-a-farmers-market-43405-large.mp4');
  const [newAudioTrack, setNewAudioTrack] = useState('TownSquare Ambient Acoustic');
  const [newAspectRatio, setNewAspectRatio] = useState<'9:16' | '16:9'>('9:16');

  // Video element ref
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Filter reels by neighborhood if specific enclave selected
  const availableReels = reels.filter((r) => {
    if (selectedNeighborhood === 'All Neighborhoods') return true;
    return r.neighborhood === selectedNeighborhood || r.neighborhood === 'All Neighborhoods';
  });

  const currentReel = availableReels[activeReelIndex] || availableReels[0] || reels[0];

  // Keyboard navigation for reels
  useEffect(() => {
    if (activeTab !== 'reels') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextReel();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevReel();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, activeReelIndex, availableReels.length]);

  const handleNextReel = () => {
    if (availableReels.length === 0) return;
    setActiveReelIndex((prev) => (prev + 1) % availableReels.length);
    setIsPlaying(true);
  };

  const handlePrevReel = () => {
    if (availableReels.length === 0) return;
    setActiveReelIndex((prev) => (prev - 1 + availableReels.length) % availableReels.length);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !currentReel) return;
    onAddReelComment(currentReel.id, commentInput.trim());
    setCommentInput('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateReel({
      id: `reel-${Date.now()}`,
      author: currentUser,
      title: newTitle.trim(),
      description: newDesc.trim() || newTitle.trim(),
      videoUrl: newVideoUrl,
      thumbnailUrl: '/src/assets/images/event_block_party_1792016689793.jpg',
      durationStr: '0:35',
      views: 1,
      likes: 1,
      userLiked: true,
      comments: [],
      audioTrackName: newAudioTrack || 'Original Audio',
      category: newCategory,
      neighborhood: currentUser.neighborhood,
      createdAt: 'Just now',
      aspectRatio: newAspectRatio,
    });

    setNewTitle('');
    setNewDesc('');
    setShowCreateModal(false);
    setActiveTab('reels');
    setActiveReelIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
              <Film className="w-4 h-4 text-emerald-600" />
              <span>COMMUNITY REELS & LOCAL VIDEO</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Neighborhood Videos
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Watch short reels, farmers market updates, trail cams, baking clips, and artisan moments from around town.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher: Vertical Reels vs Video Grid */}
            <div className="flex items-center p-1 bg-neutral-100 rounded-lg border border-neutral-200/60">
              <button
                onClick={() => setActiveTab('reels')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'reels'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Community Reels
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'videos'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Watch Grid
              </button>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Post Video / Reel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vertical Reel Viewer Mode (Facebook / Instagram Reels style) */}
      {activeTab === 'reels' && currentReel && (
        <div className="flex items-center justify-center py-2">
          <div className="relative flex items-center gap-4 max-w-full">
            
            {/* Reel Container Card (9:16 format) */}
            <div className="relative w-[340px] sm:w-[380px] h-[600px] sm:h-[640px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col justify-between select-none">
              
              {/* HTML5 Video Layer */}
              <div 
                className="absolute inset-0 cursor-pointer flex items-center justify-center bg-neutral-900"
                onClick={togglePlayPause}
              >
                <video
                  ref={videoRef}
                  src={currentReel.videoUrl}
                  poster={currentReel.thumbnailUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Big Center Play/Pause indicator when paused */}
                {!isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur">
                      <Play className="w-8 h-8 ml-1 fill-current" />
                    </div>
                  </div>
                )}
              </div>

              {/* Gradient Overlay for Text Legibility */}
              <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

              {/* Top Controls: Sound & Category */}
              <div className="relative z-10 p-4 flex items-center justify-between">
                <span className="bg-black/50 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                  {currentReel.category} · {currentReel.neighborhood}
                </span>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Bottom Details & Author Overlay */}
              <div className="relative z-10 p-5 space-y-2.5 text-white">
                {/* Author row */}
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentReel.author.avatar}
                    alt={currentReel.author.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => onSelectAuthor(currentReel.author)}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span 
                        className="font-bold text-sm hover:underline cursor-pointer"
                        onClick={() => onSelectAuthor(currentReel.author)}
                      >
                        {currentReel.author.name}
                      </span>
                      {currentReel.author.isVerified && (
                        <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-300 block">
                      {currentReel.author.street} · {currentReel.createdAt}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-sm leading-snug line-clamp-2">
                    {currentReel.title}
                  </h3>
                  <p className="text-xs text-neutral-200 mt-1 line-clamp-2 leading-relaxed">
                    {currentReel.description}
                  </p>
                </div>

                {/* Audio Track Tag */}
                <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-300">
                  <Music className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
                  <span className="truncate max-w-[240px] font-medium">{currentReel.audioTrackName}</span>
                </div>
              </div>

              {/* Side Floating Action Bar (Right side of reel) */}
              <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4">
                {/* Like Button */}
                <button
                  onClick={() => onLikeReel(currentReel.id)}
                  className="flex flex-col items-center gap-1 group focus:outline-none"
                >
                  <div className={`p-2.5 rounded-full backdrop-blur transition-all ${
                    currentReel.userLiked
                      ? 'bg-rose-600 text-white shadow-rose-900/40 shadow-lg scale-110'
                      : 'bg-black/50 text-white hover:bg-black/70'
                  }`}>
                    <Heart className={`w-5 h-5 ${currentReel.userLiked ? 'fill-current' : ''}`} />
                  </div>
                  <span className="text-[11px] font-bold text-white tabular-nums drop-shadow">
                    {currentReel.likes}
                  </span>
                </button>

                {/* Comment Button */}
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex flex-col items-center gap-1 group focus:outline-none"
                >
                  <div className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-white tabular-nums drop-shadow">
                    {currentReel.comments.length}
                  </span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center gap-1 group focus:outline-none"
                  title="Share reel"
                >
                  <div className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur transition-colors">
                    {copiedShare ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
                  </div>
                  <span className="text-[10px] font-bold text-white drop-shadow">
                    {copiedShare ? 'Copied' : 'Share'}
                  </span>
                </button>

                {/* View Count */}
                <div className="flex flex-col items-center text-white/80 text-[10px] font-mono tabular-nums pt-1">
                  <Eye className="w-3.5 h-3.5 mb-0.5" />
                  <span>{currentReel.views}</span>
                </div>
              </div>

              {/* Slide-over Comments Drawer */}
              {showComments && (
                <div className="absolute inset-x-0 bottom-0 top-32 z-30 bg-neutral-900/95 backdrop-blur-md text-white p-4 rounded-t-3xl flex flex-col justify-between border-t border-neutral-700 animate-in slide-in-from-bottom-10">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <span className="font-bold text-xs">Comments ({currentReel.comments.length})</span>
                    <button
                      onClick={() => setShowComments(false)}
                      className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto py-3 space-y-2.5 text-xs">
                    {currentReel.comments.length > 0 ? (
                      currentReel.comments.map((c) => (
                        <div key={c.id} className="flex items-start gap-2 bg-neutral-800/60 p-2.5 rounded-xl">
                          <img
                            src={c.authorAvatar}
                            alt={c.authorName}
                            className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-neutral-200">{c.authorName}</span>
                              <span className="text-[10px] text-neutral-400">{c.createdAt}</span>
                            </div>
                            <p className="text-neutral-300 mt-0.5">{c.content}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-neutral-400 py-6 italic text-xs">
                        No comments yet. Be the first neighbor to reply!
                      </p>
                    )}
                  </div>

                  {/* Comment input */}
                  <form onSubmit={handleCommentSubmit} className="pt-2 border-t border-neutral-800 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add neighbor comment..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-neutral-800 border border-neutral-700 rounded-full text-white placeholder:text-neutral-400 outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={!commentInput.trim()}
                      className="p-2 bg-emerald-600 disabled:opacity-40 text-white rounded-full transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

            </div>

            {/* Vertical Next/Prev Arrows Navigation */}
            <div className="hidden sm:flex flex-col gap-2">
              <button
                onClick={handlePrevReel}
                className="p-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 shadow-md border border-neutral-200 transition-all hover:scale-105 active:scale-95"
                title="Previous Reel (or Up Arrow)"
              >
                <ChevronUp className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextReel}
                className="p-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 shadow-md border border-neutral-200 transition-all hover:scale-105 active:scale-95"
                title="Next Reel (or Down Arrow)"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Grid Mode: Facebook Watch / Community Video Grid */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {availableReels.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => {
                setActiveReelIndex(idx);
                setActiveTab('reels');
              }}
            >
              <div>
                <div className="relative h-48 bg-neutral-900 overflow-hidden">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/60 group-hover:bg-emerald-600 text-white flex items-center justify-center backdrop-blur transition-all group-hover:scale-110">
                      <Play className="w-6 h-6 ml-1 fill-current" />
                    </div>
                  </div>

                  <span className="absolute bottom-2.5 right-2.5 bg-black/75 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    {item.durationStr}
                  </span>

                  <span className="absolute top-2.5 left-2.5 bg-neutral-900/80 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-sm text-neutral-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <img
                    src={item.author.avatar}
                    alt={item.author.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="font-medium text-neutral-700">{item.author.name}</span>
                </div>

                <div className="flex items-center gap-3 font-mono tabular-nums text-[11px]">
                  <span>❤️ {item.likes}</span>
                  <span>💬 {item.comments.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Reel / Video Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-neutral-900">Post a Neighborhood Reel / Video</h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sourdough scoring demonstration at Highland Bakery"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Format
                  </label>
                  <select
                    value={newAspectRatio}
                    onChange={(e) => setNewAspectRatio(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="9:16">Vertical Reel (9:16)</option>
                    <option value="16:9">Landscape Video (16:9)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="Reels">Reels & Moments</option>
                    <option value="Nature & Parks">Nature & Parks</option>
                    <option value="Food & Sourdough">Food & Cooking</option>
                    <option value="Crafts">Artisans & Crafts</option>
                    <option value="Events">Local Events & Music</option>
                    <option value="Wildlife">Neighborhood Wildlife</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Audio / Sound Track Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maplewood Morning Birds, Highland Acoustic"
                  value={newAudioTrack}
                  onChange={(e) => setNewAudioTrack(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Video Source (Upload or URL)
                </label>
                <div className="space-y-2">
                  <label className="cursor-pointer px-3 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 transition-colors flex items-center justify-center gap-2">
                    <Film className="w-4 h-4 text-emerald-600" />
                    <span>Upload Video File (.mp4, .webm)</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setNewVideoUrl(url);
                        }
                      }}
                    />
                  </label>
                  <input
                    type="url"
                    placeholder="Or paste direct video MP4 URL..."
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Description / Caption
                </label>
                <textarea
                  rows={2}
                  placeholder="What is happening in this clip?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
                >
                  Publish Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
