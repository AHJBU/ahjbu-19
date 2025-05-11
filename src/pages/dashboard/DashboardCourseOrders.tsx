
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourseOrdersWithDetails, updateOrderStatus, deleteOrder } from "@/services/course-service";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreVertical,
  Check,
  X,
  AlertTriangle,
  Clock,
  Trash,
  UserCircle,
  BookOpen,
  CalendarDays,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardCourseOrders = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  // Fetch orders data
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['course-orders'],
    queryFn: getCourseOrdersWithDetails
  });

  // Update order status mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-orders'] });
      toast({
        title: language === "en" ? "Status Updated" : "تم تحديث الحالة",
        description: language === "en"
          ? "The order status has been updated successfully."
          : "تم تحديث حالة الطلب بنجاح.",
      });
    },
  });

  // Delete order mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-orders'] });
      toast({
        title: language === "en" ? "Order Deleted" : "تم حذف الطلب",
        description: language === "en"
          ? "The order has been deleted successfully."
          : "تم حذف الطلب بنجاح.",
      });
      setOrderToDelete(null);
    },
  });

  // Get unique statuses
  const statuses = Array.from(
    new Set(orders.map(order => order.status))
  );

  // Filter orders by search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      !searchTerm || 
      order.courses?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.payment_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Function to get a badge for the status
  const getStatusBadge = (status: string) => {
    let color;
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        color = "bg-green-100 text-green-800 hover:bg-green-100";
        break;
      case 'pending':
      case 'processing':
        color = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
        break;
      case 'failed':
      case 'cancelled':
        color = "bg-red-100 text-red-800 hover:bg-red-100";
        break;
      default:
        color = "bg-blue-100 text-blue-800 hover:bg-blue-100";
    }
    
    return <Badge variant="outline" className={color}>{status}</Badge>;
  };

  return (
    <DashboardLayout 
      title={language === "en" ? "Course Orders" : "طلبات الدورات"}
      breadcrumbs={[
        { label: language === "en" ? "Courses" : "الدورات", href: "/dashboard/courses" },
        { label: language === "en" ? "Orders" : "الطلبات", href: "/dashboard/course-orders" }
      ]}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={language === "en" ? "Search orders..." : "بحث في الطلبات..."}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {statuses.length > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={statusFilter || ""}
                    onChange={(e) => setStatusFilter(e.target.value || null)}
                    className="p-2 border rounded-md"
                  >
                    <option value="">
                      {language === "en" ? "All statuses" : "جميع الحالات"}
                    </option>
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <Button onClick={() => navigate("/dashboard/courses")}>
              <BookOpen className="h-4 w-4 mr-2" />
              {language === "en" ? "View All Courses" : "عرض جميع الدورات"}
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {language === "en" ? "Customer" : "العميل"}
                    </TableHead>
                    <TableHead>
                      {language === "en" ? "Course" : "الدورة"}
                    </TableHead>
                    <TableHead>
                      {language === "en" ? "Amount" : "المبلغ"}
                    </TableHead>
                    <TableHead>
                      {language === "en" ? "Date" : "التاريخ"}
                    </TableHead>
                    <TableHead>
                      {language === "en" ? "Status" : "الحالة"}
                    </TableHead>
                    <TableHead className="text-right">
                      {language === "en" ? "Actions" : "الإجراءات"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={order.profiles?.avatar} />
                            <AvatarFallback>
                              <UserCircle className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{order.profiles?.name}</div>
                            <div className="text-xs text-muted-foreground">{order.profiles?.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {order.courses?.image && (
                            <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={order.courses.image} 
                                alt={language === "en" ? order.courses.title : order.courses.titleAr} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="font-medium">
                            {language === "en" ? order.courses?.title : order.courses?.titleAr}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat(language === "en" ? "en-US" : "ar-SA", {
                          style: "currency",
                          currency: order.currency
                        }).format(order.amount)}
                      </TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString(
                          language === "en" ? undefined : "ar-SA"
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                              {language === "en" ? "Actions" : "الإجراءات"}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => statusMutation.mutate({ id: order.id, status: "completed" })}>
                              <Check className="h-4 w-4 mr-2 text-green-500" />
                              {language === "en" ? "Mark Completed" : "تمييز كمكتمل"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => statusMutation.mutate({ id: order.id, status: "pending" })}>
                              <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                              {language === "en" ? "Mark Pending" : "تمييز كقيد الانتظار"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => statusMutation.mutate({ id: order.id, status: "cancelled" })}>
                              <X className="h-4 w-4 mr-2 text-red-500" />
                              {language === "en" ? "Mark Cancelled" : "تمييز كملغي"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setOrderToDelete(order.id)}
                              className="text-red-600"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              {language === "en" ? "Delete" : "حذف"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                {language === "en" ? "No orders found" : "لم يتم العثور على طلبات"}
              </p>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter
                  ? language === "en" 
                      ? "No orders match your search criteria" 
                      : "لا توجد طلبات تطابق معايير البحث"
                  : language === "en" 
                      ? "No course orders have been placed yet."
                      : "لم يتم وضع أي طلبات للدورات حتى الآن."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!orderToDelete} 
        onOpenChange={(open) => !open && setOrderToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "en" ? "Delete Order" : "حذف الطلب"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? "Are you sure you want to delete this order? This action cannot be undone."
                : "هل أنت متأكد من أنك تريد حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "en" ? "Cancel" : "إلغاء"}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => orderToDelete && deleteMutation.mutate(orderToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              {language === "en" ? "Delete" : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default DashboardCourseOrders;
