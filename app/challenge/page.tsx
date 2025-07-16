"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/server";
import logo from "../assets/logo-black.png";

export default function ChallengePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
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
  }, [router]);

  const handleValidate = () => {
    if (password.trim().toLowerCase() === correctPassword) {
      router.push("/success");
    } else {
      setError("❌ Ce n'est pas la bonne clé. Essaie encore, persévère !");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-base-200 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Partie 1 : Défi */}
        <div className="bg-base-100 p-8 shadow-xl rounded-xl">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            🧠 Casse-tête d’entrée
          </h1>
          <p className="mb-4 text-lg">
            Bienvenue dans le défi de logique pour rejoindre la communauté{" "}
            <strong>TTECH™</strong>.
          </p>
          <ul className="list-disc list-inside space-y-3 text-base">
            <li>
              ✍️ Écris un programme dans le langage de ton choix qui calcule la
              <strong> suite de Fibonacci du 5ᵉ au 15ᵉ terme</strong>.
            </li>
            <li>
              🔗 Concatène les résultats obtenus **sans espace, ni tiret**.
            </li>
            <li>
              🔐 Chiffre ce nombre concaténé en lettres minuscules via une
              méthode de chiffrement **César**.
            </li>
            <li>🔑 Le résultat final est ta **clé secrète**.</li>
          </ul>
          <p className="mt-6 text-base italic text-gray-500">
            Le vrai test n'est pas le code... mais ta persévérance. 💡
          </p>
        </div>

        {/* Partie 2 : Validation */}
        <div className="bg-base-100 p-8 shadow-xl rounded-xl flex flex-col items-center justify-center">
          <Image
            src={logo}
            alt="Logo TTECH™"
            width={100}
            height={100}
            className="object-contain mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">TTECH™ COMMUNITY</h2>
          <p className="mb-6 text-center text-base">
            Entre ta clé secrète pour prouver ta valeur.
          </p>

          <input
            type="text"
            placeholder="🔐 Ta clé ici..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full max-w-xs mb-4"
          />

          <button
            onClick={handleValidate}
            className="btn btn-primary w-full max-w-xs"
          >
            Valider
          </button>

          {error && (
            <p className="text-error mt-4 text-sm text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
