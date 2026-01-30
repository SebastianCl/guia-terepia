# Guía Terapia - POC

Plataforma web para terapeutas y fisioterapeutas orientada a zonas rurales de Europa, que permite consultar y asignar guías de terapias en formato de paquetes de videos.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Inicializar base de datos con datos de prueba
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 📋 Credenciales de Prueba

### Acceso Profesional (Login)
| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@guiaterapia.com | admin123 |
| Jefe de Clínica | maria@fisiomontes.es | admin123 |
| Terapeuta | carlos@fisiomontes.es | admin123 |

### Códigos de Acceso Efímero
| Código | Paquete |
|--------|---------|
| ABC123 | Ejercicios básicos para lumbalgia |
| XYZ789 | Rehabilitación de rodilla |

## 🏗️ Arquitectura

### Stack Tecnológico
- **Frontend**: Next.js 16 (App Router)
- **UI**: Tailwind CSS + Componentes personalizados
- **Base de Datos**: SQLite (POC) → PostgreSQL (producción)
- **ORM**: Prisma
- **Autenticación**: NextAuth.js v5

### Estructura del Proyecto
```
src/
├── app/                    # Rutas y páginas (App Router)
│   ├── page.tsx           # Landing page
│   ├── acceso/            # Acceso con código efímero
│   ├── terapias/          # Catálogo público
│   ├── ver/               # Reproductor de videos
│   ├── admin/             # Panel de administración
│   │   ├── clinicas/      # CRUD clínicas
│   │   ├── paquetes/      # CRUD paquetes
│   │   └── codigos/       # Gestión códigos
│   ├── api/               # API Routes
│   └── login/             # Autenticación
├── components/            # Componentes reutilizables
│   ├── ui/               # Button, Card, Input, Badge
│   ├── layout/           # Header, Footer
│   └── video/            # YouTubePlayer, VideoCard
├── lib/                  # Utilidades y configuración
│   ├── auth.ts          # Configuración NextAuth
│   ├── prisma.ts        # Cliente Prisma
│   └── utils.ts         # Funciones de utilidad
└── types/               # Tipos TypeScript
```

## 👥 Roles y Permisos

| Rol | Descripción |
|-----|-------------|
| **Administrativo** | Acceso completo, gestión de todas las clínicas y usuarios |
| **Jefe de Clínica** | Gestión de su clínica, terapeutas y paquetes propios |
| **Usuario Efímero** | Acceso temporal con código, solo visualización |

## 🎯 Flujos Principales

### Usuario Efímero (Paciente)
1. Recibe código del terapeuta (ej: ABC123)
2. Accede a `/acceso` e introduce el código
3. Ve los paquetes de videos asignados
4. Reproduce los videos de ejercicios

### Terapeuta/Admin
1. Login en `/login`
2. Accede al dashboard `/admin`
3. Crea/gestiona paquetes de videos
4. Genera códigos de acceso para pacientes

## 📦 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run db:seed      # Poblar BD con datos de prueba
npm run db:studio    # Abrir Prisma Studio
npm run db:reset     # Resetear BD y repoblar
```

## 🎨 Consideraciones UX

Diseñado para usuarios mayores de 40 años:
- Tipografía base de 18px
- Botones grandes (mínimo 48x48px)
- Alto contraste (WCAG AA)
- Navegación lineal y simple
- Iconos siempre con texto

## 🔜 Próximos Pasos (Producto Final)

1. **Hosting de videos propio** - Migrar de YouTube
2. **Multi-idioma** - ES, EN, FR, DE
3. **PWA** - Instalable en móviles
4. **PostgreSQL** - Migrar para producción
