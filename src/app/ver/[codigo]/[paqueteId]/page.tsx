import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { VideoPlayerClient } from './video-player-client'

interface PageProps {
  params: Promise<{ codigo: string; paqueteId: string }>
}

async function getPaqueteData(codigo: string, paqueteId: string) {
  // Verificar código válido
  const codigoAcceso = await prisma.codigoAcceso.findUnique({
    where: { codigo: codigo.toUpperCase() },
    include: {
      paquetesAsignados: {
        where: { paqueteTerapiaId: paqueteId },
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
  if (codigoAcceso.paquetesAsignados.length === 0) return null

  return codigoAcceso.paquetesAsignados[0].paqueteTerapia
}

export default async function VideoPlayerPage({ params }: PageProps) {
  const { codigo, paqueteId } = await params
  const paquete = await getPaqueteData(codigo, paqueteId)

  if (!paquete || paquete.videos.length === 0) {
    notFound()
  }

  return <VideoPlayerClient codigo={codigo} paquete={paquete} />
}
