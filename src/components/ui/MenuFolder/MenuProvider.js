"use client";

import { createContext, useContext } from "react";
import { useMenu } from "./useMenu";

const MenuContext = createContext(null);

export function MenuProvider({ children, className = "" }) {
  const menu = useMenu();

  return (
    <MenuContext.Provider value={menu}>
      <div className={`w-full ${className}`}>{children}</div>
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("Menu components must be inside MenuProvider");
  return ctx;
}
