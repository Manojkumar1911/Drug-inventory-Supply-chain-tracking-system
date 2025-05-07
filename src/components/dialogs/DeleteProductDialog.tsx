
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
import { Trash2, AlertTriangle, CheckCircle2, XCircle, Loader2 } from "lucide-react";

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
  const [status, setStatus] = useState<'idle' | 'checking' | 'error' | 'success'>('idle');
  const [transferCount, setTransferCount] = useState(0);

  const handleDelete = async () => {
    if (!product || !product.id) {
      onOpenChange(false);
      return;
    }

    setStatus('checking');
    setIsLoading(true);
    
    try {
      // First check if this product is referenced in any transfers
      const { count, error: transferError } = await supabase
        .from('transfers')
        .select('id', { count: 'exact', head: true })
        .eq('product_id', product.id);
        
      if (transferError) throw transferError;
      
      if (count && count > 0) {
        setTransferCount(count);
        setStatus('error');
        toast.warning(`Cannot delete: Product is used in ${count} transfers. Consider updating quantity to zero instead.`, {
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          duration: 5000
        });
        setIsLoading(false);
        return;
      }
      
      // If no transfers reference this product, proceed with deletion
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;

      setStatus('success');
      toast.success("Product deleted successfully", {
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        className: "bg-green-50 border border-green-100",
      });
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onOpenChange(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product", {
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        className: "bg-red-50 border border-red-100",
      });
      setStatus('idle');
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-red-100 bg-gradient-to-br from-white to-red-50/30 dark:from-gray-950 dark:to-red-950/10 shadow-lg">
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <AlertDialogTitle className="text-center text-xl">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-2">
            <p>
              This will permanently delete the product <span className="font-medium text-foreground">{product?.name}</span> (SKU: <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">{product?.sku}</span>) from your inventory.
            </p>
            <p className="text-red-600 dark:text-red-400 font-medium flex items-center justify-center gap-1">
              <AlertTriangle className="h-4 w-4" /> This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
          <AlertDialogCancel 
            disabled={isLoading} 
            className="border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition-all duration-200 mt-0"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            disabled={isLoading || status === 'success' || status === 'error'} 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600 transition-all duration-200 gap-2"
          >
            {status === 'checking' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Deleted
              </>
            ) : status === 'error' ? (
              <>
                <AlertTriangle className="h-4 w-4" />
                Cannot Delete
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
        {status === 'error' && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-md">
            <p className="text-sm text-amber-800 dark:text-amber-400 flex items-start">
              <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" /> 
              <span>This product is referenced in {transferCount} transfers. Consider updating quantity to zero instead of deleting.</span>
            </p>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProductDialog;
