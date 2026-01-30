import Link from "next/link"
import { Activity } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t-2 bg-muted/50">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Guía Terapia</span>
          </Link>

          {/* Copyright */}
          <p className="text-base text-muted-foreground text-center">
            © {new Date().getFullYear()} Guía Terapia. Plataforma de videos terapéuticos.
          </p>

          {/* Links */}
          <nav className="flex gap-4">
            <Link 
              href="/privacidad" 
              className="text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacidad
            </Link>
            <Link 
              href="/contacto" 
              className="text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              Contacto
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
