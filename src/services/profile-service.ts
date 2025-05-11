
import { query, execute, queryOne } from "@/lib/mysql";

export interface Experience {
  id: string;
  period: string;
  title: string;
  titleAr: string;
  company: string;
  companyAr: string;
  description: string;
  descriptionAr: string;
}

export interface Education {
  id: string;
  period: string;
  degree: string;
  degreeAr: string;
  institution: string;
  institutionAr: string;
  description: string;
  descriptionAr: string;
}

export interface Certificate {
  id: string;
  title: string;
  titleAr: string;
  issuer: string;
  issuerAr: string;
  date: string;
  url?: string;
  image?: string;
}

export interface Profile {
  id?: number;
  name: string;
  nameAr: string;
  position: string;
  positionAr: string;
  bio: string;
  bioAr: string;
  additionalBio?: string;
  additionalBioAr?: string;
  image: string;
  skills: string[];
  experiences: Experience[];
  education: Education[];
  certificates: Certificate[];
  resumeUrl?: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
  };
}

interface MySQLProfile {
  id: number;
  name: string;
  name_ar: string;
  position: string;
  position_ar: string;
  bio: string;
  bio_ar: string;
  additional_bio: string | null;
  additional_bio_ar: string | null;
  image: string;
  skills: string;
  resume_url: string | null;
  website: string | null;
  linkedin: string | null;
  github: string | null;
  twitter: string | null;
  instagram: string | null;
  created_at: string;
  updated_at: string;
}

interface MySQLExperience {
  id: number;
  profile_id: number;
  period: string;
  title: string;
  title_ar: string;
  company: string;
  company_ar: string;
  description: string;
  description_ar: string;
  order_num: number;
}

interface MySQLEducation {
  id: number;
  profile_id: number;
  period: string;
  degree: string;
  degree_ar: string;
  institution: string;
  institution_ar: string;
  description: string;
  description_ar: string;
  order_num: number;
}

interface MySQLCertificate {
  id: number;
  profile_id: number;
  title: string;
  title_ar: string;
  issuer: string;
  issuer_ar: string;
  date: string;
  url: string | null;
  image: string | null;
  order_num: number;
}

// Get profile data
export const getProfile = async (): Promise<Profile | null> => {
  try {
    // Get the main profile data
    const profileSql = `SELECT * FROM profile ORDER BY id ASC LIMIT 1`;
    const profileData = await queryOne<MySQLProfile>(profileSql);
    
    if (!profileData) {
      return null;
    }
    
    // Get experiences
    const experiencesSql = `
      SELECT * FROM profile_experiences 
      WHERE profile_id = ? 
      ORDER BY order_num ASC
    `;
    const experiences = await query<MySQLExperience>(experiencesSql, [profileData.id]);
    
    // Get education
    const educationSql = `
      SELECT * FROM profile_education 
      WHERE profile_id = ? 
      ORDER BY order_num ASC
    `;
    const education = await query<MySQLEducation>(educationSql, [profileData.id]);
    
    // Get certificates
    const certificatesSql = `
      SELECT * FROM profile_certificates 
      WHERE profile_id = ? 
      ORDER BY order_num ASC
    `;
    const certificates = await query<MySQLCertificate>(certificatesSql, [profileData.id]);
    
    // Construct full profile object
    return {
      id: profileData.id,
      name: profileData.name,
      nameAr: profileData.name_ar,
      position: profileData.position,
      positionAr: profileData.position_ar,
      bio: profileData.bio,
      bioAr: profileData.bio_ar,
      additionalBio: profileData.additional_bio || undefined,
      additionalBioAr: profileData.additional_bio_ar || undefined,
      image: profileData.image,
      skills: profileData.skills.split(',').map(skill => skill.trim()),
      experiences: experiences.map(exp => ({
        id: String(exp.id),
        period: exp.period,
        title: exp.title,
        titleAr: exp.title_ar,
        company: exp.company,
        companyAr: exp.company_ar,
        description: exp.description,
        descriptionAr: exp.description_ar
      })),
      education: education.map(edu => ({
        id: String(edu.id),
        period: edu.period,
        degree: edu.degree,
        degreeAr: edu.degree_ar,
        institution: edu.institution,
        institutionAr: edu.institution_ar,
        description: edu.description,
        descriptionAr: edu.description_ar
      })),
      certificates: certificates.map(cert => ({
        id: String(cert.id),
        title: cert.title,
        titleAr: cert.title_ar,
        issuer: cert.issuer,
        issuerAr: cert.issuer_ar,
        date: cert.date,
        url: cert.url || undefined,
        image: cert.image || undefined
      })),
      resumeUrl: profileData.resume_url || undefined,
      socialLinks: {
        website: profileData.website || undefined,
        linkedin: profileData.linkedin || undefined,
        github: profileData.github || undefined,
        twitter: profileData.twitter || undefined,
        instagram: profileData.instagram || undefined
      }
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

// Update profile
export const updateProfile = async (profile: Partial<Profile>): Promise<Profile | null> => {
  try {
    // Check if profile exists
    const checkSql = `SELECT id FROM profile LIMIT 1`;
    const existingProfile = await queryOne<{id: number}>(checkSql);
    
    const profileId = existingProfile?.id;
    
    if (profileId) {
      // Update existing profile
      const updates: string[] = [];
      const values: any[] = [];
      
      if (profile.name !== undefined) {
        updates.push('name = ?');
        values.push(profile.name);
      }
      
      if (profile.nameAr !== undefined) {
        updates.push('name_ar = ?');
        values.push(profile.nameAr);
      }
      
      if (profile.position !== undefined) {
        updates.push('position = ?');
        values.push(profile.position);
      }
      
      if (profile.positionAr !== undefined) {
        updates.push('position_ar = ?');
        values.push(profile.positionAr);
      }
      
      if (profile.bio !== undefined) {
        updates.push('bio = ?');
        values.push(profile.bio);
      }
      
      if (profile.bioAr !== undefined) {
        updates.push('bio_ar = ?');
        values.push(profile.bioAr);
      }
      
      if (profile.additionalBio !== undefined) {
        updates.push('additional_bio = ?');
        values.push(profile.additionalBio);
      }
      
      if (profile.additionalBioAr !== undefined) {
        updates.push('additional_bio_ar = ?');
        values.push(profile.additionalBioAr);
      }
      
      if (profile.image !== undefined) {
        updates.push('image = ?');
        values.push(profile.image);
      }
      
      if (profile.skills !== undefined) {
        updates.push('skills = ?');
        values.push(profile.skills.join(','));
      }
      
      if (profile.resumeUrl !== undefined) {
        updates.push('resume_url = ?');
        values.push(profile.resumeUrl);
      }
      
      if (profile.socialLinks) {
        if (profile.socialLinks.website !== undefined) {
          updates.push('website = ?');
          values.push(profile.socialLinks.website);
        }
        
        if (profile.socialLinks.linkedin !== undefined) {
          updates.push('linkedin = ?');
          values.push(profile.socialLinks.linkedin);
        }
        
        if (profile.socialLinks.github !== undefined) {
          updates.push('github = ?');
          values.push(profile.socialLinks.github);
        }
        
        if (profile.socialLinks.twitter !== undefined) {
          updates.push('twitter = ?');
          values.push(profile.socialLinks.twitter);
        }
        
        if (profile.socialLinks.instagram !== undefined) {
          updates.push('instagram = ?');
          values.push(profile.socialLinks.instagram);
        }
      }
      
      updates.push('updated_at = NOW()');
      
      if (updates.length > 0) {
        const updateSql = `
          UPDATE profile 
          SET ${updates.join(', ')}
          WHERE id = ?
        `;
        
        values.push(profileId);
        await execute(updateSql, values);
      }
      
      // Update experiences if provided
      if (profile.experiences) {
        // First delete all existing experiences
        const deleteExpSql = `DELETE FROM profile_experiences WHERE profile_id = ?`;
        await execute(deleteExpSql, [profileId]);
        
        // Then insert new experiences
        for (let i = 0; i < profile.experiences.length; i++) {
          const exp = profile.experiences[i];
          const insertExpSql = `
            INSERT INTO profile_experiences (
              profile_id, period, title, title_ar,
              company, company_ar, description, description_ar, order_num
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          await execute(insertExpSql, [
            profileId,
            exp.period,
            exp.title,
            exp.titleAr,
            exp.company,
            exp.companyAr,
            exp.description,
            exp.descriptionAr,
            i
          ]);
        }
      }
      
      // Update education if provided
      if (profile.education) {
        // First delete all existing education entries
        const deleteEduSql = `DELETE FROM profile_education WHERE profile_id = ?`;
        await execute(deleteEduSql, [profileId]);
        
        // Then insert new education entries
        for (let i = 0; i < profile.education.length; i++) {
          const edu = profile.education[i];
          const insertEduSql = `
            INSERT INTO profile_education (
              profile_id, period, degree, degree_ar,
              institution, institution_ar, description, description_ar, order_num
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          await execute(insertEduSql, [
            profileId,
            edu.period,
            edu.degree,
            edu.degreeAr,
            edu.institution,
            edu.institutionAr,
            edu.description,
            edu.descriptionAr,
            i
          ]);
        }
      }
      
      // Update certificates if provided
      if (profile.certificates) {
        // First delete all existing certificates
        const deleteCertSql = `DELETE FROM profile_certificates WHERE profile_id = ?`;
        await execute(deleteCertSql, [profileId]);
        
        // Then insert new certificates
        for (let i = 0; i < profile.certificates.length; i++) {
          const cert = profile.certificates[i];
          const insertCertSql = `
            INSERT INTO profile_certificates (
              profile_id, title, title_ar, issuer, issuer_ar,
              date, url, image, order_num
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          await execute(insertCertSql, [
            profileId,
            cert.title,
            cert.titleAr,
            cert.issuer,
            cert.issuerAr,
            cert.date,
            cert.url || null,
            cert.image || null,
            i
          ]);
        }
      }
    } else {
      // Create new profile
      const insertSql = `
        INSERT INTO profile (
          name, name_ar, position, position_ar, 
          bio, bio_ar, additional_bio, additional_bio_ar, 
          image, skills, resume_url, website, linkedin, 
          github, twitter, instagram, 
          created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      const result = await execute(insertSql, [
        profile.name || '',
        profile.nameAr || '',
        profile.position || '',
        profile.positionAr || '',
        profile.bio || '',
        profile.bioAr || '',
        profile.additionalBio || null,
        profile.additionalBioAr || null,
        profile.image || '',
        profile.skills ? profile.skills.join(',') : '',
        profile.resumeUrl || null,
        profile.socialLinks?.website || null,
        profile.socialLinks?.linkedin || null,
        profile.socialLinks?.github || null,
        profile.socialLinks?.twitter || null,
        profile.socialLinks?.instagram || null
      ]);
      
      const newProfileId = result.insertId;
      
      // Insert experiences if provided
      if (profile.experiences && profile.experiences.length > 0) {
        for (let i = 0; i < profile.experiences.length; i++) {
          const exp = profile.experiences[i];
          const insertExpSql = `
            INSERT INTO profile_experiences (
              profile_id, period, title, title_ar,
              company, company_ar, description, description_ar, order_num
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          await execute(insertExpSql, [
            newProfileId,
            exp.period,
            exp.title,
            exp.titleAr,
            exp.company,
            exp.companyAr,
            exp.description,
            exp.descriptionAr,
            i
          ]);
        }
      }
      
      // Insert education if provided
      if (profile.education && profile.education.length > 0) {
        for (let i = 0; i < profile.education.length; i++) {
          const edu = profile.education[i];
          const insertEduSql = `
            INSERT INTO profile_education (
              profile_id, period, degree, degree_ar,
              institution, institution_ar, description, description_ar, order_num
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          await execute(insertEduSql, [
            newProfileId,
            edu.period,
            edu.degree,
            edu.degreeAr,
            edu.institution,
            edu.institutionAr,
            edu.description,
            edu.descriptionAr,
            i
          ]);
        }
      }
      
      // Insert certificates if provided
      if (profile.certificates && profile.certificates.length > 0) {
        for (let i = 0; i < profile.certificates.length; i++) {
          const cert = profile.certificates[i];
          const insertCertSql = `
            INSERT INTO profile_certificates (
              profile_id, title, title_ar, issuer, issuer_ar,
              date, url, image, order_num
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          await execute(insertCertSql, [
            newProfileId,
            cert.title,
            cert.titleAr,
            cert.issuer,
            cert.issuerAr,
            cert.date,
            cert.url || null,
            cert.image || null,
            i
          ]);
        }
      }
    }
    
    // Return the updated profile
    return await getProfile();
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
};

// Create the necessary MySQL tables for profile
export const createProfileTables = async (): Promise<void> => {
  try {
    // Main profile table
    await execute(`
      CREATE TABLE IF NOT EXISTS profile (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        name_ar VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        position_ar VARCHAR(255) NOT NULL,
        bio TEXT NOT NULL,
        bio_ar TEXT NOT NULL,
        additional_bio TEXT,
        additional_bio_ar TEXT,
        image VARCHAR(255) NOT NULL,
        skills TEXT NOT NULL,
        resume_url VARCHAR(255),
        website VARCHAR(255),
        linkedin VARCHAR(255),
        github VARCHAR(255),
        twitter VARCHAR(255),
        instagram VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Profile experiences table
    await execute(`
      CREATE TABLE IF NOT EXISTS profile_experiences (
        id INT PRIMARY KEY AUTO_INCREMENT,
        profile_id INT NOT NULL,
        period VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        company_ar VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        description_ar TEXT NOT NULL,
        order_num INT NOT NULL DEFAULT 0,
        FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
      )
    `);
    
    // Profile education table
    await execute(`
      CREATE TABLE IF NOT EXISTS profile_education (
        id INT PRIMARY KEY AUTO_INCREMENT,
        profile_id INT NOT NULL,
        period VARCHAR(50) NOT NULL,
        degree VARCHAR(255) NOT NULL,
        degree_ar VARCHAR(255) NOT NULL,
        institution VARCHAR(255) NOT NULL,
        institution_ar VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        description_ar TEXT NOT NULL,
        order_num INT NOT NULL DEFAULT 0,
        FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
      )
    `);
    
    // Profile certificates table
    await execute(`
      CREATE TABLE IF NOT EXISTS profile_certificates (
        id INT PRIMARY KEY AUTO_INCREMENT,
        profile_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255) NOT NULL,
        issuer VARCHAR(255) NOT NULL,
        issuer_ar VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        url VARCHAR(255),
        image VARCHAR(255),
        order_num INT NOT NULL DEFAULT 0,
        FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
      )
    `);
    
    console.log("MySQL tables for profile have been created or already exist.");
  } catch (error) {
    console.error("Error creating profile tables:", error);
    throw error;
  }
};
