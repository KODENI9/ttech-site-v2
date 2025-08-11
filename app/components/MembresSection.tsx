"use client";

import { useEffect, useState } from "react";
import EditMemberModal from "./EditMemberModal";
import { MemberModel } from "../types/MemberModel";
import { deleteMember, getMembers } from "../lib/auth";
import { ADMIN_EMAIL } from "../lib/config";
import { auth } from "../lib/server";
import { onAuthStateChanged, User } from "firebase/auth";
import AddMemberModal from "./AddMemberModal";
import Image from "next/image";

export default function MembersSection() {
  const [members, setMembers] = useState<MemberModel[]>([]);
   const [user, setUser] = useState<User | null>(null);
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
              (
                document.getElementById("add_member_modal") as HTMLDialogElement
              ).showModal()
            }
          >
            ➕ Ajouter un membre
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {members.map((m) => (
          <div
            key={m.id}
            className="relative group bg-gradient-to-br from-base-100 to-base-200 rounded-xl md:rounded-bl-[2rem] rounded-tr-[3rem] shadow-md border border-secondary/20 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:rotate-1"
          >
            {/* Bande verticale violette à gauche */}
            <div className="absolute left-0 top-0 h-full w-2 bg-secondary rounded-r"></div>

            <div className="card-body p-6 space-y-3">
              {/* Image */}
              {m.image && (
                <div className="flex justify-center">
                  <Image
                    src={m.image}
                    alt={m.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border-2 border-secondary shadow mb-2 group-hover:scale-105 transition"
                  />
                </div>
              )}

              {/* Nom et rôle */}
              <h3 className="text-xl font-bold text-center text-primary">
                {m.name}
              </h3>
              <p className="text-center text-sm text-secondary">{m.role}</p>

              {/* Description */}
              <p className="text-sm text-center text-gray-600">
                {m.description}
              </p>

              {/* Email & GitHub */}
              <div className="text-xs text-center text-gray-500 mt-2">
                📧 {m.email}
                {m.github && (
                  <>
                    <br />
                    🔗{" "}
                    <a
                      href={m.github}
                      target="_blank"
                      className="link text-blue-500"
                    >
                      GitHub
                    </a>
                  </>
                )}
              </div>

              {/* Admin only actions */}
              {isAdmin && (
                <div className="mt-4 flex justify-center gap-2 flex-wrap">
                  <button
                    className="btn btn-sm btn-outline btn-warning"
                    onClick={() => {
                      setMemberToEdit(m);
                      (
                        document.getElementById(
                          "edit_member_modal"
                        ) as HTMLDialogElement
                      ).showModal();
                    }}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => handleDelete(m.id!)}
                  >
                    🗑 Supprimer
                  </button>
                </div>
              )}
            </div>
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
