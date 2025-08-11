"use client";

import { useEffect, useState } from "react";
import { updateProjectById } from "../lib/auth";
import { ProjectModel } from "../types/Project";

export default function EditProjectModal({
  project,
  onUpdated,
}: {
  project: ProjectModel;
  onUpdated: () => void;
}) {
  const [form, setForm] = useState<ProjectModel>(project);

  useEffect(() => {
    setForm(project);
  }, [project]);

  const handleUpdate = async () => {
    await updateProjectById(project.id, {
      title: form.title,
      description: form.description,
      link: form.link,
      progress: form.progress ?? 0,
    });

    onUpdated();
    (document.getElementById("edit_project_modal") as HTMLDialogElement).close();
  };

  return (
    <dialog id="edit_project_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Modifier le projet</h3>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Titre"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="url"
            className="input input-bordered w-full"
            placeholder="Lien"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
          <input
            type="number"
            min={0}
            max={100}
            className="input input-bordered w-full"
            placeholder="Progression (%)"
            value={form.progress}
            onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
          />

          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Enregistrer
            </button>
            <button
              type="button"
              className="btn"
              onClick={() =>
                (document.getElementById("edit_project_modal") as HTMLDialogElement).close()
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
