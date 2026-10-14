import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { FeedView } from './components/FeedView';
import { EventsView } from './components/EventsView';
import { GroupsView } from './components/GroupsView';
import { DirectoryView } from './components/DirectoryView';
import { CreatePostModal } from './components/CreatePostModal';
import { EventDetailModal } from './components/EventDetailModal';
import { UserProfileModal } from './components/UserProfileModal';
import { GlobalAlertToastStack, ToastItem } from './components/GlobalAlertToastStack';
import { notificationAudio } from './utils/audioNotification';
import { ReelsView } from './components/ReelsView';

import { 
  User, 
  Post, 
  EventDetails, 
  LocalGroup, 
  Neighborhood, 
  PostCategory,
  AppNotification,
  CommunityReel
} from './types/community';
import { 
  CURRENT_USER, 
  SAMPLE_USERS, 
  INITIAL_POSTS, 
  INITIAL_EVENTS, 
  INITIAL_GROUPS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REELS
} from './data/mockData';

export default function App() {
  // Persistent or initial state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('townsquare_current_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('townsquare_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [events, setEvents] = useState<EventDetails[]>(() => {
    const saved = localStorage.getItem('townsquare_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [groups, setGroups] = useState<LocalGroup[]>(() => {
    const saved = localStorage.getItem('townsquare_groups');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [reels, setReels] = useState<CommunityReel[]>(() => {
    const saved = localStorage.getItem('townsquare_reels');
    return saved ? JSON.parse(saved) : INITIAL_REELS;
  });

  const [users, setUsers] = useState<User[]>(SAMPLE_USERS);

  // Global Notification & Alert State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('townsquare_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('townsquare_sound_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // App navigation & filters
  const [currentTab, setCurrentTab] = useState<'feed' | 'events' | 'groups' | 'directory' | 'reels'>('feed');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood>('Maplewood Heights');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createInitialTab, setCreateInitialTab] = useState<'update' | 'event' | 'alert' | 'poll' | 'marketplace'>('update');
  const [selectedEventModal, setSelectedEventModal] = useState<EventDetails | null>(null);
  const [selectedAuthorModal, setSelectedAuthorModal] = useState<User | null>(null);

  // Synchronize audio preference
  useEffect(() => {
    notificationAudio.soundEnabled = soundEnabled;
    localStorage.setItem('townsquare_sound_enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('townsquare_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('townsquare_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('townsquare_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('townsquare_reels', JSON.stringify(reels));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem('townsquare_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('townsquare_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Global Alert Trigger Engine
  const triggerNotification = (notif: AppNotification) => {
    // 1. Prepend to persistent notifications list
    setNotifications((prev) => [notif, ...prev]);

    // 2. Play gentle chime if sound enabled
    if (soundEnabled) {
      notificationAudio.playChime(notif.priority);
    }

    // 3. Add to floating toast stack
    const toastId = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [{ notification: notif, id: toastId }, ...prev.slice(0, 2)]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Navigates and focuses item from notification
  const handleOpenNotification = (notif: AppNotification) => {
    // Mark this notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );

    if (notif.targetType === 'event' && notif.targetId) {
      const targetEvent = events.find((e) => e.id === notif.targetId);
      if (targetEvent) {
        setSelectedEventModal(targetEvent);
        setCurrentTab('events');
      }
    } else if (notif.targetType === 'post' && notif.targetId) {
      setCurrentTab('feed');
      setSelectedCategory('all');
      // Scroll into view with smooth behavior
      setTimeout(() => {
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }, 100);
    }
  };

  // Simulator for quick testing of all alert scenarios
  const handleSimulateNotification = (type: 'comment' | 'event_reminder' | 'safety_alert' | 'event_rsvp') => {
    if (type === 'comment') {
      triggerNotification({
        id: `notif-${Date.now()}`,
        type: 'comment',
        title: 'New comment on your post',
        message: 'Elena Rostova replied: "Tom did our water line last year too, incredible workmanship and came within an hour!"',
        timestamp: 'Just now',
        createdAtMs: Date.now(),
        read: false,
        sender: {
          name: 'Elena Rostova',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          street: 'Meadowcrest Way',
        },
        targetType: 'post',
        targetId: 'post-recommendation-plumber',
        priority: 'normal',
      });
    } else if (type === 'event_reminder') {
      triggerNotification({
        id: `notif-${Date.now()}`,
        type: 'event_reminder',
        title: 'Event Approaching in 30 Minutes',
        message: 'Maplewood Weekend Farmers Market begins at 8:30 AM at the Town Common. Grab your tote bags!',
        timestamp: 'Just now',
        createdAtMs: Date.now(),
        read: false,
        targetType: 'event',
        targetId: 'event-farmers-market',
        priority: 'normal',
      });
    } else if (type === 'safety_alert') {
      triggerNotification({
        id: `notif-${Date.now()}`,
        type: 'safety_alert',
        title: 'Urgent Neighborhood Notice',
        message: 'Road Closure: North Oak Avenue is temporarily closed for emergency tree clearing between 4th and 8th St.',
        timestamp: 'Just now',
        createdAtMs: Date.now(),
        read: false,
        sender: {
          name: 'Sarah Jenkins',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          street: 'Heritage Square',
        },
        targetType: 'post',
        targetId: 'post-safety-alert',
        priority: 'urgent',
      });
    } else if (type === 'event_rsvp') {
      triggerNotification({
        id: `notif-${Date.now()}`,
        type: 'event_rsvp',
        title: 'New Event RSVP',
        message: 'David Morales and 2 others joined as "Going" to your Annual 5th & Elm Neighborhood Block Cookout!',
        timestamp: 'Just now',
        createdAtMs: Date.now(),
        read: false,
        sender: {
          name: 'David Morales',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          street: 'Dockside Lane',
        },
        targetType: 'event',
        targetId: 'event-block-party',
        priority: 'normal',
      });
    }
  };

  // Handlers for posts
  const handleReact = (postId: string, reactionType: 'like' | 'helpful' | 'heart') => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const isCurrentlyActive = post.userReaction === reactionType;
        const newReaction = isCurrentlyActive ? null : reactionType;

        const newCounts = { ...post.reactions };
        if (post.userReaction) {
          newCounts[post.userReaction] = Math.max(0, newCounts[post.userReaction] - 1);
        }
        if (newReaction) {
          newCounts[newReaction] += 1;
        }

        return {
          ...post,
          reactions: newCounts,
          userReaction: newReaction,
        };
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    const targetPost = posts.find((p) => p.id === postId);

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const newComment = {
          id: `comment-${Date.now()}`,
          userId: currentUser.id,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          authorStreet: currentUser.street,
          content: text,
          createdAt: 'Just now',
          likes: 0,
        };
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      })
    );

    // Global Alert Trigger: alert user when a comment is added
    if (targetPost) {
      setTimeout(() => {
        triggerNotification({
          id: `notif-${Date.now()}`,
          type: 'comment',
          title: `New comment from ${currentUser.name}`,
          message: `"${text.substring(0, 75)}${text.length > 75 ? '...' : ''}"`,
          timestamp: 'Just now',
          createdAtMs: Date.now(),
          read: false,
          sender: {
            name: currentUser.name,
            avatar: currentUser.avatar,
            street: currentUser.street,
          },
          targetType: 'post',
          targetId: targetPost.id,
          priority: 'normal',
        });
      }, 700);
    }
  };

  const handleToggleCommentLike = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map((c) => {
            if (c.id !== commentId) return c;
            const userLiked = !c.userLiked;
            return {
              ...c,
              userLiked,
              likes: userLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
            };
          }),
        };
      })
    );
  };

  const handleToggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );
  };

  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId || !post.poll) return post;
        if (post.poll.userVotedOptionId === optionId) return post;

        const prevVoted = post.poll.userVotedOptionId;
        const newOptions = post.poll.options.map((opt) => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          if (opt.id === prevVoted) {
            return { ...opt, votes: Math.max(0, opt.votes - 1) };
          }
          return opt;
        });

        const newTotal = prevVoted ? post.poll.totalVotes : post.poll.totalVotes + 1;

        return {
          ...post,
          poll: {
            ...post.poll,
            options: newOptions,
            totalVotes: newTotal,
            userVotedOptionId: optionId,
          },
        };
      })
    );
  };

  // Handlers for Events
  const handleRsvpEvent = (eventId: string, status: 'going' | 'interested' | 'declined') => {
    const targetEvent = events.find((e) => e.id === eventId);

    // Update in events array
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;

        const prevStatus = ev.userRsvp;
        let newCount = ev.rsvpCount;

        if (prevStatus === 'going' && status !== 'going') {
          newCount = Math.max(0, newCount - 1);
        } else if (prevStatus !== 'going' && status === 'going') {
          newCount += 1;
        }

        let newAttendees = [...ev.attendees];
        if (status === 'going') {
          if (!newAttendees.some((a) => a.name === currentUser.name)) {
            newAttendees.push({ name: currentUser.name, avatar: currentUser.avatar });
          }
        } else {
          newAttendees = newAttendees.filter((a) => a.name !== currentUser.name);
        }

        const updated = {
          ...ev,
          userRsvp: status === 'declined' ? null : status,
          rsvpCount: newCount,
          attendees: newAttendees,
        };

        if (selectedEventModal?.id === eventId) {
          setSelectedEventModal(updated);
        }

        return updated;
      })
    );

    // Sync in posts array if an event is embedded in any post
    setPosts((prev) =>
      prev.map((post) => {
        if (post.event && post.event.id === eventId) {
          const prevStatus = post.event.userRsvp;
          let newCount = post.event.rsvpCount;
          if (prevStatus === 'going' && status !== 'going') {
            newCount = Math.max(0, newCount - 1);
          } else if (prevStatus !== 'going' && status === 'going') {
            newCount += 1;
          }

          let newAttendees = [...post.event.attendees];
          if (status === 'going') {
            if (!newAttendees.some((a) => a.name === currentUser.name)) {
              newAttendees.push({ name: currentUser.name, avatar: currentUser.avatar });
            }
          } else {
            newAttendees = newAttendees.filter((a) => a.name !== currentUser.name);
          }

          return {
            ...post,
            event: {
              ...post.event,
              userRsvp: status === 'declined' ? null : status,
              rsvpCount: newCount,
              attendees: newAttendees,
            },
          };
        }
        return post;
      })
    );

    // Global Alert for RSVP confirmation & event reminder scheduling
    if (status === 'going' && targetEvent) {
      triggerNotification({
        id: `notif-${Date.now()}`,
        type: 'event_reminder',
        title: 'Event Reminder Added to Calendar',
        message: `You're marked as Going to "${targetEvent.title}". We will remind you when it begins on ${targetEvent.date}!`,
        timestamp: 'Just now',
        createdAtMs: Date.now(),
        read: false,
        targetType: 'event',
        targetId: targetEvent.id,
        priority: 'normal',
      });
    }
  };

  const handleCreatePost = (newPostData: Partial<Post>) => {
    const newPostId = `post-${Date.now()}`;
    const fullPost: Post = {
      id: newPostId,
      author: currentUser,
      createdAt: 'Just now',
      category: 'general',
      neighborhood: currentUser.neighborhood,
      content: '',
      reactions: { like: 0, helpful: 0, heart: 0 },
      comments: [],
      ...newPostData,
    };
    setPosts((prev) => [fullPost, ...prev]);

    // If an urgent safety alert was broadcasted, trigger high-priority global alert toast!
    if (newPostData.category === 'alert') {
      triggerNotification({
        id: `notif-${Date.now()}`,
        type: 'safety_alert',
        title: 'Urgent Neighborhood Broadcast',
        message: `${currentUser.name} reported: ${newPostData.content?.substring(0, 80)}...`,
        timestamp: 'Just now',
        createdAtMs: Date.now(),
        read: false,
        sender: {
          name: currentUser.name,
          avatar: currentUser.avatar,
          street: currentUser.street,
        },
        targetType: 'post',
        targetId: newPostId,
        priority: 'urgent',
      });
    }
  };

  const handleCreateEvent = (newEvent: EventDetails) => {
    setEvents((prev) => [newEvent, ...prev]);

    triggerNotification({
      id: `notif-${Date.now()}`,
      type: 'event_rsvp',
      title: 'Community Event Published',
      message: `"${newEvent.title}" was published to ${currentUser.neighborhood}. Neighbors can now RSVP!`,
      timestamp: 'Just now',
      createdAtMs: Date.now(),
      read: false,
      targetType: 'event',
      targetId: newEvent.id,
      priority: 'normal',
    });
  };

  const handleToggleGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;
        const newIsMember = !group.isMember;
        return {
          ...group,
          isMember: newIsMember,
          memberCount: newIsMember ? group.memberCount + 1 : Math.max(1, group.memberCount - 1),
        };
      })
    );
  };

  const handleCreateGroup = (newGroup: Partial<LocalGroup>) => {
    const fullGroup: LocalGroup = {
      id: `group-${Date.now()}`,
      name: 'New Group',
      description: '',
      category: 'General',
      memberCount: 1,
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&auto=format&fit=crop&q=80',
      isMember: true,
      neighborhood: currentUser.neighborhood,
      ...newGroup,
    };
    setGroups((prev) => [fullGroup, ...prev]);
  };

  // Reels and Community Video Handlers
  const handleLikeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id !== reelId) return r;
        const userLiked = !r.userLiked;
        return {
          ...r,
          userLiked,
          likes: userLiked ? r.likes + 1 : Math.max(0, r.likes - 1),
        };
      })
    );
  };

  const handleAddReelComment = (reelId: string, text: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id !== reelId) return r;
        const newC = {
          id: `rc-${Date.now()}`,
          userId: currentUser.id,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          authorStreet: currentUser.street,
          content: text,
          createdAt: 'Just now',
          likes: 0,
        };
        return { ...r, comments: [...r.comments, newC] };
      })
    );
  };

  const handleCreateReel = (newReel: Partial<CommunityReel>) => {
    const fullReel: CommunityReel = {
      id: `reel-${Date.now()}`,
      author: currentUser,
      title: newReel.title || 'Neighborhood Video',
      description: newReel.description || '',
      videoUrl: newReel.videoUrl || '',
      thumbnailUrl: newReel.thumbnailUrl || '/src/assets/images/event_block_party_1792016689793.jpg',
      durationStr: newReel.durationStr || '0:30',
      views: 1,
      likes: 1,
      userLiked: true,
      comments: [],
      audioTrackName: newReel.audioTrackName || 'Original Sound',
      category: newReel.category || 'Reels',
      neighborhood: currentUser.neighborhood,
      createdAt: 'Just now',
      aspectRatio: newReel.aspectRatio || '9:16',
      ...newReel,
    };

    setReels((prev) => [fullReel, ...prev]);

    triggerNotification({
      id: `notif-${Date.now()}`,
      type: 'reaction',
      title: 'Reel Published to Neighborhood',
      message: `"${fullReel.title}" is now available on Community Reels!`,
      timestamp: 'Just now',
      createdAtMs: Date.now(),
      read: false,
      targetType: 'post',
      priority: 'normal',
    });
  };

  // Filter posts based on search query, neighborhood, and category
  const filteredPosts = posts.filter((post) => {
    if (selectedNeighborhood !== 'All Neighborhoods') {
      if (post.neighborhood !== 'All Neighborhoods' && post.neighborhood !== selectedNeighborhood) {
        return false;
      }
    }

    if (selectedCategory === 'saved') {
      if (!post.isSaved) return false;
    } else if (selectedCategory !== 'all') {
      if (post.category !== selectedCategory) return false;
    }

    if (searchQuery.trim()) {
      const match = (post.content + post.author.name + post.neighborhood + (post.event?.title || '')).toLowerCase();
      if (!match.includes(searchQuery.toLowerCase())) return false;
    }

    return true;
  });

  const savedCount = posts.filter((p) => p.isSaved).length;

  return (
    <div className="min-h-screen bg-neutral-100/60 text-neutral-900 flex flex-col">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        selectedNeighborhood={selectedNeighborhood}
        onSelectNeighborhood={setSelectedNeighborhood}
        currentUser={currentUser}
        onSwitchUser={setCurrentUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateModal={() => {
          setCreateInitialTab('update');
          setCreateModalOpen(true);
        }}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAllNotifications={handleClearAllNotifications}
        onOpenNotification={handleOpenNotification}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onSimulateNotification={handleSimulateNotification}
      />

      {/* Main Responsive Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar (Desktop Only: 3 columns) */}
          <div className="hidden lg:block lg:col-span-3">
            <SidebarLeft
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedNeighborhood={selectedNeighborhood}
              savedCount={savedCount}
            />
          </div>

          {/* Center Main Content Area */}
          <div className={`col-span-1 lg:${currentTab === 'feed' ? 'col-span-6' : 'col-span-9'}`}>
            {currentTab === 'feed' && (
              <FeedView
                posts={filteredPosts}
                currentUser={currentUser}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedNeighborhood={selectedNeighborhood}
                onOpenCreateModal={(tab) => {
                  setCreateInitialTab(tab || 'update');
                  setCreateModalOpen(true);
                }}
                onReact={handleReact}
                onAddComment={handleAddComment}
                onToggleCommentLike={handleToggleCommentLike}
                onToggleSave={handleToggleSave}
                onVotePoll={handleVotePoll}
                onRsvpEvent={handleRsvpEvent}
                onSelectEvent={setSelectedEventModal}
                onSelectAuthor={setSelectedAuthorModal}
              />
            )}

            {currentTab === 'events' && (
              <EventsView
                events={events}
                currentUser={currentUser}
                onOpenCreateEvent={() => {
                  setCreateInitialTab('event');
                  setCreateModalOpen(true);
                }}
                onRsvpEvent={handleRsvpEvent}
                onSelectEvent={setSelectedEventModal}
              />
            )}

            {currentTab === 'groups' && (
              <GroupsView
                groups={groups}
                currentUser={currentUser}
                onToggleGroup={handleToggleGroup}
                onCreateGroup={handleCreateGroup}
              />
            )}

            {currentTab === 'directory' && (
              <DirectoryView
                users={users}
                currentUser={currentUser}
                onSelectAuthor={setSelectedAuthorModal}
                selectedNeighborhood={selectedNeighborhood}
                onTriggerNotification={triggerNotification}
              />
            )}

            {currentTab === 'reels' && (
              <ReelsView
                reels={reels}
                currentUser={currentUser}
                selectedNeighborhood={selectedNeighborhood}
                onLikeReel={handleLikeReel}
                onAddReelComment={handleAddReelComment}
                onCreateReel={handleCreateReel}
                onSelectAuthor={setSelectedAuthorModal}
              />
            )}
          </div>

          {/* Right Sidebar (Only shown on feed view: 3 columns) */}
          {currentTab === 'feed' && (
            <div className="hidden lg:block lg:col-span-3">
              <SidebarRight
                events={events}
                groups={groups}
                onOpenEventsTab={() => setCurrentTab('events')}
                onOpenGroupsTab={() => setCurrentTab('groups')}
                onRsvpEvent={handleRsvpEvent}
                onToggleGroup={handleToggleGroup}
                onSelectEvent={setSelectedEventModal}
              />
            </div>
          )}

        </div>
      </main>

      {/* Floating Global Alert Toast Stack */}
      <GlobalAlertToastStack
        toasts={toasts}
        onDismissToast={handleDismissToast}
        onOpenNotification={handleOpenNotification}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Modals */}
      <CreatePostModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        currentUser={currentUser}
        initialTab={createInitialTab}
        onCreatePost={handleCreatePost}
        onCreateEvent={handleCreateEvent}
      />

      <EventDetailModal
        event={selectedEventModal}
        onClose={() => setSelectedEventModal(null)}
        currentUser={currentUser}
        onRsvpEvent={handleRsvpEvent}
      />

      <UserProfileModal
        user={selectedAuthorModal}
        onClose={() => setSelectedAuthorModal(null)}
        userPosts={selectedAuthorModal ? posts.filter((p) => p.author.id === selectedAuthorModal.id) : []}
      />
    </div>
  );
}
