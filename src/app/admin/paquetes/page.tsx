import Link from 'next/link'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Plus, Package, Video, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function PaquetesPage() {
  const session = await auth()
  const user = session!.user
  const isAdmin = user.rol === 'ADMINISTRATIVO'

  const paquetes = await prisma.paqueteTerapia.findMany({
    where: isAdmin ? {} : { clinicaId: user.clinicaId },
    include: {
      lesion: true,
      clinica: true,
      _count: { select: { videos: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="w-8 h-8" />
            Paquetes de Terapia
          </h1>
          <p className="text-xl text-muted-foreground">
            Gestiona los paquetes de videos terapéuticos
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/admin/paquetes/nuevo">
            <Plus className="w-5 h-5" />
            Nuevo Paquete
          </Link>
        </Button>
      </div>

      {/* Lista de paquetes */}
      <div className="grid lg:grid-cols-2 gap-4">
        {paquetes.map((paquete) => (
          <Link key={paquete.id} href={`/admin/paquetes/${paquete.id}`}>
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{paquete.nombre}</CardTitle>
                    <CardDescription className="text-base line-clamp-2">
                      {paquete.descripcion || 'Sin descripción'}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant={paquete.activo ? 'success' : 'secondary'}>
                      {paquete.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                    {paquete.destacado && (
                      <Badge variant="default">Destacado</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {paquete.lesion && (
                    <Badge variant="outline">{paquete.lesion.nombre}</Badge>
                  )}
                  {paquete.nivel && (
                    <Badge variant="outline">{paquete.nivel}</Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span>{paquete._count.videos} videos</span>
                  </div>
                  {paquete.duracionEstimada && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{paquete.duracionEstimada}</span>
                    </div>
                  )}
                </div>
                {isAdmin && paquete.clinica && (
                  <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">
                    Clínica: {paquete.clinica.nombre}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}

        {paquetes.length === 0 && (
          <Card className="text-center py-12 lg:col-span-2">
            <CardContent>
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground mb-4">
                No hay paquetes de terapia
              </p>
              <Button asChild>
                <Link href="/admin/paquetes/nuevo">
                  <Plus className="w-5 h-5" />
                  Crear primer paquete
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
