
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, FileText, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CsvUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CsvUploadDialog: React.FC<CsvUploadDialogProps> = ({ open, onOpenChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "text/csv" || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        toast.error("Please upload a CSV file");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);
    
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
          toast.success(`CSV file uploaded successfully. ${result.count} products imported.`);
          
          // After 2 seconds, reset and close
          setTimeout(() => {
            setFile(null);
            setUploadComplete(false);
            setUploading(false);
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
      toast.error(error instanceof Error ? error.message : "Failed to upload file");
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setUploading(false);
    setUploadComplete(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload CSV File</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing product information
          </DialogDescription>
        </DialogHeader>
        
        {!uploading && !uploadComplete ? (
          <div 
            className={`mt-4 p-8 border-2 border-dashed rounded-lg text-center ${
              isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <FileText className="w-12 h-12 text-muted-foreground" />
              </div>
              
              <div>
                <p className="text-sm font-medium">
                  {file ? file.name : "Drag and drop your CSV file here"}
                </p>
                {!file && (
                  <p className="text-xs text-muted-foreground mt-1">
                    or click to browse
                  </p>
                )}
              </div>
              
              {!file && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
              />
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {uploadComplete ? (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center p-6"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                </motion.div>
                <h3 className="mt-4 text-xl font-medium">Upload Complete!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your CSV file has been successfully processed
                </p>
              </motion.div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <Label>Uploading {file?.name}</Label>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Please wait while your file is being processed...
                </p>
              </>
            )}
          </div>
        )}
        
        <DialogFooter className="gap-2 sm:gap-0">
          {!uploading && !uploadComplete && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={uploading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              
              {file && (
                <Button type="button" onClick={handleUpload} disabled={!file || uploading}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              )}
            </>
          )}
          
          {uploading && !uploadComplete && (
            <Button type="button" variant="outline" onClick={resetUpload}>
              Cancel Upload
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CsvUploadDialog;
