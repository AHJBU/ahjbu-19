
import { supabase } from '@/lib/supabase';

// Function to create navigation_links table if it doesn't exist
export const setupNavigationLinksTable = async () => {
  try {
    // Check if the table exists by attempting to select from it
    const { error } = await supabase
      .from('navigation_links')
      .select('*')
      .limit(1);
    
    // If there's an error, the table probably doesn't exist
    if (error) {
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
  } catch (err) {
    console.error('Error checking for navigation_links table:', err);
    return false;
  }
};

// Function to setup AI settings table
export const setupAISettingsTable = async () => {
  try {
    // Check if the settings table exists
    const { error: checkError } = await supabase
      .from('settings')
      .select('*')
      .limit(1);
    
    let tableExists = !checkError;
    
    // Create the settings table if it doesn't exist
    if (!tableExists) {
      const { error: createError } = await supabase.rpc('create_settings_table', {});
      
      if (createError) {
        console.error('Error creating settings table:', createError);
        return false;
      }
      
      console.log('Settings table created successfully');
    }
    
    // Check if AI settings exist
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'ai_settings')
      .single();
    
    // If AI settings don't exist, create default settings
    if (error || !data) {
      const defaultSettings = {
        key: 'ai_settings',
        value: {
          apiKey: '',
          provider: 'openai',
          model: 'gpt-4o',
        }
      };
      
      const { error: insertError } = await supabase
        .from('settings')
        .insert([defaultSettings]);
        
      if (insertError) {
        console.error('Error inserting default AI settings:', insertError);
      } else {
        console.log('Default AI settings added successfully');
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error setting up AI settings:', err);
    return false;
  }
};

// Call this function from your app initialization
export const setupDatabase = async () => {
  // Check if we need to perform any database setup
  const setupNeeded = localStorage.getItem('database_setup_complete') !== 'true';
  
  if (setupNeeded) {
    try {
      await setupNavigationLinksTable();
      await setupAISettingsTable();
      localStorage.setItem('database_setup_complete', 'true');
    } catch (error) {
      console.error('Database setup error:', error);
    }
  }
};
