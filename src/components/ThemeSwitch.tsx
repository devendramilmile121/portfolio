import { Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/hooks/use-theme'

const themes = [
  { name: 'GitHub Dark', value: 'github', color: 'bg-gray-900' },
  { name: 'Dark Blue', value: 'dark', color: 'bg-blue-600' },
  { name: 'Sunny Yellow', value: 'yellow', color: 'bg-yellow-500' },
  { name: 'Nature Green', value: 'green', color: 'bg-green-600' },
  { name: 'Clean White', value: 'white', color: 'bg-gray-100' },
  { name: 'Liquid Glass Light', value: 'glass-light', color: 'bg-gradient-to-br from-sky-200 via-violet-200 to-orange-200' },
  { name: 'Liquid Glass Dark', value: 'glass-dark', color: 'bg-gradient-to-br from-sky-600 via-violet-600 to-orange-500' },
] as const

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value as any)}
            className="flex items-center gap-2"
          >
            <div className={`w-3 h-3 rounded-full ${themeOption.color}`} />
            <span className={theme === themeOption.value ? 'font-semibold' : ''}>
              {themeOption.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}