// app/login/page.tsx
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/server";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const cred = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // 🔽 Vérifie Firestore si challenge réussi
            const userDocRef = doc(db, "users", cred.user.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                if (userData.challengePassed) {
                    router.push("/"); // il a réussi le test
                } else {
                    router.push("/challenge"); // il doit encore réussir
                }
            } else {
                // Si aucun doc Firestore trouvé, on redirige vers le challenge
                router.push("/challenge");
            }
        } catch (err: any) {
            setError("Email ou mot de passe incorrect.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <div className="card w-full max-w-md shadow-xl bg-base-100">
                <div className="card-body">
                    <h2 className="text-2xl font-bold text-center mb-2">🔐 Connexion</h2>
                    {error && <p className="text-error text-sm text-center mb-2">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder="ex: user@ttech.com"
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Mot de passe</span>
                            </label>
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary w-full">
                                Se connecter
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
}
