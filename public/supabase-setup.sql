
-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  titleAr TEXT NOT NULL,
  description TEXT NOT NULL,
  descriptionAr TEXT NOT NULL,
  content TEXT NOT NULL,
  contentAr TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  price NUMERIC(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  duration INTEGER NOT NULL DEFAULT 0,
  lessons INTEGER NOT NULL DEFAULT 0,
  isFree BOOLEAN NOT NULL DEFAULT true,
  showOrders BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  students INTEGER DEFAULT 0,
  tags JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Course orders table
CREATE TABLE IF NOT EXISTS course_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  payment_method TEXT,
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  titleAr TEXT NOT NULL,
  description TEXT,
  descriptionAr TEXT,
  category TEXT NOT NULL,
  fileType TEXT NOT NULL,
  size INTEGER NOT NULL,
  date TEXT NOT NULL,
  downloadUrl TEXT NOT NULL,
  fullPath TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  titleAr TEXT NOT NULL,
  description TEXT NOT NULL,
  descriptionAr TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  link TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Publications table
CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  titleAr TEXT NOT NULL,
  abstract TEXT NOT NULL,
  abstractAr TEXT NOT NULL,
  authors TEXT NOT NULL,
  authorsAr TEXT NOT NULL,
  publishedIn TEXT NOT NULL,
  publishedInAr TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  link TEXT,
  relatedProjectId UUID REFERENCES projects(id) ON DELETE SET NULL,
  relatedPostId UUID REFERENCES posts(id) ON DELETE SET NULL,
  image TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
-- Allow public read access to all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read access for courses" ON courses
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access for files" ON files
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access for achievements" ON achievements
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access for publications" ON publications
  FOR SELECT USING (true);

-- Admin access policies (adjust for your specific auth setup)
CREATE POLICY "Allow admin full access to courses" ON courses
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'admin@example.com'))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'admin@example.com'));

CREATE POLICY "Allow admin full access to course_orders" ON course_orders
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'admin@example.com'))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'admin@example.com'));

CREATE POLICY "Allow admin full access to files" ON files
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'admin@example.com'))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'admin@example.com'));

CREATE POLICY "Allow admin full access to achievements" ON achievements
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'admin@example.com'))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'admin@example.com'));

CREATE POLICY "Allow admin full access to publications" ON publications
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'admin@example.com'))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'admin@example.com'));

-- Function to track file downloads
CREATE OR REPLACE FUNCTION increment_file_downloads()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE files
  SET downloads = downloads + 1
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_courses_updated_at
BEFORE UPDATE ON courses
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_files_updated_at
BEFORE UPDATE ON files
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_achievements_updated_at
BEFORE UPDATE ON achievements
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_publications_updated_at
BEFORE UPDATE ON publications
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
