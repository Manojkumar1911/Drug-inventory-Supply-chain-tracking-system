
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
    
    try {
      // Simulate initial progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 5;
        });
      }, 100);
      
      // Get the current user's ID for tracking who uploaded the file
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to upload files');
      }
      
      // Create a record in imported_products to track the import
      const { data: importRecord, error: importError } = await supabase
        .from('imported_products')
        .insert({
          file_name: selectedFile.name,
          imported_by: user.id,
          status: 'processing'
        })
        .select()
        .single();
        
      if (importError) {
        throw new Error(`Failed to create import record: ${importError.message}`);
      }
      
      // Parse the CSV data client-side
      const text = await selectedFile.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',').map(header => header.trim());
      
      // Validate required columns
      const requiredColumns = ['name', 'category', 'quantity', 'unit', 'sku', 'reorder_level', 'location'];
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      
      if (missingColumns.length > 0) {
        throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
      }
      
      // Process and insert products
      let productsAdded = 0;
      let errorCount = 0;
      const productsToInsert = [];
      
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue; // Skip empty rows
        
        const values = rows[i].split(',').map(value => value.trim());
        if (values.length !== headers.length) continue; // Skip malformed rows
        
        const row: Record<string, any> = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        
        // Map CSV fields to your Product model
        const productData = {
          name: row.name,
          sku: row.sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          category: row.category,
          quantity: parseInt(row.quantity) || 0,
          unit: row.unit || 'unit',
          location: row.location || 'Main',
          expiry_date: row.expiry_date ? new Date(row.expiry_date).toISOString() : null,
          reorder_level: parseInt(row.reorder_level) || 10,
          manufacturer: row.manufacturer || null
        };
        
        productsToInsert.push(productData);
      }
      
      // Insert products in batches to avoid timeouts
      const BATCH_SIZE = 50;
      for (let i = 0; i < productsToInsert.length; i += BATCH_SIZE) {
        const batch = productsToInsert.slice(i, i + BATCH_SIZE);
        
        const { data: insertedData, error: insertError } = await supabase
          .from('products')
          .insert(batch);
          
        if (insertError) {
          console.error('Error inserting batch:', insertError);
          errorCount += batch.length;
        } else {
          productsAdded += batch.length;
        }
        
        // Update progress based on batches processed
        const percentComplete = Math.min(90 + (10 * (i + batch.length) / productsToInsert.length), 99);
        setUploadProgress(Math.round(percentComplete));
      }
      
      // Update the import record with results
      await supabase
        .from('imported_products')
        .update({
          status: errorCount > 0 ? 'completed_with_errors' : 'completed',
          row_count: productsAdded,
          error_count: errorCount
        })
        .eq('id', importRecord.id);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadComplete(true);
        toast.success(`CSV file uploaded successfully. ${productsAdded} products imported.`);
        
        // After 2 seconds, reset and close
        setTimeout(() => {
          resetUpload();
          onOpenChange(false);
          window.location.reload(); // Refresh the page to show new data
        }, 2000);
      }, 500);
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
