import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, Search, User } from "lucide-react"

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 pr-4 py-2 text-sm border border-input"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}