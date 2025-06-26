// components/Hero.tsx
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero min-h-[80vh] bg-base-200 rounded-xl">
      <div className="hero-content text-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold">Bienvenue chez <span className="text-primary">TTECH</span> 🚀</h1>
          <p className="py-6 text-lg">
            Une communauté d'ingénieurs et développeurs passionnés prêts à changer le monde avec la technologie.
            Rejoins-nous et prouve ta valeur avec notre défi !
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/challenge" className="btn btn-primary">
              Relever le challenge
            </Link>
            <Link href="/login" className="btn btn-outline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
