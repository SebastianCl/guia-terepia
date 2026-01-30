import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Package, Play } from 'lucide-react'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface PageProps {
  params: Promise<{ codigo: string }>
}

async function getCodigoData(codigo: string) {
  const codigoAcceso = await prisma.codigoAcceso.findUnique({
    where: { codigo: codigo.toUpperCase() },
    include: {
      paquetesAsignados: {
        include: {
          paqueteTerapia: {
            include: {
              lesion: true,
              videos: {
                where: { activo: true },
                orderBy: { orden: 'asc' }
              }
            }
          }
        }
      }
    }
  })

  if (!codigoAcceso || !codigoAcceso.activo) return null
  if (new Date() > codigoAcceso.fechaExpiracion) return null

  return codigoAcceso
}

export default async function VerTerapiasPage({ params }: PageProps) {
  const { codigo } = await params
  const data = await getCodigoData(codigo)

  if (!data) {
    notFound()
  }

  const paquetes = data.paquetesAsignados.map(pa => pa.paqueteTerapia)

  return (
    <div className="min-h-screen flex flex-col">
      <Header showNav={false} />
      
      <main className="flex-1 py-8">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/acceso">
                <ArrowLeft className="w-5 h-5" />
                Cambiar código
              </Link>
            </Button>
            
            <div className="flex items-center gap-4 mb-2">
              <Package className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Tus Ejercicios Asignados</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Código: <span className="font-mono font-bold">{codigo.toUpperCase()}</span>
            </p>
          </div>

          {/* Lista de paquetes */}
          <div className="grid gap-6">
            {paquetes.map((paquete) => (
              <Card key={paquete.id} className="border-2">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl mb-2">{paquete.nombre}</CardTitle>
                      <CardDescription className="text-lg">
                        {paquete.descripcion}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {paquete.lesion && (
                        <Badge variant="secondary">{paquete.lesion.nombre}</Badge>
                      )}
                      {paquete.nivel && (
                        <Badge variant="outline">{paquete.nivel}</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Instrucciones */}
                  {paquete.instrucciones && (
                    <div className="mb-6 p-4 rounded-lg bg-muted">
                      <h3 className="font-semibold mb-2">Instrucciones:</h3>
                      <p className="text-muted-foreground">{paquete.instrucciones}</p>
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex flex-wrap gap-6 mb-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      <span>{paquete.videos.length} videos</span>
                    </div>
                    {paquete.duracionEstimada && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span>Duración: {paquete.duracionEstimada}</span>
                      </div>
                    )}
                  </div>

                  {/* Botón ver videos */}
                  <Button size="lg" asChild>
                    <Link href={`/ver/${codigo}/${paquete.id}`}>
                      <Play className="w-5 h-5" />
                      Ver Videos del Paquete
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {paquetes.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-xl text-muted-foreground">
                  No hay paquetes de terapia asignados a este código.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
