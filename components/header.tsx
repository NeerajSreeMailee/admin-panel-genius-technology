import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, Search, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/Authcontext"
import { HeaderClient } from "@/components/header-client"

export function Header() {
  return (
    <header className="border-b">
      <HeaderClient />
    </header>
  )
}