import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    const { codigo, descripcion, diasExpiracion, usosMaximos, paqueteIds } = await request.json()

    // Validaciones
    if (!codigo || codigo.length < 3) {
      return NextResponse.json({ message: 'El código debe tener al menos 3 caracteres' }, { status: 400 })
    }

    if (!paqueteIds || paqueteIds.length === 0) {
      return NextResponse.json({ message: 'Debes seleccionar al menos un paquete' }, { status: 400 })
    }

    // Verificar código único
    const existingCodigo = await prisma.codigoAcceso.findUnique({
      where: { codigo: codigo.toUpperCase() }
    })

    if (existingCodigo) {
      return NextResponse.json({ message: 'Este código ya existe' }, { status: 400 })
    }

    // Calcular fecha de expiración
    const fechaExpiracion = new Date()
    fechaExpiracion.setDate(fechaExpiracion.getDate() + (diasExpiracion || 30))

    // Crear código con paquetes
    const nuevoCodigo = await prisma.codigoAcceso.create({
      data: {
        codigo: codigo.toUpperCase(),
        descripcion,
        fechaExpiracion,
        usosMaximos: usosMaximos || 50,
        paquetesAsignados: {
          create: paqueteIds.map((id: string) => ({
            paqueteTerapiaId: id
          }))
        }
      }
    })

    return NextResponse.json(nuevoCodigo, { status: 201 })
  } catch (error) {
    console.error('Error creando código:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    const codigos = await prisma.codigoAcceso.findMany({
      include: {
        paquetesAsignados: {
          include: {
            paqueteTerapia: {
              select: { id: true, nombre: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(codigos)
  } catch (error) {
    console.error('Error obteniendo códigos:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
