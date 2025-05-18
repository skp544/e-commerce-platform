"use client";

import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { ModalContextType, ModalData } from "@/types";

interface Props {
  children: React.ReactNode;
}

export const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => {},
  setClose: () => {},
});

const ModalProvider: FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalData>({});
  const [showingModal, setShowingModal] = useState<React.ReactNode>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setOpen = async (
    modal: React.ReactNode,
    fetchData?: () => Promise<any>,
  ) => {
    if (modal) {
      if (fetchData) {
        setData({ ...data, ...(await fetchData()) } || {});
      }
      setShowingModal(modal);
      setIsOpen(true);
    }
  };

  const setClose = () => {
    setIsOpen(false);
    setData({});
  };

  if (!isMounted) return null;

  return (
    <ModalContext.Provider value={{ data, setOpen, setClose, isOpen }}>
      {children}
      {showingModal}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within the modal provider");
  }
  return context;
};

export default ModalProvider;
