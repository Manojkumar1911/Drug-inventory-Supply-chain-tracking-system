
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import UploadForm from "./csv-upload/UploadForm";
import UploadProgress from "./csv-upload/UploadProgress";
import UploadSuccess from "./csv-upload/UploadSuccess";

interface CsvUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CsvUploadDialog: React.FC<CsvUploadDialogProps> = ({ open, onOpenChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    handleUpload(selectedFile);
  };

  const handleUpload = async (selectedFile: File) => {
    setUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      // Get a session token to use for authentication
      const { data: session } = await supabase.auth.getSession();
      const token = session?.session?.access_token;
      
      // Upload to our API endpoint
      const response = await fetch('http://localhost:5000/api/products/upload', {
        method: 'POST',
        body: formData,
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      
      clearInterval(interval);
      
      if (response.ok) {
        const result = await response.json();
        setUploadProgress(100);
        
        setTimeout(() => {
          setUploadComplete(true);
          toast.success(`CSV file uploaded successfully. ${result.count || 0} products imported.`);
          
          // After 2 seconds, reset and close
          setTimeout(() => {
            resetUpload();
            onOpenChange(false);
            window.location.reload(); // Refresh the page to show new data
          }, 2000);
        }, 500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      const message = error instanceof Error ? error.message : "Failed to upload file";
      toast.error(message);
      resetUpload();
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setUploading(false);
    setUploadComplete(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!uploading || !newOpen) {
        onOpenChange(newOpen);
        if (!newOpen) resetUpload();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload CSV File</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing product information. Required columns: name, category, quantity, unit, sku, reorder_level, location. Optional: manufacturer, expiry_date.
          </DialogDescription>
        </DialogHeader>
        
        {!uploading && !uploadComplete ? (
          <UploadForm 
            onFileSelect={handleFileSelect} 
            onCancel={() => onOpenChange(false)} 
          />
        ) : uploadComplete ? (
          <UploadSuccess />
        ) : (
          <UploadProgress 
            fileName={file?.name || ''} 
            progress={uploadProgress} 
            onCancel={resetUpload} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CsvUploadDialog;
