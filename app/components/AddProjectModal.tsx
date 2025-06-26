"use client";

import { useState } from "react";
import { auth } from "../lib/server";
import { addNewProject } from "../lib/auth";
export default function AddProjectModal({ onAdded }: { onAdded: () => void }) {
  const [form, setForm] = useState({ title: "", description: "", link: "" });

  const handleAdd = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await addNewProject({
      uid: user.uid,
      title: form.title,
      description: form.description,
      link: form.link,
      createdAt: new Date(),
      progress: 0,
    });

    setForm({ title: "", description: "", link: "" });
    onAdded();
    (document.getElementById("add_project_modal") as HTMLDialogElement).close();
  };

  return (
    <dialog id="add_project_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Ajouter un projet</h3>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
        >
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Titre"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <input
            type="url"
            className="input input-bordered w-full"
            placeholder="Lien vers le projet"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">Ajouter</button>
            <button
              type="button"
              className="btn"
              onClick={() =>
                (document.getElementById("add_project_modal") as HTMLDialogElement).close()
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
