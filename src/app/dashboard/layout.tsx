import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import NotificationBell from "@/components/NotificationBell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 border-r border-sage-light bg-white p-5">
     
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-medium text-sm">{user.name || user.email}</p>
            <p className="text-xs text-sage-dark">Client Portal</p>
          </div>
          <NotificationBell />
        </div>
        <nav className="flex flex-col gap-1">
          <a href="/dashboard" className="text-sm px-3 py-2 rounded-lg hover:bg-sage-light/40">Overview</a>
          <a href="/dashboard/payments" className="text-sm px-3 py-2 rounded-lg hover:bg-sage-light/40">Payments</a>
          <a href="/dashboard/tickets" className="text-sm px-3 py-2 rounded-lg hover:bg-sage-light/40">Support</a>
          <form action="/api/auth/logout" method="POST" className="mt-4">
            <button className="text-sm text-red-500 px-3 py-2">Log out</button>
          </form>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}