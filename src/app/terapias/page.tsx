import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Search, Package, Play, Clock, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface PageProps {
  searchParams: Promise<{ lesion?: string; buscar?: string }>
}

export default async function TerapiasPage({ searchParams }: PageProps) {
  const params = await searchParams
  const lesionFilter = params.lesion
  const searchQuery = params.buscar

  // Obtener lesiones para filtros
  const lesiones = await prisma.lesion.findMany({
    orderBy: { nombre: 'asc' }
  })

  // Obtener paquetes públicos
  const paquetes = await prisma.paqueteTerapia.findMany({
    where: {
      activo: true,
      ...(lesionFilter && { lesionId: lesionFilter }),
      ...(searchQuery && {
        OR: [
          { nombre: { contains: searchQuery } },
          { descripcion: { contains: searchQuery } }
        ]
      })
    },
    include: {
      lesion: true,
      _count: { select: { videos: true } }
    },
    orderBy: [
      { destacado: 'desc' },
      { createdAt: 'desc' }
    ]
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 bg-muted/30">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Catálogo de Terapias</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explora los paquetes de ejercicios disponibles según tu condición
            </p>
          </div>

          {/* Filtros */}
          <div className="mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Filter className="w-5 h-5" />
                    <span className="font-medium">Filtrar por:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={!lesionFilter ? 'default' : 'outline'}
                      size="sm"
                      asChild
                    >
                      <Link href="/terapias">Todas</Link>
                    </Button>
                    {lesiones.map((lesion) => (
                      <Button
                        key={lesion.id}
                        variant={lesionFilter === lesion.id ? 'default' : 'outline'}
                        size="sm"
                        asChild
                      >
                        <Link href={`/terapias?lesion=${lesion.id}`}>
                          {lesion.nombre}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de paquetes */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paquetes.map((paquete) => (
              <Card key={paquete.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {paquete.destacado && (
                        <Badge className="mb-2">Destacado</Badge>
                      )}
                      <CardTitle className="text-xl">{paquete.nombre}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-base line-clamp-2">
                    {paquete.descripcion || 'Paquete de ejercicios terapéuticos'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {paquete.lesion && (
                      <Badge variant="secondary">{paquete.lesion.nombre}</Badge>
                    )}
                    {paquete.nivel && (
                      <Badge variant="outline">{paquete.nivel}</Badge>
                    )}
                  </div>
                  <div className="flex gap-4 text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      <span>{paquete._count.videos} videos</span>
                    </div>
                    {paquete.duracionEstimada && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{paquete.duracionEstimada}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-auto">
                    <p className="text-sm text-muted-foreground mb-3">
                      Para acceder a estos videos, solicita un código a tu terapeuta.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/acceso">
                        Tengo un código de acceso
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {paquetes.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground mb-4">
                  No se encontraron terapias con los filtros seleccionados
                </p>
                <Button asChild>
                  <Link href="/terapias">Ver todas las terapias</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="py-8">
                <h2 className="text-2xl font-bold mb-4">
                  ¿Ya tienes un código de acceso?
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Introduce tu código para ver los videos de ejercicios 
                  asignados por tu terapeuta.
                </p>
                <Button size="lg" asChild>
                  <Link href="/acceso">
                    Acceder con mi código
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
