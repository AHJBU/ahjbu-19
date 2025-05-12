
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Education } from '@/types/profile';
import { 
  addEducation,
  updateEducation, 
  deleteEducation, 
  getProfile 
} from '@/services/profile-service';
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2, PlusCircle, GraduationCap } from 'lucide-react';

export function EducationManager() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [formData, setFormData] = useState<Omit<Education, 'id'>>({
    degree: '',
    degreeAr: '',
    institution: '',
    institutionAr: '',
    location: '',
    locationAr: '',
    startDate: '',
    endDate: null,
    description: '',
    descriptionAr: '',
    current: false
  });

  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (education: Education) => addEducation(education),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setDialogOpen(false);
      resetForm();
      toast({
        title: language === 'en' ? 'Education Added' : 'تمت إضافة التعليم',
        description: language === 'en' ? 'Your education has been added successfully.' : 'تم إضافة تعليمك بنجاح.'
      });
    },
    onError: (error) => {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: String(error),
        variant: 'destructive'
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (education: Education) => updateEducation(education),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setDialogOpen(false);
      resetForm();
      toast({
        title: language === 'en' ? 'Education Updated' : 'تم تحديث التعليم',
        description: language === 'en' ? 'Your education has been updated successfully.' : 'تم تحديث تعليمك بنجاح.'
      });
    },
    onError: (error) => {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: String(error),
        variant: 'destructive'
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEducation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setDeleteDialogOpen(false);
      toast({
        title: language === 'en' ? 'Education Deleted' : 'تم حذف التعليم',
        description: language === 'en' ? 'Your education has been deleted successfully.' : 'تم حذف تعليمك بنجاح.'
      });
    },
    onError: (error) => {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: String(error),
        variant: 'destructive'
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ 
      ...formData, 
      current: checked,
      endDate: checked ? null : formData.endDate
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEducation) {
      updateMutation.mutate({
        ...formData,
        id: editingEducation.id
      });
    } else {
      createMutation.mutate({
        ...formData,
        id: uuidv4()
      });
    }
  };

  const handleEdit = (education: Education) => {
    setEditingEducation(education);
    setFormData({
      degree: education.degree,
      degreeAr: education.degreeAr,
      institution: education.institution,
      institutionAr: education.institutionAr,
      location: education.location,
      locationAr: education.locationAr,
      startDate: education.startDate,
      endDate: education.endDate,
      description: education.description,
      descriptionAr: education.descriptionAr,
      current: education.current
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setEditingEducation(profile?.education.find(edu => edu.id === id) || null);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (editingEducation) {
      deleteMutation.mutate(editingEducation.id);
    }
  };

  const resetForm = () => {
    setEditingEducation(null);
    setFormData({
      degree: '',
      degreeAr: '',
      institution: '',
      institutionAr: '',
      location: '',
      locationAr: '',
      startDate: '',
      endDate: null,
      description: '',
      descriptionAr: '',
      current: false
    });
  };

  const handleOpenDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center p-4"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          {language === 'en' ? 'Education' : 'التعليم'}
        </CardTitle>
        <Button onClick={handleOpenDialog} variant="outline" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Add Education' : 'إضافة تعليم'}
        </Button>
      </CardHeader>
      <CardContent>
        {profile?.education?.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            {language === 'en' ? 'No education added yet.' : 'لم تتم إضافة تعليم بعد.'}
          </div>
        ) : (
          <div className="space-y-4">
            {profile?.education?.map((education) => (
              <div 
                key={education.id} 
                className="border rounded-lg p-4 bg-card"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-lg">{language === 'en' ? education.degree : education.degreeAr}</h3>
                    <div className="text-muted-foreground">
                      {language === 'en' ? education.institution : education.institutionAr}, {language === 'en' ? education.location : education.locationAr}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {new Date(education.startDate).toLocaleDateString()} - {
                        education.current
                          ? (language === 'en' ? 'Present' : 'حتى الآن')
                          : (education.endDate ? new Date(education.endDate).toLocaleDateString() : '')
                      }
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(education)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(education.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm mt-2">
                  {language === 'en' ? education.description : education.descriptionAr}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEducation
                  ? (language === 'en' ? 'Edit Education' : 'تعديل التعليم')
                  : (language === 'en' ? 'Add Education' : 'إضافة تعليم')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree">
                    {language === 'en' ? 'Degree (English)' : 'الدرجة العلمية (بالإنجليزية)'}
                  </Label>
                  <Input
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="degreeAr">
                    {language === 'en' ? 'Degree (Arabic)' : 'الدرجة العلمية (بالعربية)'}
                  </Label>
                  <Input
                    id="degreeAr"
                    name="degreeAr"
                    value={formData.degreeAr}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">
                    {language === 'en' ? 'Institution (English)' : 'المؤسسة التعليمية (بالإنجليزية)'}
                  </Label>
                  <Input
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institutionAr">
                    {language === 'en' ? 'Institution (Arabic)' : 'المؤسسة التعليمية (بالعربية)'}
                  </Label>
                  <Input
                    id="institutionAr"
                    name="institutionAr"
                    value={formData.institutionAr}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">
                    {language === 'en' ? 'Location (English)' : 'الموقع (بالإنجليزية)'}
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locationAr">
                    {language === 'en' ? 'Location (Arabic)' : 'الموقع (بالعربية)'}
                  </Label>
                  <Input
                    id="locationAr"
                    name="locationAr"
                    value={formData.locationAr}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    {language === 'en' ? 'Start Date' : 'تاريخ البدء'}
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="endDate">
                      {language === 'en' ? 'End Date' : 'تاريخ الانتهاء'}
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="current" className="text-sm">
                        {language === 'en' ? 'Current' : 'حالي'}
                      </Label>
                      <Switch
                        id="current"
                        checked={formData.current}
                        onCheckedChange={handleSwitchChange}
                      />
                    </div>
                  </div>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate || ''}
                    onChange={handleInputChange}
                    disabled={formData.current}
                    required={!formData.current}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">
                    {language === 'en' ? 'Description (English)' : 'الوصف (بالإنجليزية)'}
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="descriptionAr">
                    {language === 'en' ? 'Description (Arabic)' : 'الوصف (بالعربية)'}
                  </Label>
                  <Textarea
                    id="descriptionAr"
                    name="descriptionAr"
                    value={formData.descriptionAr}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  {language === 'en' ? 'Cancel' : 'إلغاء'}
                </Button>
                <Button type="submit">
                  {editingEducation
                    ? (language === 'en' ? 'Update' : 'تحديث')
                    : (language === 'en' ? 'Save' : 'حفظ')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {language === 'en' ? 'Delete Education' : 'حذف التعليم'}
              </DialogTitle>
            </DialogHeader>
            <p>
              {language === 'en'
                ? `Are you sure you want to delete "${editingEducation?.degree}" education? This action cannot be undone.`
                : `هل أنت متأكد أنك تريد حذف تعليم "${editingEducation?.degreeAr}"؟ لا يمكن التراجع عن هذا الإجراء.`}
            </p>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialogOpen(false)}
              >
                {language === 'en' ? 'Cancel' : 'إلغاء'}
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
              >
                {language === 'en' ? 'Delete' : 'حذف'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
