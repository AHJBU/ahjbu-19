
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { projects } from "@/data/projects";
import { Search, Plus, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

const DashboardProjects = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProjects = projects.filter(project => {
    const title = language === "en" ? project.title : project.titleAr;
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const handleDelete = (id: string) => {
    // This would delete from database in a real implementation
    console.log(`Delete project with ID: ${id}`);
    
    toast({
      title: language === "en" ? "Project deleted" : "تم حذف المشروع",
      description: language === "en" 
        ? "The project has been deleted successfully" 
        : "تم حذف المشروع بنجاح",
    });
  };

  return (
    <DashboardLayout 
      title={language === "en" ? "Manage Projects" : "إدارة المشاريع"}
      breadcrumbs={[
        { label: language === "en" ? "Projects" : "المشاريع", href: "/dashboard/projects" }
      ]}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={language === "en" ? "Search projects..." : "البحث في المشاريع..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button onClick={() => navigate("/dashboard/projects/editor")}>
          <Plus className="h-4 w-4 mr-2" />
          {language === "en" ? "New Project" : "مشروع جديد"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={project.image}
                alt={language === "en" ? project.title : project.titleAr}
                className="w-full h-full object-cover"
              />
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg">
                  {language === "en" ? project.title : project.titleAr}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="-mt-1">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/projects/${project.id}`} className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" />
                        {language === "en" ? "View" : "عرض"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/dashboard/projects/editor/${project.id}`} className="flex items-center">
                        <Pencil className="mr-2 h-4 w-4" />
                        {language === "en" ? "Edit" : "تعديل"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-500 focus:text-red-500"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {language === "en" ? "Delete" : "حذف"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {language === "en" ? project.description : project.descriptionAr}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between p-6 border-t">
              <span className="text-sm text-muted-foreground">
                {project.year}
              </span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate(`/dashboard/projects/editor/${project.id}`)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                {language === "en" ? "Edit" : "تعديل"}
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {filteredProjects.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              {language === "en" 
                ? "No projects found" 
                : "لم يتم العثور على مشاريع"
              }
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardProjects;
