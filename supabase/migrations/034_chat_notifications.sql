-- Function to notify on new chat message
CREATE OR REPLACE FUNCTION public.notify_on_chat_message()
RETURNS TRIGGER AS $$
DECLARE
    sender_name TEXT;
BEGIN
    -- Try to get sender name from members or other profiles if available
    -- For now, we'll use a generic message or try to find the email
    SELECT email INTO sender_name FROM auth.users WHERE id = NEW.sender_id;

    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
        NEW.receiver_id,
        'message',
        'Yeni Mesaj',
        'Bir kullanıcıdan yeni bir mesaj aldınız.',
        '/dashboard/messages'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for chat messages
DROP TRIGGER IF EXISTS after_chat_message_insert ON public.chat_messages;
CREATE TRIGGER after_chat_message_insert
AFTER INSERT ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_chat_message();
