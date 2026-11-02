// components/ConfirmDialog.tsx
import React, { useEffect } from "react";
import Swal from "sweetalert2";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    Swal.fire({
      title: message,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Add Another",
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      } else {
        onCancel();
      }
    });
  }, []);

  // Don't render anything in the DOM if using SweetAlert
  return null;
};
