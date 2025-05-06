
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface UploadProgressProps {
  fileName: string;
  progress: number;
  onCancel: () => void;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ fileName, progress, onCancel }) => {
  return (
    <div className="mt-6 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Uploading {fileName}</Label>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
      
      <p className="text-xs text-muted-foreground">
        Please wait while your file is being processed...
      </p>
      
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel Upload
        </Button>
      </div>
    </div>
  );
};

export default UploadProgress;
