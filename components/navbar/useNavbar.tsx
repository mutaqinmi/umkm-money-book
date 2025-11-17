"use client";
import { createContext, useContext, useState } from "react";

interface NavbarContext {
    isOpen: boolean;
    toggleNavbar: () => void;
}

const NavbarContext = createContext<NavbarContext | undefined>(undefined);

export function NavbarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return <NavbarContext.Provider value={{ isOpen, toggleNavbar }}>
        {children}
    </NavbarContext.Provider>
}

export function useNavbar() {
    const context = useContext(NavbarContext);
    if (!context) {
        throw new Error("useNavbar must be used within NavbarProvider");
    }
    return context;
}