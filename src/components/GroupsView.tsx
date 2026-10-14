import React, { useState } from 'react';
import { Users, Plus, Check, MapPin, Search, ArrowRight } from 'lucide-react';
import { LocalGroup, User } from '../types/community';

interface GroupsViewProps {
  groups: LocalGroup[];
  currentUser: User;
  onToggleGroup: (groupId: string) => void;
  onCreateGroup: (group: Partial<LocalGroup>) => void;
}

export const GroupsView: React.FC<GroupsViewProps> = ({
  groups,
  currentUser,
  onToggleGroup,
  onCreateGroup,
}) => {
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState('Hobbies & Crafts');

  const filteredGroups = groups.filter((g) => {
    if (!search.trim()) return true;
    return (g.name + g.description + g.category).toLowerCase().includes(search.toLowerCase());
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    onCreateGroup({
      id: `group-${Date.now()}`,
      name: newGroupName.trim(),
      description: newGroupDesc.trim() || 'Neighborhood interest group for local residents.',
      category: newGroupCategory,
      memberCount: 1,
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&auto=format&fit=crop&q=80',
      isMember: true,
      neighborhood: currentUser.neighborhood,
    });

    setNewGroupName('');
    setNewGroupDesc('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>NEIGHBORHOOD CIRCLES & CLUBS</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Local Groups
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Connect with neighbors who share your passions—from gardening and dog walks to school planning and book clubs.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Group</span>
          </button>
        </div>

        {/* Search */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-100/80 focus:bg-white border border-neutral-200 focus:border-emerald-500 rounded-lg outline-none transition-all placeholder:text-neutral-400"
            />
          </div>
          <span className="text-xs text-neutral-500 font-medium tabular-nums hidden sm:block">
            {filteredGroups.length} community circles
          </span>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-32 bg-neutral-200 relative overflow-hidden">
                <img
                  src={group.image}
                  alt={group.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 bg-neutral-900/80 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                  {group.category}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-sm text-neutral-900 mb-1 leading-snug">
                  {group.name}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mb-2">
                  <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                  <span>{group.neighborhood}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums font-medium text-neutral-700">{group.memberCount} members</span>
                </div>
                <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                  {group.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => onToggleGroup(group.id)}
                className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  group.isMember
                    ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                {group.isMember ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                    <span>Member of Group</span>
                  </>
                ) : (
                  <span>Join Group</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <h2 className="text-lg font-bold text-neutral-900 mb-1">Create a Local Group</h2>
            <p className="text-xs text-neutral-500 mb-4">
              Start a community circle for your street or the broader township.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Oakridge Weekend Cyclists"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Category
                </label>
                <select
                  value={newGroupCategory}
                  onChange={(e) => setNewGroupCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
                >
                  <option value="Hobbies & Crafts">Hobbies & Crafts</option>
                  <option value="Gardening & Nature">Gardening & Nature</option>
                  <option value="Fitness & Health">Fitness & Health</option>
                  <option value="Safety & Civic">Safety & Civic</option>
                  <option value="Family & Kids">Family & Kids</option>
                  <option value="Food & Cooking">Food & Cooking</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="What is the group about, and when do you meet?"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
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
                  disabled={!newGroupName.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
