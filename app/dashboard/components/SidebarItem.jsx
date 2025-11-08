"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function SidebarItem({ label, icon: Icon, href, expanded }) {
    const pathname = usePathname();
    const active = pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 p-2 rounded-lg transition-all
                ${active ? "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"}`}
        >
        <Icon size={22} />
            {expanded && (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="whitespace-nowrap"
        >
            {label}
        </motion.span>
        )}
        </Link>
    );
}