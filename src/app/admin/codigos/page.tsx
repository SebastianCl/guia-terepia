import Link from 'next/link'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Plus, KeyRound, Calendar, Hash, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function CodigosPage() {
  const session = await auth()
  const user = session!.user
  const isAdmin = user.rol === 'ADMINISTRATIVO'

  const codigos = await prisma.codigoAcceso.findMany({
    include: {
      paquetesAsignados: {
        include: {
          paqueteTerapia: {
            select: { nombre: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const now = new Date()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <KeyRound className="w-8 h-8" />
            Códigos de Acceso
          </h1>
          <p className="text-xl text-muted-foreground">
            Gestiona los códigos para usuarios efímeros
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/admin/codigos/nuevo">
            <Plus className="w-5 h-5" />
            Nuevo Código
          </Link>
        </Button>
      </div>

      {/* Lista de códigos */}
      <div className="grid gap-4">
        {codigos.map((codigo) => {
          const isExpired = codigo.fechaExpiracion < now
          const isMaxUsed = codigo.usosActuales >= codigo.usosMaximos
          const isInactive = !codigo.activo || isExpired || isMaxUsed

          return (
            <Card 
              key={codigo.id} 
              className={`${isInactive ? 'opacity-60' : ''}`}
            >
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-mono tracking-widest">
                      {codigo.codigo}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {codigo.descripcion || 'Sin descripción'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {!codigo.activo && (
                      <Badge variant="secondary">Desactivado</Badge>
                    )}
                    {isExpired && (
                      <Badge variant="destructive">Expirado</Badge>
                    )}
                    {isMaxUsed && (
                      <Badge variant="warning">Límite alcanzado</Badge>
                    )}
                    {codigo.activo && !isExpired && !isMaxUsed && (
                      <Badge variant="success">Activo</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-6 text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Expira: {codigo.fechaExpiracion.toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    <span>
                      Usos: {codigo.usosActuales} / {codigo.usosMaximos}
                    </span>
                  </div>
                </div>

                {/* Paquetes asignados */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Paquetes asignados:</p>
                  <div className="flex flex-wrap gap-2">
                    {codigo.paquetesAsignados.map((pa) => (
                      <Badge key={pa.id} variant="outline">
                        {pa.paqueteTerapia.nombre}
                      </Badge>
                    ))}
                    {codigo.paquetesAsignados.length === 0 && (
                      <span className="text-sm text-muted-foreground">
                        Sin paquetes asignados
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {codigos.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <KeyRound className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground mb-4">
                No hay códigos de acceso
              </p>
              <Button asChild>
                <Link href="/admin/codigos/nuevo">
                  <Plus className="w-5 h-5" />
                  Crear primer código
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
