'use client';

import { Radio, History, Newspaper, CassetteTape } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useMobileTab, type MobileTab } from '@/contexts/MobileTabContext';

const ACTIVE_TAB_CLASSES =
  'text-white bg-white/5 after:absolute after:top-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:w-8 after:bg-primary after:rounded-b-full';
const INACTIVE_TAB_CLASSES = 'text-white/60 hover:bg-white/10 hover:text-white/80';
const TAB_BASE_CLASSES =
  'flex flex-col items-center justify-center gap-0.5 flex-1 h-14 transition-all relative rounded-lg';

type ActiveTab = MobileTab | 'on-demand' | 'zine' | null;

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { tab, setTab } = useMobileTab();

  // Hide on backend / authoring surfaces
  if (pathname?.startsWith('/studio') || pathname?.startsWith('/admin')) {
    return null;
  }

  const isHomePage = pathname === '/';
  const isZinePage = pathname?.startsWith('/headyzine');
  const isOnDemandPage = pathname?.startsWith('/on-demand');

  // On-Demand and Zine are URL-driven; the other tabs reflect homepage state
  // and have no active state once the user has navigated away from `/`.
  const activeTab: ActiveTab = isOnDemandPage
    ? 'on-demand'
    : isZinePage
      ? 'zine'
      : isHomePage
        ? tab
        : null;

  const handleTabClick = (next: MobileTab) => {
    setTab(next);
    if (!isHomePage) {
      router.push('/');
    }
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-950 border-t-2 border-white/20 z-40 shadow-2xl backdrop-blur-lg"
      aria-label="Mobile navigation"
    >
      <div className="flex justify-around items-center h-16 px-1 max-w-lg mx-auto" role="tablist">
        <button
          onClick={() => handleTabClick('player')}
          aria-label="On Air - View current playing track"
          aria-selected={activeTab === 'player'}
          role="tab"
          className={cn(
            TAB_BASE_CLASSES,
            activeTab === 'player' ? ACTIVE_TAB_CLASSES : INACTIVE_TAB_CLASSES
          )}
        >
          <Radio className={cn('h-4 w-4', activeTab === 'player' && 'scale-110')} aria-hidden="true" />
          <span className="text-[9px] font-bold uppercase tracking-wide">On Air</span>
        </button>

        <button
          onClick={() => handleTabClick('history')}
          aria-label="History - View play history"
          aria-selected={activeTab === 'history'}
          role="tab"
          className={cn(
            TAB_BASE_CLASSES,
            activeTab === 'history' ? ACTIVE_TAB_CLASSES : INACTIVE_TAB_CLASSES
          )}
        >
          <History className={cn('h-4 w-4', activeTab === 'history' && 'scale-110')} aria-hidden="true" />
          <span className="text-[9px] font-bold uppercase tracking-wide">History</span>
        </button>

        <Link
          href="/on-demand"
          aria-label="On-Demand - Browse HEADY shows and mixtapes"
          aria-current={isOnDemandPage ? 'page' : undefined}
          className={cn(
            TAB_BASE_CLASSES,
            activeTab === 'on-demand' ? ACTIVE_TAB_CLASSES : INACTIVE_TAB_CLASSES
          )}
        >
          <CassetteTape
            className={cn('h-4 w-4', activeTab === 'on-demand' && 'scale-110')}
            aria-hidden="true"
          />
          <span className="text-[9px] font-bold uppercase tracking-wide">On-Demand</span>
        </Link>

        <Link
          href="/headyzine"
          aria-label="Zine - Read the HEADY Zine"
          aria-current={isZinePage ? 'page' : undefined}
          className={cn(
            TAB_BASE_CLASSES,
            activeTab === 'zine' ? ACTIVE_TAB_CLASSES : INACTIVE_TAB_CLASSES
          )}
        >
          <Newspaper className={cn('h-4 w-4', activeTab === 'zine' && 'scale-110')} aria-hidden="true" />
          <span className="text-[9px] font-bold uppercase tracking-wide">Zine</span>
        </Link>
      </div>
    </nav>
  );
};
