
#!/usr/bin/env node

const { runFullBackup } = require('../services/backup-service');
const fs = require('fs');
const path = require('path');

// التأكد من وجود مجلد النسخ الاحتياطي
const backupDir = path.join(__dirname, '../../backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

console.log('Starting website backup process...');

runFullBackup()
  .then((result) => {
    console.log('\nBackup Summary:');
    console.log('==============');
    console.log(`Database backup: ${result.databaseBackupPath}`);
    console.log(`Storage files backup: ${result.storageFiles.length} files`);
    console.log(`Source code backup: ${result.sourceCodeBackupPath}`);
    console.log('\nBackup completed successfully!');
  })
  .catch((error) => {
    console.error('Backup failed:', error);
    process.exit(1);
  });
