'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Activity, LogIn, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email o contraseña incorrectos')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('Error al iniciar sesión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
              <Activity className="h-8 w-8 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Guía Terapia</h1>
          <p className="text-muted-foreground">Acceso para profesionales</p>
        </div>

        {/* Login Card */}
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription className="text-lg">
              Ingresa tus credenciales para acceder al panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                label="Correo electrónico"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  label="Contraseña"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[42px] text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-center">
                  {error}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <>Iniciando sesión...</>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="w-5 h-5" />
              Volver al inicio
            </Link>
          </Button>
        </div>

        {/* Demo credentials */}
        <div className="mt-8 p-4 rounded-lg bg-muted text-center">
          <p className="text-sm font-medium mb-2">Credenciales de prueba:</p>
          <p className="text-sm text-muted-foreground">admin@guiaterapia.com / admin123</p>
        </div>
      </div>
    </div>
  )
}
