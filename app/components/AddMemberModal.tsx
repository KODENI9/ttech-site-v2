"use client";

import { useState } from "react";
import { MemberModel } from "../types/MemberModel";
import { addMember } from "../lib/auth";
import Loader from "./Loader";

export default function AddMemberModal({ onAdded }: { onAdded: () => void }) {
    const [form, setForm] = useState<MemberModel>({
        name: "",
        role: "",
        description: "",
        email: "",
        github: "",
    });

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

const handleAdd = async () => {
    setLoading(true);

    let photoBase64 = "";

    if (file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
            photoBase64 = reader.result?.toString() || "";

            await addMember({ ...form, image: photoBase64 }); // on ajoute la photo comme string

            resetForm();
        };
        reader.readAsDataURL(file);
    } else {
        await addMember({ ...form, image: "" }); // pas de photo
        resetForm();
    }
};

const resetForm = () => {
    setLoading(false);
    setForm({
        name: "",
        role: "",
        description: "",
        email: "",
        github: "",
    });
    setFile(null);
    onAdded();
    (document.getElementById("add_member_modal") as HTMLDialogElement).close();
};


    return (
        <dialog id="add_member_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Ajouter un membre</h3>
                <form
                    className="space-y-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAdd();
                    }}
                >
                    <input
                        type="text"
                        placeholder="Nom"
                        className="input input-bordered w-full"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Rôle dans la communauté"
                        className="input input-bordered w-full"
                        required
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                    />
                    <textarea
                        placeholder="Description"
                        className="textarea textarea-bordered w-full"
                        required
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="input input-bordered w-full"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        type="url"
                        placeholder="GitHub (facultatif)"
                        className="input input-bordered w-full"
                        value={form.github}
                        onChange={(e) => setForm({ ...form, github: e.target.value })}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="file-input file-input-bordered w-full"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />

                    <div className="modal-action">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <span>Ajout en cours...</span>
                                    <span className="loading loading-dots loading-sm"></span>
                                </div>
                            ) : (
                                "Ajouter"
                            )}
                        </button>

                        <button
                            type="button"
                            className="btn"
                            onClick={() =>
                                (document.getElementById("add_member_modal") as HTMLDialogElement).close()
                            }
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}
