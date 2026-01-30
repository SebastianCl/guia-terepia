import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { codigo } = await request.json()

    if (!codigo || codigo.length < 3) {
      return NextResponse.json(
        { valid: false, message: 'Código inválido' },
        { status: 400 }
      )
    }

    const codigoAcceso = await prisma.codigoAcceso.findUnique({
      where: { codigo: codigo.toUpperCase() },
      include: {
        paquetesAsignados: {
          include: {
            paqueteTerapia: {
              include: {
                lesion: true,
                _count: { select: { videos: true } }
              }
            }
          }
        }
      }
    })

    if (!codigoAcceso) {
      return NextResponse.json(
        { valid: false, message: 'Código no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si está activo
    if (!codigoAcceso.activo) {
      return NextResponse.json(
        { valid: false, message: 'Este código ya no está activo' },
        { status: 403 }
      )
    }

    // Verificar fecha de expiración
    if (new Date() > codigoAcceso.fechaExpiracion) {
      return NextResponse.json(
        { valid: false, message: 'Este código ha expirado' },
        { status: 403 }
      )
    }

    // Verificar usos máximos
    if (codigoAcceso.usosActuales >= codigoAcceso.usosMaximos) {
      return NextResponse.json(
        { valid: false, message: 'Este código ha alcanzado el límite de usos' },
        { status: 403 }
      )
    }

    // Incrementar contador de usos
    await prisma.codigoAcceso.update({
      where: { id: codigoAcceso.id },
      data: { usosActuales: { increment: 1 } }
    })

    return NextResponse.json({
      valid: true,
      paquetes: codigoAcceso.paquetesAsignados.map(pa => ({
        id: pa.paqueteTerapia.id,
        nombre: pa.paqueteTerapia.nombre,
        descripcion: pa.paqueteTerapia.descripcion,
        lesion: pa.paqueteTerapia.lesion?.nombre,
        totalVideos: pa.paqueteTerapia._count.videos
      }))
    })
  } catch (error) {
    console.error('Error validando código:', error)
    return NextResponse.json(
      { valid: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
