
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { PlusCircle, Pencil, Trash2, GripVertical, ChevronDown } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Interface for navigation links
interface NavItem {
  id: string;
  title: string;
  titleAr: string;
  href: string;
  parent_id?: string | null;
  submenu?: NavItem[];
  enabled: boolean;
  order: number;
}

// Function to get navigation links from Supabase
const getNavigationLinks = async (): Promise<NavItem[]> => {
  const { data, error } = await supabase
    .from('navigation_links')
    .select('*')
    .order('order', { ascending: true });
  
  if (error) throw error;
  return data as NavItem[];
};

// Function to create a new navigation link
const createNavigationLink = async (link: Omit<NavItem, 'id'>): Promise<NavItem> => {
  const { data, error } = await supabase
    .from('navigation_links')
    .insert([link])
    .select()
    .single();
  
  if (error) throw error;
  return data as NavItem;
};

// Function to update a navigation link
const updateNavigationLink = async (id: string, link: Partial<NavItem>): Promise<NavItem> => {
  const { data, error } = await supabase
    .from('navigation_links')
    .update(link)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as NavItem;
};

// Function to delete a navigation link
const deleteNavigationLink = async (id: string): Promise<void> => {
  // First, update any child links to have no parent
  await supabase
    .from('navigation_links')
    .update({ parent_id: null })
    .eq('parent_id', id);
  
  const { error } = await supabase
    .from('navigation_links')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Function to organize links into a hierarchy
const organizeLinks = (links: NavItem[]): NavItem[] => {
  const topLevelLinks: NavItem[] = [];
  const childrenMap: Record<string, NavItem[]> = {};
  
  // First pass: group children by parent_id
  links.forEach(link => {
    if (!link.parent_id) {
      topLevelLinks.push({ ...link, submenu: [] });
    } else {
      if (!childrenMap[link.parent_id]) {
        childrenMap[link.parent_id] = [];
      }
      childrenMap[link.parent_id].push(link);
    }
  });
  
  // Second pass: add children to their parents
  topLevelLinks.forEach(link => {
    if (childrenMap[link.id]) {
      link.submenu = childrenMap[link.id].sort((a, b) => a.order - b.order);
    }
  });
  
  return topLevelLinks.sort((a, b) => a.order - b.order);
};

const HeaderEditor = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<NavItem | null>(null);
  const [isAddingSubmenu, setIsAddingSubmenu] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    href: '',
    enabled: true,
    order: 0,
  });

  // Fetch navigation links
  const { data: rawLinks = [], isLoading } = useQuery({
    queryKey: ['navigation_links'],
    queryFn: getNavigationLinks
  });

  const links = organizeLinks(rawLinks);
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: Omit<NavItem, 'id'>) => createNavigationLink(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation_links'] });
      setDialogOpen(false);
      resetForm();
      toast({
        title: language === 'en' ? 'Link Added' : 'تمت إضافة الرابط',
        description: language === 'en' ? 'Navigation link has been added successfully.' : 'تمت إضافة رابط التنقل بنجاح.',
      });
    },
    onError: (error) => {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NavItem> }) => updateNavigationLink(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation_links'] });
      setDialogOpen(false);
      resetForm();
      toast({
        title: language === 'en' ? 'Link Updated' : 'تم تحديث الرابط',
        description: language === 'en' ? 'Navigation link has been updated successfully.' : 'تم تحديث رابط التنقل بنجاح.',
      });
    },
    onError: (error) => {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNavigationLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation_links'] });
      toast({
        title: language === 'en' ? 'Link Deleted' : 'تم حذف الرابط',
        description: language === 'en' ? 'Navigation link has been deleted successfully.' : 'تم حذف رابط التنقل بنجاح.',
      });
    },
    onError: (error) => {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  });

  // Reset form data
  const resetForm = () => {
    setFormData({
      title: '',
      titleAr: '',
      href: '',
      enabled: true,
      order: rawLinks.length + 1,
    });
    setEditingLink(null);
    setIsAddingSubmenu(false);
    setParentId(null);
  };

  // Handle dialog close
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setDialogOpen(open);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const linkData = {
      ...formData,
      parent_id: isAddingSubmenu ? parentId : null,
    };
    
    if (editingLink) {
      updateMutation.mutate({ id: editingLink.id, data: linkData });
    } else {
      createMutation.mutate(linkData as Omit<NavItem, 'id'>);
    }
  };
  
  // Handle editing a link
  const handleEdit = (link: NavItem) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      titleAr: link.titleAr,
      href: link.href,
      enabled: link.enabled,
      order: link.order,
    });
    setIsAddingSubmenu(false);
    setParentId(link.parent_id || null);
    setDialogOpen(true);
  };
  
  // Handle adding a submenu item
  const handleAddSubmenu = (parentLink: NavItem) => {
    resetForm();
    setIsAddingSubmenu(true);
    setParentId(parentLink.id);
    setDialogOpen(true);
  };
  
  // Handle deleting a link
  const handleDelete = (id: string) => {
    if (confirm(language === 'en' 
      ? 'Are you sure you want to delete this navigation link?' 
      : 'هل أنت متأكد من رغبتك في حذف رابط التنقل هذا؟')) {
      deleteMutation.mutate(id);
    }
  };
  
  // Handle drag and drop reordering
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    // Skip if dropped in the same position
    if (source.index === destination.index && source.droppableId === destination.droppableId) return;
    
    try {
      if (source.droppableId === 'main-menu') {
        // Reordering main menu items
        const reorderedLinks = [...links];
        const [movedItem] = reorderedLinks.splice(source.index, 1);
        reorderedLinks.splice(destination.index, 0, movedItem);
        
        // Update orders in database
        for (let i = 0; i < reorderedLinks.length; i++) {
          await updateNavigationLink(reorderedLinks[i].id, { order: i + 1 });
        }
      } else if (source.droppableId.startsWith('submenu-') && destination.droppableId === source.droppableId) {
        // Reordering submenu items
        const parentId = source.droppableId.replace('submenu-', '');
        const parent = links.find(link => link.id === parentId);
        if (parent && parent.submenu) {
          const submenuItems = [...parent.submenu];
          const [movedItem] = submenuItems.splice(source.index, 1);
          submenuItems.splice(destination.index, 0, movedItem);
          
          // Update orders in database
          for (let i = 0; i < submenuItems.length; i++) {
            await updateNavigationLink(submenuItems[i].id, { order: i + 1 });
          }
        }
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['navigation_links'] });
      
    } catch (error) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'Failed to update menu order.'
          : 'فشل في تحديث ترتيب القائمة.',
        variant: 'destructive',
      });
    }
  };
  
  // Toggle group expansion
  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <DashboardLayout 
      title={language === 'en' ? 'Header Navigation Editor' : 'محرر تنقل الهيدر'}
      breadcrumbs={[
        { label: language === 'en' ? 'Settings' : 'الإعدادات', href: '/dashboard/settings' },
        { label: language === 'en' ? 'Header Editor' : 'محرر الهيدر', href: '/dashboard/header-editor' },
      ]}
    >
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {language === 'en' ? 'Navigation Menu Links' : 'روابط قائمة التنقل'}
            </CardTitle>
            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  resetForm();
                  setDialogOpen(true);
                }}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Add Link' : 'إضافة رابط'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {isAddingSubmenu 
                      ? (language === 'en' ? 'Add Submenu Item' : 'إضافة عنصر قائمة فرعية')
                      : editingLink 
                        ? (language === 'en' ? 'Edit Navigation Link' : 'تعديل رابط التنقل')
                        : (language === 'en' ? 'Add Navigation Link' : 'إضافة رابط تنقل')
                    }
                  </DialogTitle>
                  <DialogDescription>
                    {language === 'en'
                      ? 'Customize the navigation links that appear in the site header.'
                      : 'تخصيص روابط التنقل التي تظهر في رأس الموقع.'
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">
                          {language === 'en' ? 'Title (English)' : 'العنوان (بالإنجليزية)'}
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="titleAr">
                          {language === 'en' ? 'Title (Arabic)' : 'العنوان (بالعربية)'}
                        </Label>
                        <Input
                          id="titleAr"
                          value={formData.titleAr}
                          onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                          required
                          dir="rtl"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="href">
                        {language === 'en' ? 'URL Path' : 'مسار URL'}
                      </Label>
                      <Input
                        id="href"
                        value={formData.href}
                        onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                        placeholder="/example-page"
                        required
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === 'en'
                          ? 'Enter the URL path starting with / (e.g. /about)'
                          : 'أدخل مسار URL بدءًا بـ / (مثل /about)'
                        }
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="order">
                        {language === 'en' ? 'Display Order' : 'ترتيب العرض'}
                      </Label>
                      <Input
                        id="order"
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enabled"
                        checked={formData.enabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                      />
                      <Label htmlFor="enabled">
                        {language === 'en' ? 'Enabled' : 'مفعّل'}
                      </Label>
                    </div>
                    
                    {isAddingSubmenu && (
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm">
                          {language === 'en'
                            ? `Adding submenu item under: ${links.find(l => l.id === parentId)?.title || ''}`
                            : `إضافة عنصر قائمة فرعية تحت: ${links.find(l => l.id === parentId)?.titleAr || ''}`
                          }
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                      {language === 'en' ? 'Cancel' : 'إلغاء'}
                    </Button>
                    <Button type="submit">
                      {language === 'en' ? 'Save' : 'حفظ'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="main-menu">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {links.length > 0 ? (
                      links.map((link, index) => (
                        <Draggable key={link.id} draggableId={link.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="border rounded-md overflow-hidden"
                            >
                              <div className="p-4 bg-card flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div {...provided.dragHandleProps} className="cursor-move">
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{language === 'en' ? link.title : link.titleAr}</h3>
                                    <p className="text-sm text-muted-foreground">{link.href}</p>
                                  </div>
                                  {!link.enabled && (
                                    <Badge variant="outline" className="ml-2">
                                      {language === 'en' ? 'Disabled' : 'معطل'}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" onClick={() => handleAddSubmenu(link)}>
                                    {language === 'en' ? 'Add Submenu' : 'إضافة قائمة فرعية'}
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleEdit(link)}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  {(link.submenu && link.submenu.length > 0) && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => toggleGroup(link.id)}
                                    >
                                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedGroups[link.id] ? 'rotate-180' : ''}`} />
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {/* Submenu items */}
                              {(link.submenu && link.submenu.length > 0) && (
                                <Collapsible open={expandedGroups[link.id]}>
                                  <CollapsibleContent>
                                    <div className="border-t px-4 py-2 bg-muted/50">
                                      <Droppable droppableId={`submenu-${link.id}`}>
                                        {(provided) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="space-y-2"
                                          >
                                            {link.submenu.map((subLink, subIndex) => (
                                              <Draggable key={subLink.id} draggableId={subLink.id} index={subIndex}>
                                                {(provided) => (
                                                  <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className="bg-background border rounded-md p-3 flex items-center justify-between"
                                                  >
                                                    <div className="flex items-center gap-3">
                                                      <div {...provided.dragHandleProps} className="cursor-move">
                                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                      </div>
                                                      <div>
                                                        <h4 className="font-medium text-sm">
                                                          {language === 'en' ? subLink.title : subLink.titleAr}
                                                        </h4>
                                                        <p className="text-xs text-muted-foreground">{subLink.href}</p>
                                                      </div>
                                                      {!subLink.enabled && (
                                                        <Badge variant="outline" className="ml-2 text-xs">
                                                          {language === 'en' ? 'Disabled' : 'معطل'}
                                                        </Badge>
                                                      )}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                      <Button variant="ghost" size="icon" onClick={() => handleEdit(subLink)}>
                                                        <Pencil className="h-3 w-3" />
                                                      </Button>
                                                      <Button variant="ghost" size="icon" onClick={() => handleDelete(subLink.id)}>
                                                        <Trash2 className="h-3 w-3" />
                                                      </Button>
                                                    </div>
                                                  </div>
                                                )}
                                              </Draggable>
                                            ))}
                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        {language === 'en'
                          ? 'No navigation links have been added yet. Click "Add Link" to create one.'
                          : 'لم تتم إضافة روابط تنقل بعد. انقر على "إضافة رابط" لإنشاء واحد.'
                        }
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">
          {language === 'en' ? 'Navigation Preview' : 'معاينة التنقل'}
        </h3>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 border-b pb-4">
              {/* Simulated logo */}
              <div className="font-bold text-lg">
                {language === 'en' ? 'Logo' : 'الشعار'}
              </div>
              
              {/* Simulated navigation */}
              <nav className="flex items-center space-x-4">
                {links
                  .filter(link => link.enabled)
                  .map(link => (
                    <div key={link.id} className="relative group">
                      <div className="px-3 py-2 rounded-md hover:bg-muted cursor-pointer flex items-center">
                        {language === 'en' ? link.title : link.titleAr}
                        {link.submenu && link.submenu.length > 0 && (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                      
                      {/* Simulated dropdown */}
                      {link.submenu && link.submenu.length > 0 && (
                        <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-popover border hidden group-hover:block">
                          <div className="rounded-md p-1">
                            {link.submenu
                              .filter(subLink => subLink.enabled)
                              .map(subLink => (
                                <div key={subLink.id} className="px-3 py-2 rounded-md hover:bg-muted cursor-pointer text-sm">
                                  {language === 'en' ? subLink.title : subLink.titleAr}
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                }
              </nav>
            </div>
            
            <div className="text-sm text-muted-foreground mt-4">
              {language === 'en'
                ? 'This is a simple preview of how your navigation will appear. The actual appearance may vary based on your site theme and layout.'
                : 'هذه معاينة بسيطة لكيفية ظهور التنقل الخاص بك. قد يختلف المظهر الفعلي بناءً على سمة موقعك وتخطيطه.'
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HeaderEditor;
