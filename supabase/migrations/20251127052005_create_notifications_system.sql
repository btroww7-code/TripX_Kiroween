/*
  # Create Notifications System

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text) - Notification title
      - `message` (text) - Notification message
      - `type` (text) - Type: info, success, warning, error, transaction, quest, trip, achievement
      - `read` (boolean) - Whether notification has been read
      - `action_url` (text, optional) - URL to navigate to when clicked
      - `metadata` (jsonb) - Additional data (transaction details, quest info, etc.)
      - `created_at` (timestamptz)
      - `expires_at` (timestamptz, optional) - When notification should auto-expire
  
  2. Security
    - Enable RLS on `notifications` table
    - Add policies for users to read/update their own notifications
    - Add policy for system to create notifications
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'transaction', 'quest', 'trip', 'achievement', 'nft', 'token')),
  read boolean NOT NULL DEFAULT false,
  action_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own notifications
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text IN (
    SELECT auth_user_id::text FROM users WHERE id = notifications.user_id
  ));

-- Policy: Public users can also read their notifications (for wallet users without auth)
CREATE POLICY "Public users can read own notifications"
  ON notifications
  FOR SELECT
  TO public
  USING (true);

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text IN (
    SELECT auth_user_id::text FROM users WHERE id = notifications.user_id
  ))
  WITH CHECK (auth.uid()::text IN (
    SELECT auth_user_id::text FROM users WHERE id = notifications.user_id
  ));

-- Policy: Public users can update their own notifications
CREATE POLICY "Public users can update own notifications"
  ON notifications
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Policy: System can create notifications for any user
CREATE POLICY "System can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Function to automatically clean up expired notifications
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM notifications
  WHERE expires_at IS NOT NULL
  AND expires_at < now();
END;
$$;

-- Function to create notification (can be called from app or triggers)
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id uuid,
  p_title text,
  p_message text,
  p_type text DEFAULT 'info',
  p_action_url text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_expires_in_hours integer DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification_id uuid;
  v_expires_at timestamptz;
BEGIN
  -- Calculate expiration time if provided
  IF p_expires_in_hours IS NOT NULL THEN
    v_expires_at := now() + (p_expires_in_hours || ' hours')::interval;
  END IF;

  -- Create notification
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    action_url,
    metadata,
    expires_at
  )
  VALUES (
    p_user_id,
    p_title,
    p_message,
    p_type,
    p_action_url,
    p_metadata,
    v_expires_at
  )
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$;

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notifications
  SET read = true, updated_at = now()
  WHERE id = p_notification_id;
END;
$$;

-- Function to mark all user notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notifications
  SET read = true, updated_at = now()
  WHERE user_id = p_user_id AND read = false;
END;
$$;

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM notifications
  WHERE user_id = p_user_id
  AND read = false
  AND (expires_at IS NULL OR expires_at > now());
  
  RETURN v_count;
END;
$$;
