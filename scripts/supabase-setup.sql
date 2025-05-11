
-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_ar TEXT,
  description TEXT,
  description_ar TEXT,
  content TEXT,
  content_ar TEXT,
  image TEXT,
  category TEXT,
  level TEXT DEFAULT 'Beginner',
  price NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  duration INTEGER DEFAULT 0,
  lessons INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  show_orders BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  students INTEGER DEFAULT 0,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create course_orders table
CREATE TABLE IF NOT EXISTS public.course_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS courses_featured_idx ON public.courses (featured);
CREATE INDEX IF NOT EXISTS course_orders_course_id_idx ON public.course_orders (course_id);
CREATE INDEX IF NOT EXISTS course_orders_user_id_idx ON public.course_orders (user_id);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_ar TEXT,
  description TEXT,
  description_ar TEXT,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  link TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for achievements by date
CREATE INDEX IF NOT EXISTS achievements_date_idx ON public.achievements (date DESC);

-- Create publications table
CREATE TABLE IF NOT EXISTS public.publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_ar TEXT,
  abstract TEXT,
  abstract_ar TEXT,
  authors TEXT,
  authors_ar TEXT,
  published_in TEXT,
  published_in_ar TEXT,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  link TEXT,
  related_project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  related_post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  image TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for publications by date
CREATE INDEX IF NOT EXISTS publications_date_idx ON public.publications (date DESC);

-- RLS Policies

-- Courses table policies
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY courses_select_all ON public.courses
  FOR SELECT USING (true);

CREATE POLICY courses_insert_authenticated ON public.courses
  FOR INSERT TO authenticated USING (true);

CREATE POLICY courses_update_authenticated ON public.courses
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY courses_delete_authenticated ON public.courses
  FOR DELETE TO authenticated USING (true);

-- Course orders table policies
ALTER TABLE public.course_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY course_orders_select_authenticated ON public.course_orders
  FOR SELECT TO authenticated USING (true);

CREATE POLICY course_orders_insert_authenticated ON public.course_orders
  FOR INSERT TO authenticated USING (true);

CREATE POLICY course_orders_update_owner ON public.course_orders
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY course_orders_delete_owner ON public.course_orders
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Achievements table policies
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY achievements_select_all ON public.achievements
  FOR SELECT USING (true);

CREATE POLICY achievements_insert_authenticated ON public.achievements
  FOR INSERT TO authenticated USING (true);

CREATE POLICY achievements_update_authenticated ON public.achievements
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY achievements_delete_authenticated ON public.achievements
  FOR DELETE TO authenticated USING (true);

-- Publications table policies
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY publications_select_all ON public.publications
  FOR SELECT USING (true);

CREATE POLICY publications_insert_authenticated ON public.publications
  FOR INSERT TO authenticated USING (true);

CREATE POLICY publications_update_authenticated ON public.publications
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY publications_delete_authenticated ON public.publications
  FOR DELETE TO authenticated USING (true);

-- Create or update function to increment course orders count
CREATE OR REPLACE FUNCTION public.increment_course_students()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.courses
  SET students = students + 1
  WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically increment course students count when a new order is placed
DROP TRIGGER IF EXISTS on_course_order_created ON public.course_orders;
CREATE TRIGGER on_course_order_created
  AFTER INSERT ON public.course_orders
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE PROCEDURE public.increment_course_students();
