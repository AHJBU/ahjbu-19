
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { runFullBackup } from '@/services/backup-service';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Download, Archive } from 'lucide-react';

interface BackupFile {
  name: string;
  date: Date;
  size: string;
  type: 'database' | 'storage' | 'source';
  path: string;
}

const DashboardBackups = () => {
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // في بيئة الإنتاج، هنا سنقوم بجلب قائمة النسخ الاحتياطية
    // لكن في الوقت الحالي سنستخدم بيانات وهمية للعرض
    const mockBackups: BackupFile[] = [
      {
        name: 'backup-2023-05-10-12-30-00.json',
        date: new Date('2023-05-10T12:30:00'),
        size: '5.2 MB',
        type: 'database',
        path: '/backups/database/backup-2023-05-10-12-30-00.json'
      },
      {
        name: 'source-backup-2023-05-10-12-30-00.zip',
        date: new Date('2023-05-10T12:30:00'),
        size: '25.7 MB',
        type: 'source',
        path: '/backups/source/source-backup-2023-05-10-12-30-00.zip'
      },
      {
        name: 'backup-2023-05-09-12-30-00.json',
        date: new Date('2023-05-09T12:30:00'),
        size: '5.1 MB',
        type: 'database',
        path: '/backups/database/backup-2023-05-09-12-30-00.json'
      },
    ];
    
    setBackups(mockBackups);
    setIsLoading(false);
  }, []);

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    toast({
      title: 'بدء عملية النسخ الاحتياطي',
      description: 'جاري إنشاء نسخة احتياطية كاملة للموقع، قد يستغرق هذا بعض الوقت.',
    });
    
    try {
      // في الواجهة، نقوم فقط بمحاكاة العملية لأن عمليات النسخ الاحتياطي
      // عادة تتم في الخلفية أو على الخادم
      setTimeout(() => {
        const newBackup: BackupFile = {
          name: `backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
          date: new Date(),
          size: '5.4 MB',
          type: 'database',
          path: '/backups/database/latest-backup.json'
        };
        setBackups([newBackup, ...backups]);
        setIsBackingUp(false);
        
        toast({
          title: 'تم إنشاء النسخة الاحتياطية بنجاح',
          description: `تم حفظ النسخة الاحتياطية بتاريخ ${new Date().toLocaleString()}`,
        });
      }, 3000);
      
    } catch (error) {
      console.error('حدث خطأ أثناء إنشاء النسخة الاحتياطية:', error);
      toast({
        title: 'حدث خطأ',
        description: 'لم نتمكن من إنشاء نسخة احتياطية. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
      setIsBackingUp(false);
    }
  };

  const handleDownloadBackup = (backup: BackupFile) => {
    toast({
      title: 'جاري تحميل النسخة الاحتياطية',
      description: `جاري تحميل ${backup.name}`,
    });
    
    // في التطبيق الحقيقي، هنا سيتم تنزيل الملف
    // لكن للأغراض العرضية فقط سنعرض إشعار نجاح
    setTimeout(() => {
      toast({
        title: 'تم التحميل بنجاح',
        description: `تم تحميل ${backup.name} بنجاح`,
      });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">النسخ الاحتياطية</h1>
          <Button onClick={handleCreateBackup} disabled={isBackingUp}>
            {isBackingUp ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري النسخ الاحتياطي
              </>
            ) : (
              <>
                <Archive className="mr-2 h-4 w-4" /> إنشاء نسخة احتياطية جديدة
              </>
            )}
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>إدارة النسخ الاحتياطية</CardTitle>
            <CardDescription>
              هنا يمكنك تحميل وإدارة النسخ الاحتياطية لموقعك
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم النسخة</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الحجم</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backups.map((backup) => (
                    <TableRow key={backup.name}>
                      <TableCell>{backup.name}</TableCell>
                      <TableCell>
                        {backup.type === 'database' ? 'قاعدة البيانات' : 
                         backup.type === 'storage' ? 'وسائط التخزين' : 'كود المصدر'}
                      </TableCell>
                      <TableCell>{backup.date.toLocaleString()}</TableCell>
                      <TableCell>{backup.size}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadBackup(backup)}
                        >
                          <Download className="h-4 w-4 mr-1" /> تحميل
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              إجمالي النسخ الاحتياطية: {backups.length}
            </div>
            <div className="text-sm text-muted-foreground">
              تم آخر نسخ احتياطي في: {backups.length > 0 ? backups[0].date.toLocaleString() : 'غير متوفر'}
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardBackups;
