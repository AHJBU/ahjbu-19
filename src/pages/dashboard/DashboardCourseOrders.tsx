
import { useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourse, getCourseOrdersWithDetails, updateOrderStatus, deleteOrder } from "@/services/course-service";
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
import {
  Search,
  MoreVertical,
  Check,
  X,
  AlertCircle,
  Clock,
  Trash,
  ChevronLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DashboardCourseOrders = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);

  // Fetch course data
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['course', id],
    queryFn: () => id ? getCourse(id) : Promise.reject(new Error("No course ID provided")),
    enabled: !!id
  });

  // Fetch orders data
  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['course-orders', id],
    queryFn: () => id ? getCourseOrdersWithDetails(id) : Promise.reject(new Error("No course ID provided")),
    enabled: !!id
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) => 
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-orders', id] });
      toast({
        title: language === "en" ? "Order Status Updated" : "تم تحديث حالة الطلب",
        description: language === "en"
          ? "The order status has been updated successfully."
          : "تم تحديث حالة الطلب بنجاح.",
      });
    },
  });

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: number) => deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-orders', id] });
      toast({
        title: language === "en" ? "Order Deleted" : "تم حذف الطلب",
        description: language === "en"
          ? "The order has been deleted successfully."
          : "تم حذف الطلب بنجاح.",
      });
      setOrderToDelete(null);
    },
  });

  // Filter orders by search term
  const filteredOrders = orders.filter(order => {
    return (
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle status change
  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <Check className="h-3 w-3 mr-1" />
          {language === "en" ? "Completed" : "مكتمل"}
        </Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" />
          {language === "en" ? "Pending" : "قيد الانتظار"}
        </Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
          <X className="h-3 w-3 mr-1" />
          {language === "en" ? "Cancelled" : "ملغي"}
        </Badge>;
      default:
        return <Badge variant="outline">
          <AlertCircle className="h-3 w-3 mr-1" />
          {status}
        </Badge>;
    }
  };

  return (
    <DashboardLayout
      title={course ? (language === "en" ? `Orders: ${course.title}` : `الطلبات: ${course.titleAr}`) : (language === "en" ? "Course Orders" : "طلبات الدورة")}
      breadcrumbs={[
        { label: language === "en" ? "Courses" : "الدورات", href: "/dashboard/courses" },
        { label: course ? (language === "en" ? course.title : course.titleAr) : "...", href: `/dashboard/courses/editor/${id}` },
        { label: language === "en" ? "Orders" : "الطلبات", href: `/dashboard/courses/orders/${id}` }
      ]}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              {language === "en" ? "Back to Course" : "العودة إلى الدورة"}
            </Button>

            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === "en" ? "Search orders..." : "بحث في الطلبات..."}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoadingCourse || isLoadingOrders ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {language === "en" ? "Name" : "الاسم"}
                    </TableHead>
                    <TableHead>
                      {language === "en" ? "Email" : "البريد الإلكتروني"}
                    </TableHead>
                    <TableHead>
                      {language === "en" ? "Date" : "التاريخ"}
                    </TableHead>
                    <TableHead>
                      {language === "en" ? "Price" : "السعر"}
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
                      <TableCell className="font-medium">
                        {order.name}
                      </TableCell>
                      <TableCell>
                        <a href={`mailto:${order.email}`} className="text-blue-600 hover:underline">
                          {order.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString(
                          language === "en" ? undefined : "ar-SA"
                        )}
                      </TableCell>
                      <TableCell>
                        {order.price} {order.price > 0 ? course?.currency : ''}
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
                              {language === "en" ? "Change Status" : "تغيير الحالة"}
                            </DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "completed")}>
                              <Check className="h-4 w-4 mr-2 text-green-600" />
                              {language === "en" ? "Mark as Completed" : "وضع علامة مكتمل"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "pending")}>
                              <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                              {language === "en" ? "Mark as Pending" : "وضع علامة قيد الانتظار"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "cancelled")}>
                              <X className="h-4 w-4 mr-2 text-red-600" />
                              {language === "en" ? "Mark as Cancelled" : "وضع علامة ملغي"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setOrderToDelete(order.id)}
                              className="text-red-600"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              {language === "en" ? "Delete Order" : "حذف الطلب"}
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
              <p className="text-muted-foreground">
                {searchTerm
                  ? language === "en"
                    ? "No orders match your search term"
                    : "لا توجد طلبات تطابق بحثك"
                  : language === "en"
                    ? "No orders yet for this course."
                    : "لا توجد طلبات لهذه الدورة حتى الآن."
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
              onClick={() => orderToDelete && deleteOrderMutation.mutate(orderToDelete)}
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
