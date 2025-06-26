"use client";

import { useEffect, useState } from "react";
import { HistoryModel } from "../types/HistoryModel";
import { updateHistory } from "../lib/auth";

export default function EditHistoryModal({
  history,
  onUpdated,
}: {
  history: HistoryModel;
  onUpdated: () => void;
}) {
  const [form, setForm] = useState<HistoryModel>(history);

  useEffect(() => {
    setForm(history);
  }, [history]);

  const handleUpdate = async () => {
    await updateHistory(history.id!, form);
    onUpdated();
    (document.getElementById("edit_history_modal") as HTMLDialogElement).close();
  };

  return (
    <dialog id="edit_history_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Modifier la réussite</h3>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <input
            type="text"
            placeholder="Année"
            className="input input-bordered w-full"
            required
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />
          <input
            type="text"
            placeholder="Titre"
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
            <button type="submit" className="btn btn-primary">
              Enregistrer
            </button>
            <button
              type="button"
              className="btn"
              onClick={() =>
                (document.getElementById("edit_history_modal") as HTMLDialogElement).close()
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
