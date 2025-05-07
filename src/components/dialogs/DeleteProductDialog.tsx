
import React, { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
  onSuccess?: () => void;
}

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({ 
  open, 
  onOpenChange, 
  product,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!product || !product.id) {
      onOpenChange(false);
      return;
    }

    setIsLoading(true);
    try {
      // First check if this product is referenced in any transfers
      const { count: transferCount, error: transferError } = await supabase
        .from('transfers')
        .select('id', { count: 'exact', head: true })
        .eq('product_id', product.id);
        
      if (transferError) throw transferError;
      
      if (transferCount && transferCount > 0) {
        toast.warning(`Cannot delete: Product is used in ${transferCount} transfers. Consider updating quantity to zero instead.`);
        setIsLoading(false);
        return;
      }
      
      // If no transfers reference this product, proceed with deletion
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;

      toast.success("Product deleted successfully");
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the product <strong>{product?.name}</strong> (SKU: {product?.sku}) from your inventory.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            disabled={isLoading} 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProductDialog;
