'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { KeyRound, ArrowRight, ArrowLeft, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function AccesoPage() {
  const router = useRouter()
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/acceso/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigo.toUpperCase().trim() }),
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        router.push(`/ver/${codigo.toUpperCase().trim()}`)
      } else {
        setError(data.message || 'Código no válido o expirado')
      }
    } catch {
      setError('Error al verificar el código. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 bg-muted/30">
        <div className="w-full max-w-lg">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <KeyRound className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Access Card */}
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Introduce tu Código de Acceso</CardTitle>
              <CardDescription className="text-lg">
                El código te lo ha proporcionado tu terapeuta o fisioterapeuta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="text"
                  placeholder="Ej: ABC123"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  className="text-center text-2xl tracking-widest font-mono h-16"
                  maxLength={10}
                  required
                  autoComplete="off"
                  autoFocus
                />

                {error && (
                  <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-center text-lg">
                    {error}
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={loading || codigo.length < 3}>
                  {loading ? (
                    <>Verificando...</>
                  ) : (
                    <>
                      Acceder a mis Ejercicios
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Help text */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-muted-foreground">
              ¿No tienes un código? Solicítalo a tu profesional de salud.
            </p>
            <Button variant="outline" asChild>
              <Link href="/terapias">
                <Activity className="w-5 h-5" />
                O explora las terapias disponibles
              </Link>
            </Button>
          </div>

          {/* Back link */}
          <div className="mt-6 text-center">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="w-5 h-5" />
                Volver al inicio
              </Link>
            </Button>
          </div>

          {/* Demo codes */}
          <div className="mt-8 p-4 rounded-lg bg-muted text-center">
            <p className="text-sm font-medium mb-2">Códigos de prueba:</p>
            <p className="text-sm text-muted-foreground">ABC123 (Lumbalgia) | XYZ789 (Rodilla)</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
