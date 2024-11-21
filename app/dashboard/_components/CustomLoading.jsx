import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import '../../../style/alert.css'
function CustomLoading({loading}) {
  return (
    
      <AlertDialog open={loading}>
        <AlertDialogContent>
            <div className="loader">
            </div>
        </AlertDialogContent>
      </AlertDialog>
    
  );
}

export default CustomLoading;
