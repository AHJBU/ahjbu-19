

-- Create the navigation_links table if it doesn't exist
CREATE OR REPLACE FUNCTION create_navigation_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'navigation_links'
  ) THEN
    -- Create the table
    CREATE TABLE public.navigation_links (
      id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
      title text NOT NULL,
      title_ar text NOT NULL,
      href text NOT NULL,
      parent_id uuid REFERENCES public.navigation_links(id),
      enabled boolean DEFAULT true,
      "order" int NOT NULL,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );

    -- Add comment
    COMMENT ON TABLE public.navigation_links IS 'Stores navigation menu links for the website header';

    -- Enable Row Level Security
    ALTER TABLE public.navigation_links ENABLE ROW LEVEL SECURITY;

    -- Set up RLS policies
    CREATE POLICY "Allow public read access" ON public.navigation_links
      FOR SELECT USING (true);

    CREATE POLICY "Allow authenticated insert access" ON public.navigation_links
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      
    CREATE POLICY "Allow authenticated update access" ON public.navigation_links
      FOR UPDATE USING (auth.role() = 'authenticated');
      
    CREATE POLICY "Allow authenticated delete access" ON public.navigation_links
      FOR DELETE USING (auth.role() = 'authenticated');

    -- Create the updated_at trigger
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.navigation_links
    FOR EACH ROW
    EXECUTE PROCEDURE public.set_updated_at();
    
  END IF;
END;
$$;

-- Create the settings table if it doesn't exist
CREATE OR REPLACE FUNCTION create_settings_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'settings'
  ) THEN
    -- Create the table
    CREATE TABLE public.settings (
      id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
      key text NOT NULL UNIQUE,
      value jsonb NOT NULL,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );

    -- Add comment
    COMMENT ON TABLE public.settings IS 'Stores application settings and configurations';

    -- Enable Row Level Security
    ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

    -- Set up RLS policies
    CREATE POLICY "Allow public read access" ON public.settings
      FOR SELECT USING (true);

    CREATE POLICY "Allow authenticated insert access" ON public.settings
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      
    CREATE POLICY "Allow authenticated update access" ON public.settings
      FOR UPDATE USING (auth.role() = 'authenticated');
      
    CREATE POLICY "Allow authenticated delete access" ON public.settings
      FOR DELETE USING (auth.role() = 'authenticated');

    -- Create the updated_at trigger
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE PROCEDURE public.set_updated_at();
    
  END IF;
END;
$$;

-- Create the social_webhook_logs table
CREATE OR REPLACE FUNCTION create_social_webhook_logs_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'social_webhook_logs'
  ) THEN
    -- Create the table
    CREATE TABLE public.social_webhook_logs (
      id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
      direction text NOT NULL, -- 'incoming' or 'outgoing'
      platform text,
      payload jsonb,
      status text,
      created_at timestamp with time zone DEFAULT now()
    );

    -- Add comment
    COMMENT ON TABLE public.social_webhook_logs IS 'Logs for social media webhook interactions';

    -- Enable Row Level Security
    ALTER TABLE public.social_webhook_logs ENABLE ROW LEVEL SECURITY;

    -- Set up RLS policies
    CREATE POLICY "Allow authenticated read access" ON public.social_webhook_logs
      FOR SELECT USING (auth.role() = 'authenticated');

    CREATE POLICY "Allow authenticated insert access" ON public.social_webhook_logs
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
    CREATE POLICY "Allow anon insert access for incoming webhooks" ON public.social_webhook_logs
      FOR INSERT WITH CHECK (direction = 'incoming');
  END IF;
END;
$$;

