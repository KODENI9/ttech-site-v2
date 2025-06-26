"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/server";
import logo  from "../assets/logo-black.png"
export default function ChallengePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const correctPassword = "fjpbfdbfhjjprbhhdfffnn"; // Clé secrète finale

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleValidate = () => {
    if (password.trim().toLowerCase() === correctPassword) {
      router.push("/success"); // redirige vers la vraie page privée
    } else {
      setError("❌ Ce n'est pas la bonne clé. Essaie encore, persévère !");
    }
  };

  return (
    <div className="min-h-screen p-4 md:flex md:items-center md:justify-center bg-base-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full bg-base-100 shadow-xl rounded-lg p-6 md:p-10">
        {/* Partie texte */}
        <div>
          <h1 className="text-3xl font-bold mb-4">🧠 Casse-tête d’entrée</h1>
          <p className="mb-2">Bienvenue dans le défi de logique.</p>
          <p className="mb-2">
            🔢 Écrivez un programme dans le langage de votre choix qui calcule et affiche
            les termes de la suite de Fibonacci du <strong>5ᵉ au 15ᵉ terme</strong>.
            Ensuite, concaténez tous ces nombres sans espace, ni tiret.
          </p>
          <p className="mb-2">
            🔐 Chaque nombre est un alphabet minuscule. César détient la clé de chiffrement.
          </p>
          <p className="mb-4">
            🎯 Ce mot final est la clé secrète. Si tu trouves la bonne clé, tu auras
            accès à la grande communauté TTECH™.
          </p>
        </div>

        {/* Partie validation */}
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <img
            src={logo.src}
            alt="Logo TTECH™"
            className="w-24 h-24 rounded-full object-contain"
          />
          <h2 className="text-2xl font-bold">TTECH™ COMMUNITY</h2>
          <p>Entrez la clé du casse-tête</p>
          <input
            type="text"
            placeholder="Entre ta clé ici..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
          <button onClick={handleValidate} className="btn btn-primary w-full max-w-xs">
            Valider
          </button>
          {error && <p className="text-error text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}
  