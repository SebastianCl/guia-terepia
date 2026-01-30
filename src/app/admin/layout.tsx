import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Package, 
  Video, 
  KeyRound,
  LogOut,
  Activity,
  Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/clinicas', label: 'Clínicas', icon: Building2 },
  { href: '/admin/terapeutas', label: 'Terapeutas', icon: Users },
  { href: '/admin/paquetes', label: 'Paquetes', icon: Package },
  { href: '/admin/videos', label: 'Videos', icon: Video },
  { href: '/admin/codigos', label: 'Códigos', icon: KeyRound },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Solo admin y jefe de clínica pueden acceder
  if (session.user.rol !== 'ADMINISTRATIVO' && session.user.rol !== 'JEFE_CLINICA') {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-card border-r-2">
        {/* Logo */}
        <div className="p-6 border-b-2">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Activity className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold">Guía Terapia</span>
              <span className="text-sm text-muted-foreground">Panel de Gestión</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium hover:bg-accent transition-colors"
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{session.user.name}</p>
              <p className="text-sm text-muted-foreground truncate">{session.user.rol}</p>
            </div>
          </div>
          <form action={async () => {
            'use server'
            const { signOut } = await import('@/lib/auth')
            await signOut({ redirectTo: '/' })
          }}>
            <Button type="submit" variant="outline" className="w-full">
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b-2 p-4">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-bold">Panel Admin</span>
          </Link>
          <Button variant="ghost" size="icon">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-muted/30">
        <div className="lg:p-8 p-4 pt-20 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
