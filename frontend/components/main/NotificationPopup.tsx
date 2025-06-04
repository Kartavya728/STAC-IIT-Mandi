// components/main/NotificationPopup.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { X, Bell, Link2 } from 'lucide-react';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  link: string | null;
  is_active: boolean;
  timestamp: string;
}

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
    if (!Array.isArray(data)) {
      console.error("Pop-up: Active notifications data is not an array:", data);
      return null;
    }
    return data as NotificationItem[];
  } catch (error) {
    console.error("Pop-up: Error fetching active notifications:", error);
    return null;
  }
}

const ANIMATION_DURATION = 300; // ms, for both modal and backdrop

const NotificationPopup: React.FC = () => {
  const [allFetchedNotifications, setAllFetchedNotifications] = useState<NotificationItem[]>([]);
  const [currentNotification, setCurrentNotification] = useState<NotificationItem | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popupRef = useRef<HTMLDivElement>(null); // Ref for the popup content

  const showNextNotification = useCallback((notificationsToShow: NotificationItem[], lastClosedId?: number) => {
    const shownNotifications = JSON.parse(sessionStorage.getItem('shownNotifications') || '[]');
    let nextNotification: NotificationItem | undefined;

    if (lastClosedId) {
      const lastIndex = notificationsToShow.findIndex(n => n.id === lastClosedId);
      if (lastIndex !== -1) {
        for (let i = lastIndex + 1; i < notificationsToShow.length; i++) {
          if (!shownNotifications.includes(notificationsToShow[i].id)) {
            nextNotification = notificationsToShow[i];
            break;
          }
        }
      }
    }

    if (!nextNotification) {
      nextNotification = notificationsToShow.find(n => !shownNotifications.includes(n.id));
    }
    
    if (nextNotification) {
      setCurrentNotification(nextNotification);
      setIsExiting(false); // Prepare for entry animation
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      setCurrentNotification(null);
      document.body.style.overflow = ''; // Restore background scrolling
    }
  }, []);


  const fetchAndProcessNotifications = useCallback(async () => {
    setIsLoading(true);
    const activeNotifications = await getActiveNotifications();
    if (activeNotifications) {
      setAllFetchedNotifications(activeNotifications);
      showNextNotification(activeNotifications);
    } else {
      setAllFetchedNotifications([]);
      setCurrentNotification(null);
    }
    setIsLoading(false);
  }, [showNextNotification]);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
        fetchAndProcessNotifications();
    }, 700); // Slightly longer delay for modal appearance
    return () => clearTimeout(timer);
  }, [fetchAndProcessNotifications]);


  const handleClose = useCallback(() => {
    if (!currentNotification) return;

    if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
    }

    setIsExiting(true); // Trigger exit animation for both modal and backdrop
    const notificationIdToClose = currentNotification.id;

    exitTimeoutRef.current = setTimeout(() => {
      document.body.style.overflow = ''; // Restore scrolling
      const shownNotifications = JSON.parse(sessionStorage.getItem('shownNotifications') || '[]');
      if (!shownNotifications.includes(notificationIdToClose)) {
        sessionStorage.setItem('shownNotifications', JSON.stringify([...shownNotifications, notificationIdToClose]));
      }
      
      setIsExiting(false); // Reset for next potential notification
      showNextNotification(allFetchedNotifications, notificationIdToClose);

    }, ANIMATION_DURATION);
  }, [currentNotification, allFetchedNotifications, showNextNotification]);

  // Close on Escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && currentNotification) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [currentNotification, handleClose]);
  
  // Close on backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      handleClose();
    }
  };


  if (isLoading || !currentNotification || !isMounted) {
    return null;
  }

  const backdropAnimationClass = isExiting ? 'animate-fade-out' : 'animate-fade-in';
  const modalAnimationClass = isExiting ? 'animate-scale-out-center' : 'animate-scale-in-center';

  return (
    // Backdrop
    <div
      className={`fixed inset-0 z-[99] flex items-center justify-center p-4
                 bg-black/50 backdrop-blur-sm 
                 ${backdropAnimationClass}`}
      onClick={handleBackdropClick} // Close on backdrop click
    >
      {/* Modal Content */}
      <div
        ref={popupRef} // Ref for click-outside detection
        className={`relative w-full max-w-lg md:max-w-xl lg:max-w-2xl
                   p-6 sm:p-8 rounded-xl shadow-2xl
                   bg-card text-card-foreground border border-border
                   ${modalAnimationClass}`}
        role="dialog" // Changed role to dialog for modal
        aria-modal="true"
        aria-labelledby="notification-title"
        aria-describedby="notification-message"
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-muted-foreground hover:text-foreground p-1 rounded-full transition-colors"
          aria-label="Close notification"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <div className="flex items-center mb-4 sm:mb-5"> {/* Adjusted icon placement */}
          <Bell size={28} className="mr-3 text-primary flex-shrink-0" />
          <h3 id="notification-title" className="text-xl sm:text-2xl font-semibold text-foreground leading-tight">
            {currentNotification.title}
          </h3>
        </div>

        <div id="notification-message" className="text-muted-foreground mb-6 text-sm sm:text-base leading-relaxed max-h-[50vh] overflow-y-auto pr-2">
          {currentNotification.message}
        </div>

        {currentNotification.link && (
          <div className="text-center sm:text-right"> {/* Button alignment */}
            <Link
              href={currentNotification.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              className="inline-flex items-center justify-center px-5 py-2 sm:px-6 sm:py-2.5
                         bg-primary hover:bg-primary/90 text-primary-foreground
                         font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              <Link2 size={16} className="mr-2" />
              Learn More
            </Link>
          </div>
        )}
      </div>
      {/* Global styles for animation */}
      <style jsx global>{`
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes fade-out { 0% { opacity: 1; } 100% { opacity: 0; } }
        .animate-fade-in { animation: fade-in ${ANIMATION_DURATION}ms ease-out both; }
        .animate-fade-out { animation: fade-out ${ANIMATION_DURATION}ms ease-in both; }

        @keyframes scale-in-center {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes scale-out-center {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.7); opacity: 0; }
        }
        .animate-scale-in-center { animation: scale-in-center ${ANIMATION_DURATION}ms cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
        .animate-scale-out-center { animation: scale-out-center ${ANIMATION_DURATION}ms cubic-bezier(0.550, 0.085, 0.680, 0.530) both; }
      `}</style>
    </div>
  );
};

export default NotificationPopup;