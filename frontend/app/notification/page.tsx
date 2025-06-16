// app/notifications/page.tsx
import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Bell, Link2, CalendarDays, Archive } from 'lucide-react';

// --- Type Definition for Notification ---
interface NotificationItem {
  id: number;
  title: string;
  message: string;
  link: string | null;
  is_active: boolean;
  timestamp: string; // ISO string from Django
}
// --- End Type Definition ---

async function getNotifications(type: 'active' | 'all'): Promise<NotificationItem[] | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const apiUrl = `${baseUrl}/api/notifications/${type}/`;
    console.log(`Fetching ${type} notifications from:`, apiUrl);

    const response = await fetch(apiUrl, {
      next: { revalidate: 600 }, // Revalidate every 10 minutes
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Failed to fetch ${type} notifications:`,
        response.status,
        response.statusText,
        "Error Body:", errorBody
      );
      return null;
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error(`${type} notifications data fetched is not an array. Received:`, data);
      return null;
    }
    return data as NotificationItem[];
  } catch (error) {
    console.error(`Error fetching or parsing ${type} notifications:`, error);
    return null;
  }
}

// Helper to format timestamp
const formatTimestamp = (isoString: string) => {
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return "Invalid Date";
  }
};

// Helper to format a URL for display
const formatLink = (urlString: string | null): string => {
  if (!urlString) return '';
  try {
    const url = new URL(urlString);
    // Remove 'www.' from the hostname for brevity
    return url.hostname.replace(/^www\./, '');
  } catch (e) {
    // If URL is malformed, return a snippet of it
    return urlString.length > 30 ? `${urlString.substring(0, 27)}...` : urlString;
  }
};


// --- Notification Card Component ---
const NotificationCard = ({ notification, isActiveCard }: { notification: NotificationItem, isActiveCard: boolean }) => (
  <div
    key={notification.id}
    className={`
      rounded-xl border shadow-sm p-6 mb-6 transition-all duration-300 group
      ${isActiveCard
        ? 'bg-orange-50/50 dark:bg-slate-800/50 border-orange-500/50 dark:border-orange-500/30 border-l-4 hover:shadow-lg hover:border-orange-500'
        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'
      }
    `}
  >
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        {notification.title}
      </h3>
      {isActiveCard && <Bell size={24} className="text-orange-500 animate-pulse flex-shrink-0" />}
    </div>
    <p className="mb-5 text-slate-600 dark:text-slate-400">
      {notification.message}
    </p>
    <div className="flex flex-wrap items-center justify-between text-sm text-slate-500 dark:text-slate-500">
      <div className="flex items-center">
        <CalendarDays size={16} className="mr-2" />
        <span>{formatTimestamp(notification.timestamp)}</span>
      </div>
      {notification.link && (
        <Link
          href={notification.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 sm:mt-0 flex items-center font-medium text-orange-600 dark:text-orange-400 hover:underline"
        >
          <Link2 size={16} className="mr-1.5" />
          {/* Display a formatted version of the link */}
          {formatLink(notification.link)}
        </Link>
      )}
    </div>
  </div>
);

// --- Main Page Component ---
export default async function NotificationsPage() {
  const activeNotifications = await getNotifications('active');
  const allNotifications = await getNotifications('all');

  return (
    <main className="h-full w-full bg-transparent">
      {/* Increased top padding (pt-24) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
          Notifications
        </h1>

        {/* Section for Active Notifications */}
        {activeNotifications && activeNotifications.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-orange-500 flex items-center">
              <Bell size={30} className="mr-3" />
              Active Alerts
            </h2>
            <div className="space-y-4">
              {activeNotifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} isActiveCard={true} />
              ))}
            </div>
          </section>
        )}

        {/* Section for All Notifications */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-slate-700 dark:text-slate-300 flex items-center">
            <Archive size={30} className="mr-3"/>
            Notification Archive
          </h2>
          {!allNotifications ? (
            <div className="text-center py-12 px-6 bg-white dark:bg-slate-800 rounded-lg border border-red-500/20">
              <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
              <p className="text-xl text-red-600 dark:text-red-400 font-semibold">
                Failed to load notifications.
              </p>
              <p className="text-md text-slate-600 dark:text-slate-400 mt-2">
                There was an error connecting to the server. Please try again later.
              </p>
            </div>
          ) : allNotifications.length === 0 ? (
            <div className="text-center py-12 px-6 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-lg text-slate-600 dark:text-slate-400">
                You have no past notifications.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allNotifications.map(notification => (
                 <NotificationCard key={notification.id} notification={notification} isActiveCard={false} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}