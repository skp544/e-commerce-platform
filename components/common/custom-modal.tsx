import React, { FC } from "react";
import { useModal } from "@/providers/modal-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  heading?: string;
  subheading?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  maxWidth?: string;
};

const CustomModal: FC<Props> = ({
  children,
  defaultOpen,
  subheading,
  heading,
  maxWidth,
}) => {
  const { isOpen, setClose } = useModal();
  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent
        className={cn(
          "overflow-y-scroll md:max-h-[700px] md:h-fit h-screen bg-card",
          maxWidth,
        )}
      >
        <DialogHeader className="pt-8 text-left">
          {heading && (
            <DialogTitle className="text-2xl font-bold">{heading}</DialogTitle>
          )}
          {subheading && <DialogDescription>{subheading}</DialogDescription>}

          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default CustomModal;
