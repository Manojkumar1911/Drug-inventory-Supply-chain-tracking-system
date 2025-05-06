
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const UploadSuccess: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center p-6 mt-6"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <CheckCircle2 className="w-16 h-16 text-green-500" />
      </motion.div>
      <h3 className="mt-4 text-xl font-medium">Upload Complete!</h3>
      <p className="text-sm text-muted-foreground mt-1 text-center">
        Your CSV file has been successfully processed.<br />
        The page will refresh automatically to show your data.
      </p>
      
      <div className="flex gap-2 mt-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/reorder')}
          className="mt-2"
        >
          Go to Reorder Page
        </Button>
      </div>
    </motion.div>
  );
};

export default UploadSuccess;
