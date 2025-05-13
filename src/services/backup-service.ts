
import { supabase } from '@/lib/supabase';
import { storage } from '@/lib/firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

// النسخ الاحتياطي للقاعدة البيانات
export const backupSupabaseData = async (outputDir: string = './backups/database'): Promise<string> => {
  try {
    // التأكد من وجود المجلد
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputPath = path.join(outputDir, `backup-${timestamp}.json`);

    // الحصول على البيانات من جميع الجداول
    const tables = ['projects', 'posts', 'achievements', 'publications', 'files', 'profiles', 'courses', 'course_orders'];
    const backupData: Record<string, any[]> = {};

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*');
      
      if (error) {
        console.error(`Error fetching data from ${table}:`, error);
      } else {
        backupData[table] = data || [];
      }
    }

    // كتابة البيانات إلى ملف JSON
    fs.writeFileSync(outputPath, JSON.stringify(backupData, null, 2), 'utf8');
    
    console.log(`Database backup saved to: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Database backup failed:', error);
    throw error;
  }
};

// نسخ احتياطي للملفات من Firebase Storage
export const backupFirebaseStorage = async (outputDir: string = './backups/storage'): Promise<string[]> {
  try {
    // التأكد من وجود المجلد
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const storagePaths = ['images', 'files', 'images/posts', 'images/projects', 'images/achievements', 'images/publications'];
    const downloadedFiles: string[] = [];

    for (const storagePath of storagePaths) {
      const folderRef = ref(storage, storagePath);
      const storageOutputDir = path.join(outputDir, storagePath);
      
      if (!fs.existsSync(storageOutputDir)) {
        fs.mkdirSync(storageOutputDir, { recursive: true });
      }

      try {
        const result = await listAll(folderRef);
        
        for (const itemRef of result.items) {
          const url = await getDownloadURL(itemRef);
          const fileName = path.join(storageOutputDir, itemRef.name);
          
          // تنزيل الملف باستخدام fetch API
          const response = await fetch(url);
          const buffer = await response.arrayBuffer();
          fs.writeFileSync(fileName, Buffer.from(buffer));
          
          downloadedFiles.push(fileName);
        }
      } catch (error) {
        console.error(`Error backing up storage path ${storagePath}:`, error);
      }
    }

    console.log(`Firebase storage backup completed. Downloaded ${downloadedFiles.length} files.`);
    return downloadedFiles;
  } catch (error) {
    console.error('Firebase storage backup failed:', error);
    throw error;
  }
};

// نسخ احتياطي للكود المصدري
export const backupSourceCode = async (outputDir: string = './backups/source'): Promise<string> {
  try {
    // التأكد من وجود المجلد
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const archiveName = `source-backup-${timestamp}.zip`;
    const outputPath = path.join(outputDir, archiveName);

    // استخدام أداة zip لعمل أرشيف للكود المصدري
    await execAsync(`zip -r ${outputPath} ./src ./public ./scripts ./docs -x */node_modules/* */build/* */dist/* */.git/*`);

    console.log(`Source code backup saved to: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Source code backup failed:', error);
    throw error;
  }
};

// تنفيذ النسخ الاحتياطي الكامل
export const runFullBackup = async (): Promise<{
  databaseBackupPath: string;
  storageFiles: string[];
  sourceCodeBackupPath: string;
}> => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = `./backups/${timestamp}`;

  console.log('Starting full website backup...');
  
  const databaseBackupPath = await backupSupabaseData(`${backupDir}/database`);
  const storageFiles = await backupFirebaseStorage(`${backupDir}/storage`);
  const sourceCodeBackupPath = await backupSourceCode(`${backupDir}/source`);

  console.log('Full website backup completed successfully!');
  
  return {
    databaseBackupPath,
    storageFiles,
    sourceCodeBackupPath
  };
};
