"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../lib/auth";
import logo from "../assets/logo-black.png";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
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
      await registerUser(
        formData.email,
        formData.password,
        formData.first_name,
        formData.last_name,
        formData.phone
      );
      router.push("/challenge");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur inconnue.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Image src={logo} alt="Logo TTECH™" width={80} height={80} className="mb-2" />
          <h1 className="text-2xl font-bold text-center">TTECH™ COMMUNITY</h1>
        </div>

        <div className="card shadow-xl bg-base-100">
          <div className="card-body">
            <h2 className="text-xl font-semibold text-center mb-2">📝 Créer un compte</h2>
            {error && <p className="text-error text-sm text-center mb-3">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Prénom</span></label>
                <input
                  name="first_name"
                  placeholder="ex: John"
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Nom</span></label>
                <input
                  name="last_name"
                  placeholder="ex: Doe"
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Email</span></label>
                <input
                  name="email"
                  type="email"
                  placeholder="ex: john@example.com"
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Téléphone (optionnel)</span></label>
                <input
                  name="phone"
                  placeholder="+228 90 00 00 00"
                  onChange={handleChange}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Mot de passe</span></label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary w-full">
                  S’inscrire
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
