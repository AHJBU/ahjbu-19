
/**
 * DUMMY FILE - DO NOT USE
 * 
 * This file exists only for backwards compatibility.
 * All functionality has been migrated to MySQL services.
 */

// Log a warning when this file is imported
console.warn("Firebase is deprecated in this project. Please use MySQL services instead.");

// Export dummy values to prevent breaking imports
export const storage = {};

// Empty export to satisfy module requirements
export const firebaseApp = null;

// Add types to prevent build errors
export type MediaItem = {
  name: string;
  url: string;
  fullPath: string;
  contentType: string;
  size: number;
  timeCreated: string;
};
