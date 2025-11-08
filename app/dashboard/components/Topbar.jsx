"use client";
import { Menu, Sun, Moon } from "lucide-react";
import { useSidebar } from "/hooks/use-sidebar";
import { useTheme } from "next-themes";


export default function Topbar() {
    const { toggle } = useSidebar();
    const { theme, setTheme } = useTheme();

    return (
        <header className="w-full h-16 bg-white dark:bg-neutral-900 border-b px-4 flex items-center justify-between">
            <button onClick={toggle} className="md:hidden p-2 hover:bg-gray-100 rounded">
                <Menu size={22} />
            </button>

            <h2 className="text-xl font-semibold">Dashboard</h2>

            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </header>
    );
}
