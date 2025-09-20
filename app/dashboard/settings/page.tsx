import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your application settings
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Basic application configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Store Name</label>
              <input 
                type="text" 
                placeholder="Enter store name"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Store Description</label>
              <textarea 
                placeholder="Enter store description"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Firebase Configuration</CardTitle>
            <CardDescription>
              Configure your Firebase connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Add your Firebase SDK configuration here when ready.
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Project ID</label>
              <input 
                type="text" 
                placeholder="your-project-id"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}