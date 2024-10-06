import { createContext, ReactNode, useState } from 'react';

export const SankeyOpenStateContext = createContext<{
  setSankeyModalOpen: (openState: boolean) => void;
  isOpen: boolean;
}>({ setSankeyModalOpen: () => {}, isOpen: false });

export function SankeyOpenStateProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SankeyOpenStateContext.Provider value={{ isOpen, setSankeyModalOpen: setIsOpen }}>
      {children}
    </SankeyOpenStateContext.Provider>
  );
}
