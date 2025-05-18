import React from "react";
import { User } from "@/lib/generated/prisma";

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterValue: string;
  actionButtonText?: React.ReactNode;
  modalChildren?: React.ReactNode;
  newTabLink?: string;
  searchPlaceholder: string;
  heading?: string;
  subheading?: string;
  noHeader?: true;
}

export type ModalData = {
  user?: User;
};

export type ModalContextType = {
  data: ModalData;
  isOpen: boolean;
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void;
  setClose: () => void;
};
