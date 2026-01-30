import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Usamos JWT para sesiones (no necesitamos adapter para Credentials)
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await prisma.user.findUnique({
          where: { email },
          include: { clinica: true }
        })

        if (!user || !user.password || !user.activo) {
          return null
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          rol: user.rol,
          clinicaId: user.clinicaId,
          clinicaNombre: user.clinica?.nombre
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.rol = (user as { rol: string }).rol
        token.clinicaId = (user as { clinicaId: string | null }).clinicaId
        token.clinicaNombre = (user as { clinicaNombre: string | undefined }).clinicaNombre
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.rol = token.rol as string
        session.user.clinicaId = token.clinicaId as string | null
        session.user.clinicaNombre = token.clinicaNombre as string | undefined
      }
      return session
    }
  }
})
