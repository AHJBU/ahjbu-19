
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
