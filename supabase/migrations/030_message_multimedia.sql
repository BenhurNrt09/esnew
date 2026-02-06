-- Add multimedia columns to chat_messages
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'type') THEN
        ALTER TABLE chat_messages ADD COLUMN type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'audio', 'video', 'file'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'file_url') THEN
        ALTER TABLE chat_messages ADD COLUMN file_url TEXT;
    END IF;
END $$;
