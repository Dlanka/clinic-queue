import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";

type QueuePageContextValue = {
  modalOpen: boolean;
  openCreateModal: () => void;
  closeModal: () => void;
};

const QueuePageContext = createContext<QueuePageContextValue | null>(null);

export function QueuePageProvider({ children }: PropsWithChildren) {
  const [modalOpen, setModalOpen] = useState(false);

  const value = useMemo(
    () => ({
      modalOpen,
      openCreateModal: () => setModalOpen(true),
      closeModal: () => setModalOpen(false)
    }),
    [modalOpen]
  );

  return <QueuePageContext.Provider value={value}>{children}</QueuePageContext.Provider>;
}

export function useQueuePageContext() {
  const context = useContext(QueuePageContext);

  if (!context) {
    throw new Error("useQueuePageContext must be used within QueuePageProvider");
  }

  return context;
}
