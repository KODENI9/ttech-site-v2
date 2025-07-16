"use client";
import Link from "next/link";
import Image from "next/image"
import logo  from "../assets/logo-black.png"
export default function Footer() {
  return (
    <footer className="bg-base-200 text-base-content mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Logo & intro */}
        <div>
          <Image src={logo} alt="TTECH Logo" width={100} height={40} />
          <p className="text-sm">
            Pionniers de l'innovation technologique africaine depuis 2023.
          </p>
          <div className="flex gap-3 mt-4">
            <Link href="#"><span className="btn btn-sm btn-outline rounded-full">Twitter</span></Link>
            <Link href="#"><span className="btn btn-sm btn-outline rounded-full">LinkedIn</span></Link>
          </div>
        </div>

        {/* Explorer */}
        <div>
          <h3 className="footer-title">🌍 Explorer</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="#">À propos</Link></li>
            <li><Link href="#">Blog Tech</Link></li>
            <li><Link href="#">FAQ</Link></li>
          </ul>
        </div>

        {/* Ressources */}
        <div>
          <h3 className="footer-title">📚 Ressources</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="#">Doc TCHIP-1</Link></li>
            <li><Link href="#">Tutoriels Proteus</Link></li>
            <li><Link href="#">Composants</Link></li>
            <li><Link href="#">Événements</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="footer-title">📞 Contact</h3>
          <ul className="space-y-1 text-sm">
            <li>📧 contact@ttech.tg</li>
            <li>📍 Lomé, Togo</li>
            <li>👥 Rejoindre notre FabLab</li>
          </ul>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="border-t border-base-300 text-center py-4 px-6 text-xs">
        <p className="mb-1">
          © 2025 TTECH™. Tous droits réservés - Conçu avec ❤️ en Afrique.
        </p>
        <div className="space-x-4">
          <Link href="#">Politique de confidentialité</Link>
          <Link href="#">Conditions d'utilisation</Link>
        </div>
      </div>
    </footer>
  );
}
