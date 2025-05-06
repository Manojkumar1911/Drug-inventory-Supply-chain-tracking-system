
import React, { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { toast } from "sonner";

interface UploadFormProps {
  onFileSelect: (file: File) => void;
  onCancel: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onFileSelect, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    setErrorMessage(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type === "text/csv" || selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
    } else {
      setErrorMessage("Please upload a CSV file");
      toast.error("Please upload a CSV file");
    }
  };

  const handleUpload = () => {
    if (!file) {
      setErrorMessage("Please select a CSV file first");
      return;
    }
    
    onFileSelect(file);
  };

  return (
    <div>
      <div 
        className={`mt-4 p-8 border-2 border-dashed rounded-lg text-center ${
          isDragging ? 'border-primary bg-primary/5' : errorMessage ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <FileText className={`w-12 h-12 ${errorMessage ? 'text-red-500' : 'text-muted-foreground'}`} />
          </div>
          
          <div>
            <p className={`text-sm font-medium ${errorMessage ? 'text-red-500' : ''}`}>
              {file ? file.name : "Drag and drop your CSV file here"}
            </p>
            {!file && !errorMessage && (
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse
              </p>
            )}
            
            {errorMessage && (
              <p className="text-xs text-red-500 mt-1">
                {errorMessage}
              </p>
            )}
          </div>
          
          {!file && (
            <Button
              variant={errorMessage ? "destructive" : "outline"}
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

      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        
        {file && (
          <Button type="button" onClick={handleUpload} disabled={!file}>
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
