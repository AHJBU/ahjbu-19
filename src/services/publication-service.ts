
import { query, execute, queryOne } from "@/lib/mysql";

export interface Publication {
  id: string;
  title: string;
  titleAr: string;
  abstract: string;
  abstractAr: string;
  authors: string;
  authorsAr: string;
  publishedIn: string;
  publishedInAr: string;
  date: string;
  category: string;
  link?: string;
  image?: string;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
}

// Interface for publications stored in MySQL
interface MySQLPublication {
  id: number;
  title: string;
  title_ar: string;
  abstract: string;
  abstract_ar: string;
  authors: string;
  authors_ar: string;
  published_in: string;
  published_in_ar: string;
  date: string;
  category: string;
  link: string | null;
  image: string | null;
  featured: number;
  created_at: string;
  updated_at: string;
}

// Get all publications
export const getPublications = async (): Promise<Publication[]> => {
  try {
    const sql = `
      SELECT * FROM publications 
      ORDER BY date DESC
    `;
    
    const publications = await query<MySQLPublication>(sql);
    
    return publications.map(pub => ({
      id: String(pub.id),
      title: pub.title,
      titleAr: pub.title_ar,
      abstract: pub.abstract,
      abstractAr: pub.abstract_ar,
      authors: pub.authors,
      authorsAr: pub.authors_ar,
      publishedIn: pub.published_in,
      publishedInAr: pub.published_in_ar,
      date: pub.date,
      category: pub.category,
      link: pub.link || undefined,
      image: pub.image || undefined,
      featured: pub.featured === 1,
      created_at: pub.created_at,
      updated_at: pub.updated_at
    }));
  } catch (error) {
    console.error('Error fetching publications:', error);
    return [];
  }
};

// Get a publication by ID
export const getPublication = async (id: string): Promise<Publication> => {
  try {
    const sql = `SELECT * FROM publications WHERE id = ?`;
    const pub = await queryOne<MySQLPublication>(sql, [id]);
    
    if (!pub) {
      throw new Error('Publication not found');
    }
    
    return {
      id: String(pub.id),
      title: pub.title,
      titleAr: pub.title_ar,
      abstract: pub.abstract,
      abstractAr: pub.abstract_ar,
      authors: pub.authors,
      authorsAr: pub.authors_ar,
      publishedIn: pub.published_in,
      publishedInAr: pub.published_in_ar,
      date: pub.date,
      category: pub.category,
      link: pub.link || undefined,
      image: pub.image || undefined,
      featured: pub.featured === 1,
      created_at: pub.created_at,
      updated_at: pub.updated_at
    };
  } catch (error) {
    console.error(`Error fetching publication ${id}:`, error);
    
    // Return a mock publication for development
    return {
      id: id,
      title: "Sample Publication",
      titleAr: "منشور نموذجي",
      abstract: "This is a sample publication abstract",
      abstractAr: "هذا ملخص منشور نموذجي",
      authors: "John Doe",
      authorsAr: "جون دو",
      publishedIn: "Sample Journal",
      publishedInAr: "مجلة نموذجية",
      date: new Date().toISOString().split('T')[0],
      category: "Article",
      featured: false
    };
  }
};

// Get featured publications
export const getFeaturedPublications = async (limit: number = 3): Promise<Publication[]> => {
  try {
    const sql = `
      SELECT * FROM publications 
      WHERE featured = 1
      ORDER BY date DESC
      LIMIT ?
    `;
    
    const publications = await query<MySQLPublication>(sql, [limit]);
    
    return publications.map(pub => ({
      id: String(pub.id),
      title: pub.title,
      titleAr: pub.title_ar,
      abstract: pub.abstract,
      abstractAr: pub.abstract_ar,
      authors: pub.authors,
      authorsAr: pub.authors_ar,
      publishedIn: pub.published_in,
      publishedInAr: pub.published_in_ar,
      date: pub.date,
      category: pub.category,
      link: pub.link || undefined,
      image: pub.image || undefined,
      featured: pub.featured === 1,
      created_at: pub.created_at,
      updated_at: pub.updated_at
    }));
  } catch (error) {
    console.error('Error fetching featured publications:', error);
    return [];
  }
};

// Create a new publication
export const createPublication = async (publication: Omit<Publication, 'id'>): Promise<Publication> => {
  try {
    const sql = `
      INSERT INTO publications (
        title, title_ar, abstract, abstract_ar, 
        authors, authors_ar, published_in, published_in_ar, 
        date, category, link, image, featured,
        created_at, updated_at
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const result = await execute(sql, [
      publication.title,
      publication.titleAr,
      publication.abstract,
      publication.abstractAr,
      publication.authors,
      publication.authorsAr,
      publication.publishedIn,
      publication.publishedInAr,
      publication.date,
      publication.category,
      publication.link || null,
      publication.image || null,
      publication.featured ? 1 : 0
    ]);
    
    return {
      ...publication,
      id: String(result.insertId),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating publication:', error);
    
    // Return a mock response for development
    return {
      ...publication,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
};

// Update an existing publication
export const updatePublication = async (id: string, publication: Partial<Publication>): Promise<Publication> => {
  try {
    // Build dynamic SQL update based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    
    if (publication.title !== undefined) {
      updates.push('title = ?');
      values.push(publication.title);
    }
    
    if (publication.titleAr !== undefined) {
      updates.push('title_ar = ?');
      values.push(publication.titleAr);
    }
    
    if (publication.abstract !== undefined) {
      updates.push('abstract = ?');
      values.push(publication.abstract);
    }
    
    if (publication.abstractAr !== undefined) {
      updates.push('abstract_ar = ?');
      values.push(publication.abstractAr);
    }
    
    if (publication.authors !== undefined) {
      updates.push('authors = ?');
      values.push(publication.authors);
    }
    
    if (publication.authorsAr !== undefined) {
      updates.push('authors_ar = ?');
      values.push(publication.authorsAr);
    }
    
    if (publication.publishedIn !== undefined) {
      updates.push('published_in = ?');
      values.push(publication.publishedIn);
    }
    
    if (publication.publishedInAr !== undefined) {
      updates.push('published_in_ar = ?');
      values.push(publication.publishedInAr);
    }
    
    if (publication.date !== undefined) {
      updates.push('date = ?');
      values.push(publication.date);
    }
    
    if (publication.category !== undefined) {
      updates.push('category = ?');
      values.push(publication.category);
    }
    
    if (publication.link !== undefined) {
      updates.push('link = ?');
      values.push(publication.link || null);
    }
    
    if (publication.image !== undefined) {
      updates.push('image = ?');
      values.push(publication.image || null);
    }
    
    if (publication.featured !== undefined) {
      updates.push('featured = ?');
      values.push(publication.featured ? 1 : 0);
    }
    
    updates.push('updated_at = NOW()');
    
    if (updates.length > 0) {
      const sql = `
        UPDATE publications 
        SET ${updates.join(', ')}
        WHERE id = ?
      `;
      
      values.push(id);
      await execute(sql, values);
    }
    
    // Return updated publication
    return await getPublication(id);
  } catch (error) {
    console.error(`Error updating publication ${id}:`, error);
    
    // Return a mock response for development
    const existingPublication = await getPublication(id);
    return {
      ...existingPublication,
      ...publication,
      updated_at: new Date().toISOString()
    };
  }
};

// Delete a publication
export const deletePublication = async (id: string): Promise<void> => {
  try {
    const sql = `DELETE FROM publications WHERE id = ?`;
    await execute(sql, [id]);
  } catch (error) {
    console.error(`Error deleting publication ${id}:`, error);
  }
};

// Create the necessary MySQL tables for publications
export const createPublicationsTables = async (): Promise<void> => {
  try {
    // Publications table
    await execute(`
      CREATE TABLE IF NOT EXISTS publications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255) NOT NULL,
        abstract TEXT,
        abstract_ar TEXT,
        authors VARCHAR(255) NOT NULL,
        authors_ar VARCHAR(255) NOT NULL,
        published_in VARCHAR(255),
        published_in_ar VARCHAR(255),
        date DATE NOT NULL,
        category VARCHAR(100) NOT NULL,
        link VARCHAR(255),
        image VARCHAR(255),
        featured BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log("MySQL tables for publications have been created or already exist.");
  } catch (error) {
    console.error("Error creating publications table:", error);
    throw error;
  }
};
