"use client";

import { useAdminAuth } from "@/lib/admin-auth-client";
import AdminSidebar from "@/components/admin/sidebar";
import { Loader2 } from "lucide-react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />
      <div className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
