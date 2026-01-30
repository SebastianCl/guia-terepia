import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Plus, Building2, MapPin, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function ClinicasPage() {
  const session = await auth()
  
  // Solo admin puede ver todas las clínicas
  if (session?.user.rol !== 'ADMINISTRATIVO') {
    redirect('/admin')
  }

  const clinicas = await prisma.clinica.findMany({
    include: {
      _count: {
        select: { usuarios: true, paquetesTerapia: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="w-8 h-8" />
            Gestión de Clínicas
          </h1>
          <p className="text-xl text-muted-foreground">
            Administra las clínicas registradas en la plataforma
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/admin/clinicas/nueva">
            <Plus className="w-5 h-5" />
            Nueva Clínica
          </Link>
        </Button>
      </div>

      {/* Lista de clínicas */}
      <div className="grid gap-4">
        {clinicas.map((clinica) => (
          <Link key={clinica.id} href={`/admin/clinicas/${clinica.id}`}>
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{clinica.nombre}</CardTitle>
                    <CardDescription className="text-base">
                      {clinica.descripcion || 'Sin descripción'}
                    </CardDescription>
                  </div>
                  <Badge variant={clinica.activa ? 'success' : 'secondary'}>
                    {clinica.activa ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-6 text-muted-foreground">
                  {clinica.direccion && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{clinica.direccion}</span>
                    </div>
                  )}
                  {clinica.telefono && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{clinica.telefono}</span>
                    </div>
                  )}
                  {clinica.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{clinica.email}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-4 mt-4 pt-4 border-t">
                  <span className="text-sm">
                    <strong>{clinica._count.usuarios}</strong> terapeutas
                  </span>
                  <span className="text-sm">
                    <strong>{clinica._count.paquetesTerapia}</strong> paquetes
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {clinicas.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground mb-4">
                No hay clínicas registradas
              </p>
              <Button asChild>
                <Link href="/admin/clinicas/nueva">
                  <Plus className="w-5 h-5" />
                  Crear primera clínica
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
