import { supabase } from '../lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'transaction' | 'quest' | 'trip' | 'achievement' | 'nft' | 'token';
  read: boolean;
  action_url?: string | null;
  metadata?: any;
  created_at: string;
  expires_at?: string | null;
  updated_at: string;
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: Notification['type'] = 'info',
  actionUrl?: string,
  metadata?: any,
  expiresInHours?: number
): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc('create_notification', {
      p_user_id: userId,
      p_title: title,
      p_message: message,
      p_type: type,
      p_action_url: actionUrl || null,
      p_metadata: metadata || {},
      p_expires_in_hours: expiresInHours || null,
    });

    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }

    console.log('Notification created:', data);

    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('notificationCreated', {
      detail: { notificationId: data, userId }
    }));

    return data;
  } catch (error) {
    console.error('Exception creating notification:', error);
    return null;
  }
}

export async function getUserNotifications(
  userId: string,
  includeRead: boolean = true
): Promise<Notification[]> {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!includeRead) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    // Filter out expired notifications
    const now = new Date();
    return (data || []).filter(n => !n.expires_at || new Date(n.expires_at) > now);
  } catch (error) {
    console.error('Exception fetching notifications:', error);
    return [];
  }
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('get_unread_notification_count', {
      p_user_id: userId,
    });

    if (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }

    return data || 0;
  } catch (error) {
    console.error('Exception fetching unread count:', error);
    return 0;
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    await supabase.rpc('mark_notification_read', {
      p_notification_id: notificationId,
    });

    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('notificationRead', {
      detail: { notificationId }
    }));
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    await supabase.rpc('mark_all_notifications_read', {
      p_user_id: userId,
    });

    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('allNotificationsRead', {
      detail: { userId }
    }));
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
  }
}

export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('notificationDeleted', {
      detail: { notificationId }
    }));
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
}

// Helper functions to create specific notification types

export async function notifyTransactionCompleted(
  userId: string,
  transactionType: 'token' | 'nft',
  amount: string,
  txHash: string
): Promise<void> {
  const title = transactionType === 'token' ? 'TPX Tokens Claimed!' : 'NFT Minted!';
  const message = transactionType === 'token'
    ? `You successfully claimed ${amount} TPX tokens.`
    : `Your ${amount} has been minted successfully!`;

  await createNotification(
    userId,
    title,
    message,
    'transaction',
    undefined,
    { transactionType, amount, txHash },
    72 // Expire after 3 days
  );
}

export async function notifyQuestCompleted(
  userId: string,
  questTitle: string,
  rewardXP: number,
  rewardTokens: number
): Promise<void> {
  await createNotification(
    userId,
    'Quest Completed!',
    `You completed "${questTitle}" and earned ${rewardXP} XP and ${rewardTokens} TPX!`,
    'quest',
    '/quests',
    { questTitle, rewardXP, rewardTokens },
    48 // Expire after 2 days
  );
}

export async function notifyTripCreated(
  userId: string,
  destination: string,
  questsCount: number
): Promise<void> {
  await createNotification(
    userId,
    'Trip Created!',
    `Your trip to ${destination} has been created with ${questsCount} quests to complete.`,
    'trip',
    '/trips',
    { destination, questsCount },
    24 // Expire after 1 day
  );
}

export async function notifyAchievementUnlocked(
  userId: string,
  achievementTitle: string,
  rewardXP: number,
  rewardTokens: number
): Promise<void> {
  await createNotification(
    userId,
    'Achievement Unlocked!',
    `You unlocked "${achievementTitle}"! Reward: ${rewardXP} XP and ${rewardTokens} TPX.`,
    'achievement',
    '/achievements',
    { achievementTitle, rewardXP, rewardTokens },
    72 // Expire after 3 days
  );
}

export async function notifyLevelUp(
  userId: string,
  newLevel: number
): Promise<void> {
  await createNotification(
    userId,
    'Level Up!',
    `Congratulations! You reached Level ${newLevel}!`,
    'success',
    '/profile',
    { newLevel },
    48 // Expire after 2 days
  );
}

export async function notifyTokensClaimed(
  userId: string,
  amount: number,
  txHash: string
): Promise<void> {
  await createNotification(
    userId,
    'TPX Tokens Claimed!',
    `Successfully claimed ${amount} TPX tokens.`,
    'token',
    undefined,
    { amount, txHash },
    72 // Expire after 3 days
  );
}

export async function notifyNFTMinted(
  userId: string,
  nftType: 'passport' | 'achievement',
  tokenId: number,
  txHash: string
): Promise<void> {
  const title = nftType === 'passport' ? 'NFT Passport Minted!' : 'Achievement NFT Minted!';
  const message = nftType === 'passport'
    ? `Your NFT Passport #${tokenId} has been minted!`
    : `Achievement NFT #${tokenId} has been minted!`;

  await createNotification(
    userId,
    title,
    message,
    'nft',
    '/profile',
    { nftType, tokenId, txHash },
    72 // Expire after 3 days
  );
}
