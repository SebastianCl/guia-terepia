import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extrae el ID de video de YouTube de una URL
 */
export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

/**
 * Genera la URL de thumbnail de YouTube
 */
export function getYoutubeThumbnail(videoId: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'): string {
  const qualityMap = {
    default: 'default',
    hq: 'hqdefault',
    mq: 'mqdefault',
    sd: 'sddefault',
    maxres: 'maxresdefault'
  }
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}

/**
 * Formatea duración de segundos a formato legible (mm:ss o hh:mm:ss)
 */
export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Genera un código de acceso aleatorio
 */
export function generateAccessCode(length: number = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Sin caracteres confusos (0, O, 1, I)
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * Roles de usuario
 */
export const ROLES = {
  ADMINISTRATIVO: 'ADMINISTRATIVO',
  JEFE_CLINICA: 'JEFE_CLINICA',
  TERAPEUTA: 'TERAPEUTA'
} as const

export type Rol = typeof ROLES[keyof typeof ROLES]

/**
 * Verifica si un rol tiene permisos de administrador
 */
export function isAdmin(rol: string): boolean {
  return rol === ROLES.ADMINISTRATIVO
}

/**
 * Verifica si un rol puede gestionar una clínica
 */
export function canManageClinica(rol: string): boolean {
  return rol === ROLES.ADMINISTRATIVO || rol === ROLES.JEFE_CLINICA
}
