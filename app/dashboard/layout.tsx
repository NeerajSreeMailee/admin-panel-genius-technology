import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AdminProtected } from "@/components/admin-protected"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log("DashboardLayout component rendered");
  
  return (
    <AdminProtected>
      <div className="flex h-screen bg-background">
        <aside className="hidden w-64 flex-col border-r bg-background md:flex">
          <Sidebar />
        </aside>
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminProtected>
  )
}