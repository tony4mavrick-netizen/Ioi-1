# TownSquare - Full System Architectural Plan & Code Blueprint

TownSquare is a neighborhood community platform providing local updates, interactive event discovery, community reels, two-way resident notes, and an instant global notification and alert system.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> This document specifies the comprehensive technical architecture, data model, state machines, and complete component implementation details for the TownSquare platform. All modules are functional, client-persisted in local storage, and responsive.

- **Completed Core Capabilities**:
  1. **Multi-Channel Community Feed (`FeedView.tsx` & `PostCard.tsx`)**: Posts with photo attachments, embedded event cards with RSVP, community polls with live voting, urgent safety notices, and marketplace/curb alerts.
  2. **Events Hub & Interactive Map (`EventsView.tsx` & `EventDetailModal.tsx`)**: Real-time search across event titles and locations, grid vs. vector map view with clickable pins, attendee rosters, and `.ics` calendar export.
  3. **Global Alert & Notification Engine (`GlobalAlertToastStack.tsx` & `NotificationCenterDropdown.tsx`)**: Dual-surface notifications (floating toasts + top-bar dropdown), Web Audio API harmonic chimes, unread badge counters, and live activity simulation.
  4. **Community Reels & Local Video (`ReelsView.tsx`)**: 9:16 vertical reels player with video loops, likes, slide-up comments drawer, audio track tags, up/down navigation, and 16:9 local watch grid.
  5. **Resident Directory & Direct Chat (`DirectoryView.tsx`)**: Verified address badges, neighborhood specialties, and two-way simulated neighbor chat with audio chime alerts.
  6. **Neighborhood Scoping & Persona Switching (`Header.tsx` & `SidebarLeft.tsx`)**: Dynamic filtering across enclaves (Maplewood Heights, Oakridge Village, Old Town Commons, Riverside Arts District) and seamless switching between resident test personas.

---

### 1. High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                    TOWNSQUARE CLIENT                                   │
│                                                                                        │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │               Top Bar (Brand · Enclave Selector · Navigation · Alerts)         │   │
│   └────────────────────────────────────────────────────────────────────────────────┘   │
│         │                          │                         │                         │
│         ▼                          ▼                         ▼                         │
│   ┌──────────────┐         ┌───────────────┐         ┌───────────────┐                 │
│   │ SidebarLeft  │         │ Main Viewport │         │ SidebarRight  │                 │
│   │ - Channels   │         │ 1. FeedView   │         │ - Upcoming    │                 │
│   │ - Weather    │         │ 2. EventsView │         │   Events      │                 │
│   │ - Civic Info │         │ 3. ReelsView  │         │ - Groups      │                 │
│   │              │         │ 4. GroupsView │         │ - Code of     │                 │
│   │              │         │ 5. Directory  │         │   Conduct     │                 │
│   └──────────────┘         └───────────────┘         └───────────────┘                 │
│                                    │                                                   │
│                                    ▼                                                   │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                       Global Notification & Alert Engine                       │   │
│   │   - Floating Toast Stack (auto-dismiss, priority coloring, action links)       │   │
│   │   - Web Audio Chime Synthesizer (harmonic C5/E5 & F#5/A5 frequencies)          │   │
│   │   - Unread Badge Counter & Notification Center Dropdown                        │   │
│   └────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              Local Storage Persistence Layer                           │
│  - townsquare_posts               - townsquare_events                                  │
│  - townsquare_reels               - townsquare_notifications                           │
│  - townsquare_groups              - townsquare_current_user                            │
│  - townsquare_sound_enabled                                                            │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Data Models & Interface Contracts (`src/types/community.ts`)

```typescript
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

export interface EventDetails {
  id: string;
  title: string;
  date: string;
  time: string;
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
  alertSeverity?: AlertSeverity;
  alertType?: 'Lost Pet' | 'Traffic & Roads' | 'Public Works' | 'Safety' | 'Weather';
  event?: EventDetails;
  poll?: {
    question: string;
    options: { id: string; text: string; votes: number }[];
    totalVotes: number;
    userVotedOptionId?: string;
  };
  marketplace?: {
    itemTitle: string;
    price: string;
    condition: 'New' | 'Like New' | 'Good' | 'Fair';
    status: 'Available' | 'Pending' | 'Claimed';
  };
  reactions: { like: number; helpful: number; heart: number };
  userReaction?: 'like' | 'helpful' | 'heart' | null;
  comments: Comment[];
  isSaved?: boolean;
}

export interface CommunityReel {
  id: string;
  author: User;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  durationStr: string;
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

export interface AppNotification {
  id: string;
  type: 'comment' | 'reaction' | 'event_reminder' | 'event_rsvp' | 'safety_alert' | 'neighborhood_broadcast';
  title: string;
  message: string;
  timestamp: string;
  createdAtMs: number;
  read: boolean;
  sender?: { name: string; avatar: string; street?: string };
  targetType?: 'post' | 'event' | 'alert';
  targetId?: string;
  priority?: 'normal' | 'urgent';
}
```

---

### 3. Component Architecture & Responsibility Matrix

| Component | Responsibility | Key Interactions |
| :--- | :--- | :--- |
| **`Header.tsx`** | Top Bar Contract, Navigation, Notifications & User Persona | 3-zone header layout, neighborhood selector dropdown, search query, persona switcher, unread counter badge. |
| **`SidebarLeft.tsx`** | Feed Channels & Civic Schedule | Feed category filters, local temperature/AQI, garbage/sweeping schedules, township hotline. |
| **`SidebarRight.tsx`** | Upcoming Events & Local Groups Widget | Mini event cards with 1-click RSVP, group membership toggle, community trust guidelines. |
| **`FeedView.tsx`** | Main community stream & composer | Quick composer with direct "Photo / Image", "Event", "Alert", "Sale", and "Poll" buttons; segmented filter bar; post cards. |
| **`PostCard.tsx`** | Community post presentation | Unboxed metadata, reactive Like/Helpful/Heart, bookmarking, clipboard share, nested comments, poll voting progress bars. |
| **`EventsView.tsx`** | Events discovery & neighborhood map | Dual view mode (Grid vs. Vector SVG Map), Title/Location search bar, category filters, RSVP Going/Interested, agenda modal trigger. |
| **`ReelsView.tsx`** | Community short video & watch grid | 9:16 vertical video player, play/pause on click, mute/unmute, likes, comments drawer, up/down arrows, and "Post Reel" modal. |
| **`DirectoryView.tsx`** | Verified resident roster & messaging | Resident directory, address verification, and two-way direct message modal with simulated neighbor replies. |
| **`GlobalAlertToastStack.tsx`** | Floating real-time alert banners | Auto-dismiss countdown, priority crimson styling for urgent hazards, audio toggle, and "View details" navigation. |
| **`NotificationCenterDropdown.tsx`**| Notification history & simulator | Unread filtering, category tabs, mark all read, clear history, and instant activity simulator (Comment, Event, Hazard, RSVP). |
| **`CreatePostModal.tsx`** | Multi-type publishing modal | Tabbed composer for Updates, Events, Alerts, Polls, and Marketplace listings; file upload dropzone, presets, and URL attachment. |
| **`audioNotification.ts`** | Acoustic feedback synthesizer | Web Audio API harmonic chime generator (no external audio files required). |

---

### 4. Acoustic Synthesis Engine (`src/utils/audioNotification.ts`)

```typescript
class NotificationAudio {
  private audioCtx: AudioContext | null = null;
  public soundEnabled: boolean = true;

  private init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) this.audioCtx = new AudioContextClass();
    }
  }

  public playChime(type: 'normal' | 'urgent' = 'normal') {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + (type === 'urgent' ? 0.7 : 0.5));

      osc1.type = 'sine';
      osc2.type = 'triangle';

      if (type === 'urgent') {
        osc1.frequency.setValueAtTime(740, now);
        osc1.frequency.setValueAtTime(880, now + 0.15);
        osc2.frequency.setValueAtTime(440, now);
      } else {
        osc1.frequency.setValueAtTime(523.25, now);
        osc1.frequency.setValueAtTime(659.25, now + 0.12);
        osc2.frequency.setValueAtTime(329.63, now);
      }

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + (type === 'urgent' ? 0.7 : 0.5));
      osc2.stop(now + (type === 'urgent' ? 0.7 : 0.5));
    } catch {
      // Audio gracefully falls back
    }
  }
}
export const notificationAudio = new NotificationAudio();
```

---

### 5. Verified Execution & Compilation State

- **Build Status**: Verified via `compile_applet` (`Build succeeded - the applet is compiled`).
- **TypeScript Integrity**: Verified via `lint_applet` (`tsc --noEmit` exited with code 0).
- **Design Constitution Adherence**: Zero pill badges on static metadata, unboxed text with typographic separators (`·`), high-contrast accessible typography (Plus Jakarta Sans), 60-30-10 color allocation, and zero broken image tags (`referrerPolicy="no-referrer"` with fallback containers).
