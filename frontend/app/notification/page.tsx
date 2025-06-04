// app/notifications/page.tsx
import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Bell, Link2, CalendarDays } from 'lucide-react'; // Example icons

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
    const apiUrl = `${baseUrl}/api/notifications/${type}/`; // Dynamic path based on type
    console.log(`Fetching ${type} notifications from:`, apiUrl);

    const response = await fetch(apiUrl, {
      next: { revalidate: 600 } // Revalidate active notifications more frequently (e.g., every 10 mins)
                                // For 'all', you might use a longer revalidation or only fetch client-side if it's a huge list
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

export default async function NotificationsPage() {
  // Fetch both active and all notifications
  // In a real app, you might fetch active ones for a homepage pop-up
  // and 'all' for a dedicated notifications page.
  const activeNotifications = await getNotifications('active');
  const allNotifications = await getNotifications('all');

  const renderNotificationCard = (notification: NotificationItem, isActiveCard: boolean = false) => (
    <div
      key={notification.id}
      className={`rounded-lg shadow-lg p-6 mb-6 transition-all duration-300
        ${isActiveCard
          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-indigo-500/50 border-2 border-indigo-400'
          : 'bg-white dark:bg-gray-800 hover:shadow-xl'
        }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h2 className={`text-2xl font-semibold ${isActiveCard ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
          {notification.title}
        </h2>
        {isActiveCard && <Bell size={28} className="text-yellow-300 animate-pulse" />}
      </div>
      <p className={`mb-4 text-base ${isActiveCard ? 'text-indigo-100' : 'text-gray-700 dark:text-gray-300'}`}>
        {notification.message}
      </p>
      <div className="flex flex-wrap items-center justify-between text-sm">
        <div className={`flex items-center ${isActiveCard ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>
          <CalendarDays size={16} className="mr-2" />
          <span>{formatTimestamp(notification.timestamp)}</span>
        </div>
        {notification.link && (
          <Link
            href={notification.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2 sm:mt-0 flex items-center font-medium transition-colors duration-200
              ${isActiveCard
                ? 'text-yellow-300 hover:text-yellow-200'
                : 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
              }`}
          >
            <Link2 size={16} className="mr-1" />
            Learn More
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <main className="h-full w-full bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-extrabold mb-16 text-center text-gray-800 dark:text-gray-100">
          Notifications
        </h1>

        {/* Section for Active Notifications */}
        {activeNotifications && activeNotifications.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-indigo-600 dark:text-indigo-400 flex items-center">
              <Bell size={30} className="mr-3 text-yellow-500" />
              Active Alerts & Updates
            </h2>
            <div className="space-y-6">
              {activeNotifications.map(notification => renderNotificationCard(notification, true))}
            </div>
          </section>
        )}

        {/* Section for All Notifications */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-gray-700 dark:text-gray-300">
            Notification Archive
          </h2>
          {!allNotifications ? (
            <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
              <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
              <p className="text-xl text-red-600 dark:text-red-400 font-semibold">
                Failed to load all notifications.
              </p>
              <p className="text-md text-gray-600 dark:text-gray-400 mt-2">
                Please try again later.
              </p>
            </div>
          ) : allNotifications.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No past notifications found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allNotifications.map(notification => renderNotificationCard(notification, false))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}