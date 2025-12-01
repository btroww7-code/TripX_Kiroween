import { useState, useEffect, useCallback } from 'react';
import {
  Notification,
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../services/notificationService';

export function useNotifications(userId: string | null | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    try {
      const [notifs, count] = await Promise.all([
        getUserNotifications(userId, true),
        getUnreadNotificationCount(userId),
      ]);

      setNotifications(notifs);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load notifications on mount and when userId changes
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Listen for notification events
  useEffect(() => {
    if (!userId) return;

    const handleNotificationCreated = (event: CustomEvent) => {
      if (event.detail.userId === userId) {
        console.log('New notification created, reloading...');
        loadNotifications();
      }
    };

    const handleNotificationRead = () => {
      console.log('Notification marked as read, reloading...');
      loadNotifications();
    };

    const handleAllNotificationsRead = (event: CustomEvent) => {
      if (event.detail.userId === userId) {
        console.log('All notifications marked as read, reloading...');
        loadNotifications();
      }
    };

    const handleNotificationDeleted = () => {
      console.log('Notification deleted, reloading...');
      loadNotifications();
    };

    window.addEventListener('notificationCreated', handleNotificationCreated as EventListener);
    window.addEventListener('notificationRead', handleNotificationRead as EventListener);
    window.addEventListener('allNotificationsRead', handleAllNotificationsRead as EventListener);
    window.addEventListener('notificationDeleted', handleNotificationDeleted as EventListener);

    return () => {
      window.removeEventListener('notificationCreated', handleNotificationCreated as EventListener);
      window.removeEventListener('notificationRead', handleNotificationRead as EventListener);
      window.removeEventListener('allNotificationsRead', handleAllNotificationsRead as EventListener);
      window.removeEventListener('notificationDeleted', handleNotificationDeleted as EventListener);
    };
  }, [userId, loadNotifications]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [userId, loadNotifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
    // loadNotifications will be triggered by the event
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    await markAllNotificationsAsRead(userId);
    // loadNotifications will be triggered by the event
  }, [userId]);

  const deleteNotif = useCallback(async (notificationId: string) => {
    await deleteNotification(notificationId);
    // loadNotifications will be triggered by the event
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    refresh: loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotif,
  };
}
