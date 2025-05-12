
import { supabase } from '@/lib/supabase';

// Function to create navigation_links table if it doesn't exist
export const setupNavigationLinksTable = async () => {
  // Check if the table exists
  const { error: checkError } = await supabase
    .from('navigation_links')
    .select('*')
    .limit(1)
    .catch(() => ({ error: { message: 'Table does not exist' } }));
  
  // If there's an error, the table probably doesn't exist
  if (checkError) {
    // Create the table using SQL
    const { error: createError } = await supabase.rpc('create_navigation_table', {});
    
    if (createError) {
      console.error('Error creating navigation_links table:', createError);
      return false;
    }

    // Insert default navigation links
    const defaultLinks = [
      { title: 'Home', titleAr: 'الرئيسية', href: '/', enabled: true, order: 1 },
      { title: 'Blog', titleAr: 'المدونة', href: '/blog', enabled: true, order: 2 },
      { title: 'Projects', titleAr: 'المشاريع', href: '/projects', enabled: true, order: 3 },
      { title: 'Publications', titleAr: 'المنشورات', href: '/publications', enabled: true, order: 4 },
      { title: 'Courses', titleAr: 'الدورات', href: '/courses', enabled: true, order: 5 },
      { title: 'Achievements', titleAr: 'الإنجازات', href: '/achievements', enabled: true, order: 6 },
      { title: 'Contact', titleAr: 'اتصل بنا', href: '/contact', enabled: true, order: 7 },
    ];

    const { error: insertError } = await supabase
      .from('navigation_links')
      .insert(defaultLinks);

    if (insertError) {
      console.error('Error inserting default navigation links:', insertError);
      return false;
    }

    console.log('Navigation links table created and default links added successfully');
    return true;
  }

  console.log('Navigation links table already exists');
  return true;
};

// Call this function from your app initialization
export const setupDatabase = async () => {
  // Check if we need to perform any database setup
  const setupNeeded = localStorage.getItem('database_setup_complete') !== 'true';
  
  if (setupNeeded) {
    try {
      await setupNavigationLinksTable();
      localStorage.setItem('database_setup_complete', 'true');
    } catch (error) {
      console.error('Database setup error:', error);
    }
  }
};
