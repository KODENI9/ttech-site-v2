"use client";

import { useState } from "react";
import { HistoryModel } from "../types/HistoryModel";
import { addHistory } from "../lib/auth";

export default function AddHistoryModal({ onAdded }: { onAdded: () => void }) {
    const [form, setForm] = useState<HistoryModel>({
        year: "",
        title: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        setLoading(true);
        await addHistory(form);
        setLoading(false);
        setForm({ year: "", title: "", description: "" });
        onAdded();
        (document.getElementById("add_history_modal") as HTMLDialogElement).close();
    };

    return (
        <dialog id="add_history_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Ajouter une réussite</h3>
                <form
                    className="space-y-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAdd();
                    }}
                >
                    <input
                        type="text"
                        placeholder="Année (ex: 2025)"
                        className="input input-bordered w-full"
                        required
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Titre de la réussite"
                        className="input input-bordered w-full"
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                    <textarea
                        placeholder="Description"
                        className="textarea textarea-bordered w-full"
                        required
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                                (document.getElementById("add_history_modal") as HTMLDialogElement).close()
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
