import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { NuevoCodigoForm } from './nuevo-codigo-form'

export default async function NuevoCodigoPage() {
  const session = await auth()
  const user = session!.user
  const isAdmin = user.rol === 'ADMINISTRATIVO'

  const paquetes = await prisma.paqueteTerapia.findMany({
    where: {
      activo: true,
      ...(isAdmin ? {} : { clinicaId: user.clinicaId })
    },
    select: {
      id: true,
      nombre: true,
      lesion: { select: { nombre: true } }
    },
    orderBy: { nombre: 'asc' }
  })

  return <NuevoCodigoForm paquetes={paquetes} />
}
