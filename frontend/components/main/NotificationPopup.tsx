// components/main/NotificationPopup.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { X, Bell, Link2 } from 'lucide-react';

// --- Constants ---
const NOTIFICATION_LIFETIME = 7000; // 7 seconds
const ANIMATION_DURATION = 400; // ms

// --- Type Definition ---
interface NotificationItem {
  id: number;
  title: string;
  message: string;
  link: string | null;
  is_active: boolean;
  timestamp: string;
}

// --- API Fetching (Unchanged) ---
async function getActiveNotifications(): Promise<NotificationItem[] | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const apiUrl = `${baseUrl}/api/notifications/active/`;
    const response = await fetch(apiUrl, { cache: 'no-store' });

    if (!response.ok) {
      console.error("Pop-up: Failed to fetch active notifications:", response.status, response.statusText);
      return null;
    }
    const data = await response.json();
    return Array.isArray(data) ? (data as NotificationItem[]) : null;
  } catch (error) {
    console.error("Pop-up: Error fetching active notifications:", error);
    return null;
  }
}

// --- Main Component ---
const NotificationPopup: React.FC = () => {
  const [allFetched, setAllFetched] = useState<NotificationItem[]>([]);
  const [current, setCurrent] = useState<NotificationItem | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Core logic to display the next available notification
  const showNext = useCallback((notifications: NotificationItem[], lastClosedId?: number) => {
    const seenIds = JSON.parse(sessionStorage.getItem('shownNotifications') || '[]');
    
    // Find the next notification that hasn't been seen
    const nextNotification = notifications.find(n => !seenIds.includes(n.id));

    setCurrent(nextNotification || null);
    setIsExiting(false);
    setIsPaused(false);
  }, []);

  // Handler to manually or automatically close the current toast
  const handleClose = useCallback(() => {
    if (!current) return;

    // Clear any running timers to prevent race conditions
    if (timerRef.current) clearTimeout(timerRef.current);
    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);

    setIsExiting(true); // Trigger exit animation

    // Wait for animation to finish before proceeding
    exitTimeoutRef.current = setTimeout(() => {
      const seenIds = JSON.parse(sessionStorage.getItem('shownNotifications') || '[]');
      if (!seenIds.includes(current.id)) {
        sessionStorage.setItem('shownNotifications', JSON.stringify([...seenIds, current.id]));
      }
      showNext(allFetched, current.id);
    }, ANIMATION_DURATION);
  }, [current, allFetched, showNext]);
  
  // Fetch initial notifications after a short delay
  useEffect(() => {
    setIsMounted(true);
    const initialFetchTimer = setTimeout(async () => {
      const notifications = await getActiveNotifications();
      if (notifications) {
        setAllFetched(notifications);
        showNext(notifications);
      }
    }, 1500); // Wait a bit longer for initial page load
    
    return () => clearTimeout(initialFetchTimer);
  }, [showNext]);

  // Effect to manage the auto-dismiss timer
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (current && !isPaused && !isExiting) {
      timerRef.current = setTimeout(handleClose, NOTIFICATION_LIFETIME);
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, isPaused, isExiting, handleClose]);
  
  if (!current || !isMounted) {
    return null;
  }

  const animationClass = isExiting ? 'animate-slide-out' : 'animate-slide-in';

  return (
    <>
      <div
        className={`fixed top-6 right-6 z-[99] w-full max-w-lg
                   ${animationClass}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-black ring-opacity-5 border-l-4 border-orange-500">
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Bell className="h-6 w-6 text-orange-500" aria-hidden="true" />
              </div>
              <div className="ml-3 w-0 flex-1">
                <p id="notification-title" className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {current.title}
                </p>
                <p id="notification-message" className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {current.message}
                </p>
                {current.link && (
                  <div className="mt-3">
                    <Link
                      href={current.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleClose}
                      className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300"
                    >
                      <Link2 size={16} className="mr-1.5" />
                      View Details
                    </Link>
                  </div>
                )}
              </div>
              <div className="ml-4 flex flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex rounded-md bg-white dark:bg-slate-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  onClick={handleClose}
                  aria-label="Close notification"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-orange-500/50">
             <div
               className="h-full bg-orange-500"
               style={{
                 animation: `progress-shrink ${NOTIFICATION_LIFETIME}ms linear forwards`,
                 animationPlayState: isPaused ? 'paused' : 'running',
               }}
             />
           </div>
        </div>
      </div>
      
      {/* Global styles for dynamic animations. It's best practice to move these to tailwind.config.js */}
      <style jsx global>{`
        @keyframes slide-in-from-right {
          0% { transform: translateX(120%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-out-to-right {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        @keyframes progress-bar-shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-slide-in { animation: slide-in-from-right ${ANIMATION_DURATION}ms cubic-bezier(0.21, 1.02, 0.73, 1) both; }
        .animate-slide-out { animation: slide-out-to-right ${ANIMATION_DURATION}ms cubic-bezier(0.25, 0.25, 0, 1.01) both; }
        .animate-progress-shrink { animation: progress-bar-shrink ${NOTIFICATION_LIFETIME}ms linear forwards; }
      `}</style>
    </>
  );
};

export default NotificationPopup;