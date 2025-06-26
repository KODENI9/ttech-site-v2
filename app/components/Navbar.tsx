"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/server"; // ajuste le chemin si besoin

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="bg-base-100 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="navbar px-4 max-w-7xl mx-auto">
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold text-primary">
            TTECH™
          </Link>
        </div>

        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {isOpen && (
              <ul className="menu dropdown-content z-[999] mt-3 p-2 shadow bg-base-100 rounded-box w-52 right-0">
                <li><Link href="/">🏠 Accueil</Link></li>
                <li><Link href="/challenge">🧠 Challenge</Link></li>
                {user ? (
                  <>
                    <li><button onClick={handleLogout}>🚪 Déconnexion</button></li>
                  </>
                ) : (
                  <>
                    <li><Link href="/login">🔐 Connexion</Link></li>
                    <li><Link href="/register">📝 S’inscrire</Link></li>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
