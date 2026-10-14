import React from 'react';
import { 
  Compass, 
  Calendar, 
  AlertTriangle, 
  Sparkles, 
  ShoppingBag, 
  Bookmark, 
  Trash2, 
  Truck, 
  Building2, 
  CloudSun,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import { Neighborhood, PostCategory } from '../types/community';

interface SidebarLeftProps {
  selectedCategory: PostCategory | 'all' | 'saved';
  onSelectCategory: (cat: PostCategory | 'all' | 'saved') => void;
  selectedNeighborhood: Neighborhood;
  savedCount: number;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedNeighborhood,
  savedCount,
}) => {
  return (
    <aside className="w-full space-y-4">
      {/* Feed Filters Navigation */}
      <div className="bg-white rounded-xl border border-neutral-200 p-3 shadow-xs">
        <div className="px-3 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
          Feed Channels
        </div>
        <nav className="space-y-0.5">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>All Community Updates</span>
            </div>
          </button>

          <button
            onClick={() => onSelectCategory('event')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === 'event'
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Local Events</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 tabular-nums">3 upcoming</span>
          </button>

          <button
            onClick={() => onSelectCategory('alert')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === 'alert'
                ? 'bg-rose-50 text-rose-800 font-bold'
                : 'text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Safety & Notices</span>
            </div>
            <span className="text-[10px] font-mono text-rose-500 font-semibold tabular-nums">1 active</span>
          </button>

          <button
            onClick={() => onSelectCategory('recommendation')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === 'recommendation'
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Recommendations</span>
            </div>
          </button>

          <button
            onClick={() => onSelectCategory('marketplace')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === 'marketplace'
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-blue-500" />
              <span>Free & Curb Alerts</span>
            </div>
          </button>

          <button
            onClick={() => onSelectCategory('saved')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === 'saved'
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-4 h-4 text-purple-500" />
              <span>Saved Items</span>
            </div>
            {savedCount > 0 && (
              <span className="text-[10px] font-mono text-purple-600 font-bold tabular-nums">
                {savedCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Local Weather & Environment Card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
            <CloudSun className="w-4 h-4 text-amber-500" />
            <span>Local Forecast</span>
          </div>
          <span className="text-[11px] text-neutral-500 font-medium">Today</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-neutral-900 tabular-nums">68°F</span>
          <span className="text-xs text-neutral-600">Crisp Autumn Breeze</span>
        </div>
        <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Air Quality: <span className="text-emerald-600 font-semibold">Good (22 AQI)</span></span>
          <span>Pollen: <span className="text-neutral-700 font-semibold">Low</span></span>
        </div>
      </div>

      {/* Civic Schedules & Municipal Info */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
          <Building2 className="w-4 h-4 text-emerald-600" />
          <span>Civic Schedule</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2.5">
            <Trash2 className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-neutral-900">Trash & Recycling</p>
              <p className="text-neutral-500 text-[11px]">Thursday early morning · Bins out by 7 AM</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Truck className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-neutral-900">Street Sweeping</p>
              <p className="text-neutral-500 text-[11px]">3rd Monday of month · North side parking</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-neutral-900">Township Public Forum</p>
              <p className="text-neutral-500 text-[11px]">Tuesday, Oct 20 at 7:00 PM · Town Hall</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
            <PhoneCall className="w-3.5 h-3.5 text-neutral-400" />
            <span>Township Helpline: <strong className="text-neutral-700 font-mono">555-0100</strong></span>
          </div>
        </div>
      </div>

      {/* Verified Community Assurance */}
      <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-neutral-600 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p>
          <strong className="text-emerald-900 font-semibold">Verified Neighborhood:</strong> Posts and event updates are visible to residents of {selectedNeighborhood}.
        </p>
      </div>
    </aside>
  );
};
