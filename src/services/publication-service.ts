
import { supabase } from '@/lib/supabase';
import { Publication } from '@/types/publication';

// Get all publications
export const getPublications = async (): Promise<Publication[]> => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Publication[];
};

// Get a publication by ID
export const getPublication = async (id: string): Promise<Publication> => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Publication;
};

// Create a new publication
export const createPublication = async (publication: Omit<Publication, 'id'>): Promise<Publication> => {
  const { data, error } = await supabase
    .from('publications')
    .insert([publication])
    .select()
    .single();

  if (error) throw error;
  return data as Publication;
};

// Update an existing publication
export const updatePublication = async (id: string, publication: Partial<Publication>): Promise<Publication> => {
  const { data, error } = await supabase
    .from('publications')
    .update(publication)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Publication;
};

// Delete a publication
export const deletePublication = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('publications')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Get featured publications
export const getFeaturedPublications = async (limit: number = 3): Promise<Publication[]> => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .eq('featured', true)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Publication[];
};

// Archive a publication
export const archivePublication = async (id: string): Promise<Publication> => {
  const { data, error } = await supabase
    .from('publications')
    .update({ archived: true })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Publication;
};

// Restore a publication from archive
export const restorePublication = async (id: string): Promise<Publication> => {
  const { data, error } = await supabase
    .from('publications')
    .update({ archived: false })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Publication;
};

// Get all non-archived publications
export const getNonArchivedPublications = async (): Promise<Publication[]> => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .eq('archived', false)
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Publication[];
};

// Get all archived publications
export const getArchivedPublications = async (): Promise<Publication[]> => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .eq('archived', true)
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Publication[];
};

// Publish to social media
export const publishToSocialMedia = async (publicationId: string, platforms: string[]): Promise<boolean> => {
  try {
    // Fetch the publication data
    const publication = await getPublication(publicationId);
    
    // Create a payload to send to the webhook services
    const payload = {
      title: publication.title,
      titleAr: publication.titleAr,
      abstract: publication.abstract,
      abstractAr: publication.abstractAr,
      image: publication.image,
      link: `${window.location.origin}/publications/${publicationId}`,
      platforms
    };
    
    // Example of calling a webhook URL for n8n or Make integration
    const response = await fetch(
      localStorage.getItem('socialMediaWebhookUrl') || '',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'no-cors',
      }
    );
    
    return true;
  } catch (error) {
    console.error('Error publishing to social media:', error);
    return false;
  }
};

// Import publication from social media webhook
export const handleSocialMediaWebhook = async (data: any): Promise<Publication | null> => {
  try {
    // Extract publication data from webhook payload
    const publicationData = {
      title: data.title || '',
      titleAr: data.titleAr || '',
      abstract: data.abstract || '',
      abstractAr: data.abstractAr || '',
      authors: data.authors || '',
      authorsAr: data.authorsAr || '',
      date: data.date || new Date().toISOString(),
      link: data.link || '',
      image: data.image || '',
      category: data.category || 'Social Import',
      tags: data.tags || ['social-import'],
      featured: false,
      archived: false,
      draft: true,
      publishedIn: data.source || '',
      publishedInAr: data.sourceAr || ''
    };
    
    // Create the publication
    return await createPublication(publicationData as Omit<Publication, 'id'>);
  } catch (error) {
    console.error('Error importing from social media:', error);
    return null;
  }
};

// Save webhook configurations
export const saveWebhookConfigurations = (configurations: {
  makeWebhookUrl?: string;
  n8nWebhookUrl?: string;
  zapierWebhookUrl?: string;
  customWebhookUrl?: string;
}): void => {
  Object.entries(configurations).forEach(([key, value]) => {
    if (value) {
      localStorage.setItem(key, value);
    }
  });
};

// Get webhook configurations
export const getWebhookConfigurations = (): {
  makeWebhookUrl: string;
  n8nWebhookUrl: string;
  zapierWebhookUrl: string;
  customWebhookUrl: string;
} => {
  return {
    makeWebhookUrl: localStorage.getItem('makeWebhookUrl') || '',
    n8nWebhookUrl: localStorage.getItem('n8nWebhookUrl') || '',
    zapierWebhookUrl: localStorage.getItem('zapierWebhookUrl') || '',
    customWebhookUrl: localStorage.getItem('customWebhookUrl') || '',
  };
};
