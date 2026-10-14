export type Neighborhood = 
  | 'All Neighborhoods'
  | 'Maplewood Heights'
  | 'Oakridge Village'
  | 'Old Town Commons'
  | 'Riverside Arts District';

export type PostCategory = 
  | 'general'
  | 'event'
  | 'alert'
  | 'recommendation'
  | 'marketplace'
  | 'poll';

export type AlertSeverity = 'info' | 'warning' | 'urgent';

export interface User {
  id: string;
  name: string;
  avatar: string;
  neighborhood: Neighborhood;
  street: string;
  badge?: string;
  bio?: string;
  isVerified: boolean;
  joinedYear: number;
}

export interface Comment {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  authorStreet: string;
  content: string;
  createdAt: string;
  likes: number;
  userLiked?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface EventDetails {
  id: string;
  title: string;
  date: string; // e.g., "Saturday, Oct 18, 2026"
  time: string; // e.g., "9:00 AM - 1:00 PM"
  location: string;
  address: string;
  category: 'Markets' | 'Festivals' | 'Civic & Volunteer' | 'Kids & Family' | 'Workshops' | 'Sports & Outdoors';
  coverImage?: string;
  organizer: string;
  organizerAvatar?: string;
  rsvpCount: number;
  userRsvp?: 'going' | 'interested' | 'declined' | null;
  attendees: { name: string; avatar: string }[];
  description?: string;
}

export interface Post {
  id: string;
  author: User;
  createdAt: string;
  category: PostCategory;
  content: string;
  image?: string;
  neighborhood: Neighborhood;
  
  // Specific category attachments
  alertSeverity?: AlertSeverity;
  alertType?: 'Lost Pet' | 'Traffic & Roads' | 'Public Works' | 'Safety' | 'Weather';
  
  event?: EventDetails;
  
  poll?: {
    question: string;
    options: PollOption[];
    totalVotes: number;
    userVotedOptionId?: string;
  };

  marketplace?: {
    itemTitle: string;
    price: string; // "$25" or "Free"
    condition: 'New' | 'Like New' | 'Good' | 'Fair';
    status: 'Available' | 'Pending' | 'Claimed';
  };

  recommendation?: {
    serviceType: string;
    businessName?: string;
    rating?: number;
  };

  reactions: {
    like: number;
    helpful: number;
    heart: number;
  };
  userReaction?: 'like' | 'helpful' | 'heart' | null;
  
  comments: Comment[];
  isSaved?: boolean;
}

export interface LocalGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  image: string;
  isMember: boolean;
  neighborhood: Neighborhood;
}

export type NotificationType = 
  | 'comment'
  | 'reaction'
  | 'event_reminder'
  | 'event_rsvp'
  | 'safety_alert'
  | 'neighborhood_broadcast';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  createdAtMs: number;
  read: boolean;
  sender?: {
    name: string;
    avatar: string;
    street?: string;
  };
  targetType?: 'post' | 'event' | 'alert';
  targetId?: string;
  priority?: 'normal' | 'urgent';
}

export interface CommunityReel {
  id: string;
  author: User;
  title: string;
  description: string;
  videoUrl: string; // HTML5 video or canvas stream
  thumbnailUrl: string;
  durationStr: string; // e.g. "0:38"
  views: number;
  likes: number;
  userLiked?: boolean;
  comments: Comment[];
  audioTrackName: string;
  category: 'Reels' | 'Nature & Parks' | 'Food & Sourdough' | 'Events' | 'Crafts' | 'Wildlife';
  neighborhood: Neighborhood;
  createdAt: string;
  aspectRatio: '9:16' | '16:9';
}


