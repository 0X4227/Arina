import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DialogComponent = ({
  open,
  setOpen,
  children,
  triggerButtonText,
  dialogTitle,
  isButton,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isButton && (
        <DialogTrigger>
          <Button variant="outline">{triggerButtonText}</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {dialogTitle}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogComponent;
