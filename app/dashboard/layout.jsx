"use client";
import DashboardSidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { SidebarProvider } from "@/hooks/use-sidebar";


export default function DashboardLayout({ children }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-gray-50 dark:bg-neutral-950">
                <DashboardSidebar />
                    <div className="flex-1 flex flex-col">
                    <Topbar />
                        <main className="p-6">{children}</main>
                    </div>
            </div>
        </SidebarProvider>
    );
}