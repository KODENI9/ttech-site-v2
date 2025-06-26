"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function SuccessPage() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    updateSize(); // initial
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-base-200 px-4">
      {/* 🎊 Confettis */}
      <Confetti width={windowSize.width} height={windowSize.height} />

      <div className="card w-full max-w-xl shadow-xl bg-base-100">
        <div className="card-body text-center space-y-4">
          <h1 className="text-3xl font-bold text-green-600">🎉 Félicitations !</h1>
          <p className="text-lg">
            Ne partagez pas la clé : Laissez les meilleurs la trouver seul !
          </p>
          <p className="text-lg">
            <strong>TTECH™</strong> n’est pas juste une communauté, c’est un foyer d’esprits audacieux qui façonnent l’avenir. Ne doute jamais de ton pouvoir de creer l'avenir.
            
          </p>

          <a
            href="https://chat.whatsapp.com/LcTzYGYTMn8K2LJsm7q93V"
            target="_blank"
            className="btn btn-success mt-4"
          >
            💬 Rejoindre le groupe WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
