"use client";


import { motion } from "framer-motion";
import { LayoutDashboard, Archive, ShoppingCart, ChevronLeft, ChevronRight} from "lucide-react";
import SidebarItem from "./SidebarItem";
import SidebarSection from "./SidebarSection";
import { useSidebar } from "@/hooks/use-sidebar";


export default function DashboardSidebar() {
    const { open } = useSidebar();


return (
    <motion.aside
        animate={{ width: open ? 240 : 70 }}
        className="hidden md:flex flex-col h-screen bg-white dark:bg-neutral-900 border-r shadow-sm p-4 overflow-hidden"
    >
    <div className="flex items-center justify-between mb-6">
        <h1 className={`text-xl font-bold transition-opacity ${open ? "opacity-100" : "opacity-0"}`}>
        B13 Admin
        </h1>
    </div>


    <SidebarSection title={open ? "Main Menu" : ""}>
        <SidebarItem label="Dashboard" icon={LayoutDashboard} href="/dashboard" expanded={open} />
        <SidebarItem label="Katalog" icon={Archive} href="/dashboard/katalog" expanded={open} />
        <SidebarItem label="Orderan" icon={ShoppingCart} href="/dashboard/orderan" expanded={open} />
    </SidebarSection>
    </motion.aside>
    );
}