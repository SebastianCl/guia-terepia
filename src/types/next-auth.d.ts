import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      rol: string
      clinicaId: string | null
      clinicaNombre?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    rol: string
    clinicaId: string | null
    clinicaNombre?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    rol: string
    clinicaId: string | null
    clinicaNombre?: string
  }
}
