
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
import { Experience } from '@/types/profile';
import { 
  addExperience, 
  updateExperience, 
  deleteExperience, 
  getProfile 
} from '@/services/profile-service';
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2, PlusCircle, Briefcase } from 'lucide-react';

export function ExperienceManager() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState<Omit<Experience, 'id'>>({
    title: '',
    titleAr: '',
    company: '',
    companyAr: '',
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
    mutationFn: (experience: Experience) => addExperience(experience),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setDialogOpen(false);
      resetForm();
      toast({
        title: language === 'en' ? 'Experience Added' : 'تمت إضافة الخبرة',
        description: language === 'en' ? 'Your experience has been added successfully.' : 'تم إضافة خبرتك بنجاح.'
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
    mutationFn: (experience: Experience) => updateExperience(experience),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setDialogOpen(false);
      resetForm();
      toast({
        title: language === 'en' ? 'Experience Updated' : 'تم تحديث الخبرة',
        description: language === 'en' ? 'Your experience has been updated successfully.' : 'تم تحديث خبرتك بنجاح.'
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
    mutationFn: (id: string) => deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setDeleteDialogOpen(false);
      toast({
        title: language === 'en' ? 'Experience Deleted' : 'تم حذف الخبرة',
        description: language === 'en' ? 'Your experience has been deleted successfully.' : 'تم حذف خبرتك بنجاح.'
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
    
    if (editingExperience) {
      updateMutation.mutate({
        ...formData,
        id: editingExperience.id
      });
    } else {
      createMutation.mutate({
        ...formData,
        id: uuidv4()
      });
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData({
      title: experience.title,
      titleAr: experience.titleAr,
      company: experience.company,
      companyAr: experience.companyAr,
      location: experience.location,
      locationAr: experience.locationAr,
      startDate: experience.startDate,
      endDate: experience.endDate,
      description: experience.description,
      descriptionAr: experience.descriptionAr,
      current: experience.current
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setEditingExperience(profile?.experiences.find(exp => exp.id === id) || null);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (editingExperience) {
      deleteMutation.mutate(editingExperience.id);
    }
  };

  const resetForm = () => {
    setEditingExperience(null);
    setFormData({
      title: '',
      titleAr: '',
      company: '',
      companyAr: '',
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
          <Briefcase className="h-5 w-5" />
          {language === 'en' ? 'Work Experience' : 'الخبرات العملية'}
        </CardTitle>
        <Button onClick={handleOpenDialog} variant="outline" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Add Experience' : 'إضافة خبرة'}
        </Button>
      </CardHeader>
      <CardContent>
        {profile?.experiences?.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            {language === 'en' ? 'No experiences added yet.' : 'لم تتم إضافة خبرات بعد.'}
          </div>
        ) : (
          <div className="space-y-4">
            {profile?.experiences?.map((experience) => (
              <div 
                key={experience.id} 
                className="border rounded-lg p-4 bg-card"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-lg">{language === 'en' ? experience.title : experience.titleAr}</h3>
                    <div className="text-muted-foreground">
                      {language === 'en' ? experience.company : experience.companyAr}, {language === 'en' ? experience.location : experience.locationAr}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {new Date(experience.startDate).toLocaleDateString()} - {
                        experience.current
                          ? (language === 'en' ? 'Present' : 'حتى الآن')
                          : (experience.endDate ? new Date(experience.endDate).toLocaleDateString() : '')
                      }
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(experience)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(experience.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm mt-2">
                  {language === 'en' ? experience.description : experience.descriptionAr}
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
                {editingExperience
                  ? (language === 'en' ? 'Edit Experience' : 'تعديل الخبرة')
                  : (language === 'en' ? 'Add Experience' : 'إضافة خبرة')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    {language === 'en' ? 'Job Title (English)' : 'المسمى الوظيفي (بالإنجليزية)'}
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titleAr">
                    {language === 'en' ? 'Job Title (Arabic)' : 'المسمى الوظيفي (بالعربية)'}
                  </Label>
                  <Input
                    id="titleAr"
                    name="titleAr"
                    value={formData.titleAr}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">
                    {language === 'en' ? 'Company (English)' : 'الشركة (بالإنجليزية)'}
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyAr">
                    {language === 'en' ? 'Company (Arabic)' : 'الشركة (بالعربية)'}
                  </Label>
                  <Input
                    id="companyAr"
                    name="companyAr"
                    value={formData.companyAr}
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
                        {language === 'en' ? 'Current position' : 'وظيفة حالية'}
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
                  {editingExperience
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
                {language === 'en' ? 'Delete Experience' : 'حذف الخبرة'}
              </DialogTitle>
            </DialogHeader>
            <p>
              {language === 'en'
                ? `Are you sure you want to delete "${editingExperience?.title}" experience? This action cannot be undone.`
                : `هل أنت متأكد أنك تريد حذف خبرة "${editingExperience?.titleAr}"؟ لا يمكن التراجع عن هذا الإجراء.`}
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
