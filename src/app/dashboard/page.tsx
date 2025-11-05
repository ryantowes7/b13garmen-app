"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
      else setUser(data.user);
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow rounded-lg mt-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Dashboard</h1>
      <p>Selamat datang, {user?.email}</p>
      {/* Menu quick untuk migrasi modul lain */}
    </div>
  );
}