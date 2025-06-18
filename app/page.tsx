import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-slate-50 to-sky-100 text-center">
      <div className="mb-12">
        <img
          src="/logo.png"
          alt="Logo Le Merle Assistance Médicale"
          className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-6 rounded-full shadow-lg"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Bienvenue chez Le Merle Assistance Médicale
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          Votre partenaire de confiance pour des services médicaux et une assistance à domicile de qualité. Nous sommes
          là pour vous aider.
        </p>
      </div>

      <div className="space-y-4 md:space-y-0 md:space-x-4">
        <Button asChild size="lg" className="bg-sky-600 hover:bg-sky-700 text-white">
          <Link href="#services">Découvrir nos services</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="border-sky-600 text-sky-600 hover:bg-sky-50">
          <Link href="#contact">Nous contacter</Link>
        </Button>
      </div>

      {/* Placeholder sections for content */}
      <div id="services" className="mt-20 p-8 w-full max-w-4xl bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-slate-700 mb-6">Nos Services</h2>
        <p className="text-slate-600">
          Informations sur les services offerts par Le Merle Assistance Médicale... (Vous pourrez ajouter plus de
          détails ici)
        </p>
      </div>

      <div id="contact" className="mt-12 p-8 w-full max-w-4xl bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-slate-700 mb-6">Contactez-Nous</h2>
        <p className="text-slate-600">
          Coordonnées et formulaire de contact... (Vous pourrez ajouter plus de détails ici)
        </p>
      </div>

      <footer className="mt-20 text-slate-500 text-sm">
        © {new Date().getFullYear()} Le Merle Assistance Médicale. Tous droits réservés.
      </footer>
    </main>
  )
}
