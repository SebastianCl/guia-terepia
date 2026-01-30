import Link from 'next/link'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { 
  Building2, 
  Users, 
  Package, 
  Video, 
  KeyRound,
  ArrowRight,
  Activity,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

async function getStats(userRol: string, clinicaId: string | null) {
  const isAdmin = userRol === 'ADMINISTRATIVO'
  const clinicaFilter = isAdmin ? {} : { clinicaId: clinicaId }

  const [
    totalClinicas,
    totalTerapeutas,
    totalPaquetes,
    totalVideos,
    totalCodigos,
    codigosActivos
  ] = await Promise.all([
    isAdmin ? prisma.clinica.count() : 1,
    prisma.user.count({ 
      where: isAdmin ? {} : { clinicaId: clinicaId } 
    }),
    prisma.paqueteTerapia.count({ 
      where: isAdmin ? {} : clinicaFilter 
    }),
    prisma.video.count({
      where: isAdmin 
        ? {} 
        : { paqueteTerapia: clinicaFilter }
    }),
    prisma.codigoAcceso.count(),
    prisma.codigoAcceso.count({
      where: {
        activo: true,
        fechaExpiracion: { gt: new Date() }
      }
    })
  ])

  return {
    totalClinicas,
    totalTerapeutas,
    totalPaquetes,
    totalVideos,
    totalCodigos,
    codigosActivos
  }
}

async function getRecentPaquetes(userRol: string, clinicaId: string | null) {
  const isAdmin = userRol === 'ADMINISTRATIVO'
  
  return prisma.paqueteTerapia.findMany({
    where: isAdmin ? {} : { clinicaId: clinicaId },
    include: {
      lesion: true,
      _count: { select: { videos: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  })
}

export default async function AdminDashboard() {
  const session = await auth()
  const user = session!.user
  const isAdmin = user.rol === 'ADMINISTRATIVO'

  const stats = await getStats(user.rol, user.clinicaId)
  const recentPaquetes = await getRecentPaquetes(user.rol, user.clinicaId)

  const statCards = [
    { 
      label: 'Clínicas', 
      value: stats.totalClinicas, 
      icon: Building2, 
      href: '/admin/clinicas',
      show: isAdmin 
    },
    { 
      label: 'Terapeutas', 
      value: stats.totalTerapeutas, 
      icon: Users, 
      href: '/admin/terapeutas',
      show: true 
    },
    { 
      label: 'Paquetes', 
      value: stats.totalPaquetes, 
      icon: Package, 
      href: '/admin/paquetes',
      show: true 
    },
    { 
      label: 'Videos', 
      value: stats.totalVideos, 
      icon: Video, 
      href: '/admin/videos',
      show: true 
    },
    { 
      label: 'Códigos Activos', 
      value: stats.codigosActivos, 
      icon: KeyRound, 
      href: '/admin/codigos',
      show: true,
      subtitle: `de ${stats.totalCodigos} totales`
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bienvenido, {user.name}</h1>
          <p className="text-xl text-muted-foreground">
            {isAdmin ? 'Panel de Administración' : `Gestión de ${user.clinicaNombre}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-base px-4 py-2">
            <Activity className="w-4 h-4 mr-2" />
            {user.rol === 'ADMINISTRATIVO' ? 'Administrador' : 'Jefe de Clínica'}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.filter(s => s.show).map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                  {stat.subtitle && (
                    <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Packages */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Paquetes Recientes
                </CardTitle>
                <CardDescription>Últimos paquetes de terapia creados</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/paquetes">
                  Ver todos
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentPaquetes.length > 0 ? (
              <div className="space-y-3">
                {recentPaquetes.map((paquete) => (
                  <Link 
                    key={paquete.id} 
                    href={`/admin/paquetes/${paquete.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-medium">{paquete.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        {paquete.lesion?.nombre} • {paquete._count.videos} videos
                      </p>
                    </div>
                    <Badge variant={paquete.activo ? 'success' : 'secondary'}>
                      {paquete.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No hay paquetes creados aún
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>Tareas comunes de gestión</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" size="lg" asChild>
              <Link href="/admin/paquetes/nuevo">
                <Package className="w-5 h-5" />
                Crear nuevo paquete de terapia
              </Link>
            </Button>
            <Button className="w-full justify-start" size="lg" variant="outline" asChild>
              <Link href="/admin/codigos/nuevo">
                <KeyRound className="w-5 h-5" />
                Generar código de acceso
              </Link>
            </Button>
            <Button className="w-full justify-start" size="lg" variant="outline" asChild>
              <Link href="/admin/videos/nuevo">
                <Video className="w-5 h-5" />
                Añadir nuevo video
              </Link>
            </Button>
            {isAdmin && (
              <Button className="w-full justify-start" size="lg" variant="outline" asChild>
                <Link href="/admin/terapeutas/nuevo">
                  <Users className="w-5 h-5" />
                  Registrar terapeuta
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
