import bcrypt from "bcryptjs"
import prisma from "../src/lib/prisma"

async function main() {
    console.log("🌱 Iniciando seed de la base de datos...")

    // Limpiar datos existentes
    await prisma.codigoAccesoPaquete.deleteMany()
    await prisma.codigoAcceso.deleteMany()
    await prisma.video.deleteMany()
    await prisma.paqueteTerapia.deleteMany()
    await prisma.lesion.deleteMany()
    await prisma.session.deleteMany()
    await prisma.account.deleteMany()
    await prisma.user.deleteMany()
    await prisma.clinica.deleteMany()

    console.log("🗑️  Datos anteriores eliminados")

    // Crear clínicas
    const clinica1 = await prisma.clinica.create({
        data: {
            nombre: "Centro de Fisioterapia Rural Montes",
            direccion: "Calle Mayor 15, Villanueva del Campo",
            telefono: "+34 987 654 321",
            email: "contacto@fisiomontes.es",
            descripcion: "Centro especializado en rehabilitación y fisioterapia para comunidades rurales",
        }
    })

    const clinica2 = await prisma.clinica.create({
        data: {
            nombre: "Clínica de Rehabilitación Valle Verde",
            direccion: "Plaza del Ayuntamiento 3, Valdepeñas",
            telefono: "+34 926 123 456",
            email: "info@valleverde.es",
            descripcion: "Atención fisioterapéutica integral para toda la familia",
        }
    })

    console.log("🏥 Clínicas creadas")

    // Crear usuarios
    const passwordHash = await bcrypt.hash("admin123", 10)

    const admin = await prisma.user.create({
        data: {
            name: "Administrador Principal",
            email: "admin@guiaterapia.com",
            password: passwordHash,
            rol: "ADMINISTRATIVO",
        }
    })

    const jefeClinica1 = await prisma.user.create({
        data: {
            name: "María García López",
            email: "maria@fisiomontes.es",
            password: passwordHash,
            rol: "JEFE_CLINICA",
            clinicaId: clinica1.id,
        }
    })

    const terapeuta1 = await prisma.user.create({
        data: {
            name: "Carlos Rodríguez",
            email: "carlos@fisiomontes.es",
            password: passwordHash,
            rol: "TERAPEUTA",
            clinicaId: clinica1.id,
        }
    })

    console.log("👥 Usuarios creados")

    // Crear lesiones/condiciones
    const lesiones = await Promise.all([
        prisma.lesion.create({
            data: {
                nombre: "Dolor de espalda baja",
                descripcion: "Lumbalgia y molestias en la zona lumbar",
                categoria: "Espalda"
            }
        }),
        prisma.lesion.create({
            data: {
                nombre: "Lesión de rodilla",
                descripcion: "Recuperación post-operatoria o dolor de rodilla",
                categoria: "Rodilla"
            }
        }),
        prisma.lesion.create({
            data: {
                nombre: "Dolor de hombro",
                descripcion: "Tendinitis, bursitis o lesiones del manguito rotador",
                categoria: "Hombro"
            }
        }),
        prisma.lesion.create({
            data: {
                nombre: "Dolor cervical",
                descripcion: "Cervicalgia y tensión en cuello",
                categoria: "Cuello"
            }
        }),
        prisma.lesion.create({
            data: {
                nombre: "Movilidad reducida general",
                descripcion: "Ejercicios para mejorar la movilidad general del cuerpo",
                categoria: "General"
            }
        })
    ])

    console.log("🩹 Lesiones creadas")

    // Crear paquetes de terapia con videos
    const paquete1 = await prisma.paqueteTerapia.create({
        data: {
            nombre: "Ejercicios básicos para lumbalgia",
            descripcion: "Serie de ejercicios suaves para aliviar el dolor de espalda baja. Ideal para principiantes.",
            instrucciones: "Realice estos ejercicios 2 veces al día, por la mañana y por la tarde. Mantenga cada posición durante 30 segundos.",
            duracionEstimada: "2 semanas",
            nivel: "Básico",
            destacado: true,
            lesionId: lesiones[0].id,
            clinicaId: clinica1.id,
            videos: {
                create: [
                    {
                        titulo: "Estiramiento de gato-camello",
                        descripcion: "Ejercicio básico para movilizar la columna vertebral",
                        urlYoutube: "https://www.youtube.com/watch?v=kqnua4rHVVA",
                        duracion: 180,
                        orden: 0
                    },
                    {
                        titulo: "Estiramiento de rodillas al pecho",
                        descripcion: "Alivia la tensión en la zona lumbar",
                        urlYoutube: "https://www.youtube.com/watch?v=Xcx4WXwfv6E",
                        duracion: 120,
                        orden: 1
                    },
                    {
                        titulo: "Puente de glúteos",
                        descripcion: "Fortalece la zona lumbar y los glúteos",
                        urlYoutube: "https://www.youtube.com/watch?v=OUgsJ8-Vi0E",
                        duracion: 240,
                        orden: 2
                    }
                ]
            }
        }
    })

    const paquete2 = await prisma.paqueteTerapia.create({
        data: {
            nombre: "Rehabilitación de rodilla - Fase inicial",
            descripcion: "Ejercicios de baja intensidad para las primeras semanas de recuperación de rodilla.",
            instrucciones: "Realice estos ejercicios una vez al día. Si siente dolor intenso, detenga el ejercicio.",
            duracionEstimada: "3 semanas",
            nivel: "Básico",
            destacado: true,
            lesionId: lesiones[1].id,
            clinicaId: clinica1.id,
            videos: {
                create: [
                    {
                        titulo: "Flexión y extensión de rodilla sentado",
                        descripcion: "Ejercicio suave para recuperar el rango de movimiento",
                        urlYoutube: "https://www.youtube.com/watch?v=bI6k8IFiwV4",
                        duracion: 150,
                        orden: 0
                    },
                    {
                        titulo: "Elevación de pierna recta",
                        descripcion: "Fortalecimiento del cuádriceps sin cargar la rodilla",
                        urlYoutube: "https://www.youtube.com/watch?v=9wOvNmo5GsE",
                        duracion: 180,
                        orden: 1
                    }
                ]
            }
        }
    })

    const paquete3 = await prisma.paqueteTerapia.create({
        data: {
            nombre: "Ejercicios para dolor de hombro",
            descripcion: "Rutina completa para aliviar y prevenir el dolor de hombro.",
            instrucciones: "Realice estos ejercicios con movimientos lentos y controlados. Evite el dolor agudo.",
            duracionEstimada: "4 semanas",
            nivel: "Intermedio",
            destacado: false,
            lesionId: lesiones[2].id,
            clinicaId: clinica2.id,
            videos: {
                create: [
                    {
                        titulo: "Péndulo de Codman",
                        descripcion: "Ejercicio de movilidad pasiva para el hombro",
                        urlYoutube: "https://www.youtube.com/watch?v=KQbXdHSqoFY",
                        duracion: 120,
                        orden: 0
                    },
                    {
                        titulo: "Rotación externa con banda elástica",
                        descripcion: "Fortalecimiento del manguito rotador",
                        urlYoutube: "https://www.youtube.com/watch?v=3zP7_f8MhGY",
                        duracion: 200,
                        orden: 1
                    }
                ]
            }
        }
    })

    console.log("📦 Paquetes de terapia creados")

    // Crear códigos de acceso de ejemplo
    const codigo1 = await prisma.codigoAcceso.create({
        data: {
            codigo: "ABC123",
            descripcion: "Paciente: Sr. González - Lumbalgia",
            fechaExpiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
            usosMaximos: 50,
            paquetesAsignados: {
                create: [
                    { paqueteTerapiaId: paquete1.id }
                ]
            }
        }
    })

    const codigo2 = await prisma.codigoAcceso.create({
        data: {
            codigo: "XYZ789",
            descripcion: "Paciente: Sra. Martínez - Rodilla",
            fechaExpiracion: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 días
            usosMaximos: 100,
            paquetesAsignados: {
                create: [
                    { paqueteTerapiaId: paquete2.id }
                ]
            }
        }
    })

    console.log("🔑 Códigos de acceso creados")

    console.log("\n✅ Seed completado exitosamente!")
    console.log("\n📋 Credenciales de prueba:")
    console.log("   Admin: admin@guiaterapia.com / admin123")
    console.log("   Jefe Clínica: maria@fisiomontes.es / admin123")
    console.log("   Terapeuta: carlos@fisiomontes.es / admin123")
    console.log("\n🔑 Códigos de acceso efímero:")
    console.log("   ABC123 - Paquete de lumbalgia")
    console.log("   XYZ789 - Paquete de rodilla")
}

main()
    .catch((e) => {
        console.error("❌ Error en seed:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
