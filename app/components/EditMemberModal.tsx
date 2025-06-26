"use client";

import { useEffect, useState } from "react";
import { MemberModel } from "../types/MemberModel";
import { updateMember } from "../lib/auth";

export default function EditMemberModal({
  member,
  onUpdated,
}: {
  member: MemberModel;
  onUpdated: () => void;
}) {
  const [form, setForm] = useState<MemberModel>(member);

  useEffect(() => {
    setForm(member);
  }, [member]);

  const handleUpdate = async () => {
    await updateMember(member.id!, form);
    onUpdated();
    (document.getElementById("edit_member_modal") as HTMLDialogElement).close();
  };

  return (
    <dialog id="edit_member_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Modifier le membre</h3>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
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

          {/* 🔒 Photo non modifiable ici pour simplifier */}
          {form.image && (
            <div className="text-sm text-gray-500">Image actuelle : 
              <img src={form.image} className="w-16 h-16 mt-1 rounded-full object-cover" />
            </div>
          )}

          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Enregistrer
            </button>
            <button
              type="button"
              className="btn"
              onClick={() =>
                (document.getElementById("edit_member_modal") as HTMLDialogElement).close()
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
