import Link from "next/link"
import { Activity, PlayCircle, KeyRound, UserCog, ArrowRight, Heart, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Activity className="w-5 h-5" />
                <span className="text-lg font-medium">Plataforma de Rehabilitación</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Guías de Terapia en Video para tu Recuperación
              </h1>
              
              <p className="text-xl text-muted-foreground mb-10">
                Accede a paquetes de videos terapéuticos diseñados por profesionales 
                para ayudarte en tu proceso de rehabilitación.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/terapias">
                    <PlayCircle className="w-6 h-6" />
                    Ver Terapias Disponibles
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/acceso">
                    <KeyRound className="w-6 h-6" />
                    Tengo un Código de Acceso
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">¿Cómo funciona?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Una plataforma sencilla diseñada para facilitar tu recuperación
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>1. Obtén tu Código</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">
                    Tu terapeuta te proporcionará un código de acceso 
                    personalizado para tus ejercicios.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <PlayCircle className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>2. Mira los Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">
                    Accede a los videos de ejercicios asignados 
                    y síguelos a tu propio ritmo.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>3. Mejora tu Salud</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">
                    Practica los ejercicios regularmente 
                    para acelerar tu recuperación.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Para Pacientes */}
              <Card className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-8 h-8 text-primary" />
                    <CardTitle>Para Pacientes</CardTitle>
                  </div>
                  <CardDescription className="text-lg">
                    Accede a tus ejercicios de rehabilitación de forma sencilla
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-lg">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-5 h-5 text-primary" />
                      Sin necesidad de registro
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-5 h-5 text-primary" />
                      Videos fáciles de seguir
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-5 h-5 text-primary" />
                      Acceso desde cualquier dispositivo
                    </li>
                  </ul>
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/acceso">
                      Introducir Código
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Para Profesionales */}
              <Card className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <UserCog className="w-8 h-8 text-primary" />
                    <CardTitle>Para Profesionales</CardTitle>
                  </div>
                  <CardDescription className="text-lg">
                    Gestiona terapias y asigna ejercicios a tus pacientes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-lg">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-5 h-5 text-primary" />
                      Gestión de paquetes de videos
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-5 h-5 text-primary" />
                      Códigos de acceso por paciente
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-5 h-5 text-primary" />
                      Panel de administración
                    </li>
                  </ul>
                  <Button className="w-full" size="lg" variant="outline" asChild>
                    <Link href="/login">
                      Acceso Profesional
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold text-lg">Privacidad Garantizada</p>
                  <p className="text-muted-foreground">No almacenamos datos personales</p>
                </div>
              </div>
              <div className="hidden md:block w-px h-12 bg-border" />
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold text-lg">Contenido Profesional</p>
                  <p className="text-muted-foreground">Videos creados por terapeutas</p>
                </div>
              </div>
              <div className="hidden md:block w-px h-12 bg-border" />
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold text-lg">Fácil de Usar</p>
                  <p className="text-muted-foreground">Diseñado para todos</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
