"use client";
import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open);

    return (
        <SidebarContext.Provider value={{ open, toggle }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}