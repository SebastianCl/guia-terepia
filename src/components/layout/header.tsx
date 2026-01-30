import Link from "next/link"
import { Activity, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  showNav?: boolean
  variant?: 'default' | 'admin'
}

export function Header({ showNav = true, variant = 'default' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Activity className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold">Guía Terapia</span>
            <span className="text-sm text-muted-foreground">Videos de rehabilitación</span>
          </div>
        </Link>

        {/* Navigation */}
        {showNav && (
          <nav className="hidden md:flex items-center gap-2">
            {variant === 'default' ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/terapias">Ver Terapias</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/acceso">Tengo un código</Link>
                </Button>
                <Button asChild>
                  <Link href="/login">Acceso Profesional</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/admin">Dashboard</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/admin/clinicas">Clínicas</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/admin/terapeutas">Terapeutas</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/admin/paquetes">Paquetes</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/admin/videos">Videos</Link>
                </Button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
