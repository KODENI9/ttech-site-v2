"use client";

import { useEffect, useState } from "react";
import EditMemberModal from "./EditMemberModal";
import { MemberModel } from "../types/MemberModel";
import { deleteMember, getMembers } from "../lib/auth";
import { ADMIN_EMAIL } from "../lib/config";
import { auth } from "../lib/server";
import { onAuthStateChanged } from "firebase/auth";
import AddMemberModal from "./AddMemberModal";

export default function MembersSection() {
  const [members, setMembers] = useState<MemberModel[]>([]);
  const [user, setUser] = useState<any>(null);
  const [memberToEdit, setMemberToEdit] = useState<MemberModel | null>(null);

  const fetchMembers = async () => {
    const res = await getMembers();
    setMembers(res);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u));
    fetchMembers();
  }, []);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Supprimer ce membre ?");
    if (confirmDelete) {
      await deleteMember(id);
      fetchMembers();
    }
  };

  return (
    <section className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">👥 Nos Membres</h2>
        {isAdmin && (
          <button
            className="btn btn-success"
            onClick={() =>
              (document.getElementById("add_member_modal") as HTMLDialogElement).showModal()
            }
          >
            ➕ Ajouter un membre
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {members.map((m) => (
          <div key={m.id} className="card bg-base-100 shadow-md p-4 border">
            {m.image && (
              <img
                src={m.image}
                alt={m.name}
                className="w-20 h-20 rounded-full object-cover mb-3"
              />
            )}
            <h3 className="text-xl font-semibold">{m.name}</h3>
            <p className="text-sm text-primary">{m.role}</p>
            <p className="mt-2 text-sm">{m.description}</p>
            <p className="mt-2 text-xs text-gray-500">
              📧 {m.email}
              {m.github && (
                <>
                  <br />
                  🔗 <a href={m.github} className="link text-blue-500" target="_blank">GitHub</a>
                </>
              )}
            </p>

            {isAdmin && (
              <div className="mt-4 flex gap-2">
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => {
                    setMemberToEdit(m);
                    (document.getElementById("edit_member_modal") as HTMLDialogElement).showModal();
                  }}
                >
                  ✏️ Modifier
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => handleDelete(m.id!)}
                >
                  🗑 Supprimer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      {isAdmin && (
        <>
          <AddMemberModal onAdded={fetchMembers} />
          {memberToEdit && (
            <EditMemberModal member={memberToEdit} onUpdated={fetchMembers} />
          )}
        </>
      )}
    </section>
  );
}
