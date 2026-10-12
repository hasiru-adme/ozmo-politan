import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import NotificationBell from "@/components/NotificationBell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 bg-gray-900 text-white p-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-medium text-sm">{user.name || user.email}</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
          <NotificationBell />
        </div>
        <nav className="flex flex-col gap-1">
          <a href="/admin" className="text-sm px-3 py-2 rounded-lg hover:bg-white/10">Overview</a>
          <a href="/admin/clients" className="text-sm px-3 py-2 rounded-lg hover:bg-white/10">Clients</a>
          <a href="/admin/projects" className="text-sm px-3 py-2 rounded-lg hover:bg-white/10">Projects</a>
          <a href="/admin/tickets" className="text-sm px-3 py-2 rounded-lg hover:bg-white/10">Tickets</a>
          <a href="/admin/audit-log" className="text-sm px-3 py-2 rounded-lg hover:bg-white/10">Audit Log</a>
          <a href="/admin/contacts" className="text-sm px-3 py-2 rounded-lg hover:bg-white/10">Contacts</a>
          <form action="/api/auth/logout" method="POST" className="mt-4">
            <button className="text-sm text-red-400 px-3 py-2">Log out</button>
          </form>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}