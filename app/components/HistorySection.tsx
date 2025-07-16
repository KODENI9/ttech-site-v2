"use client";

import { useEffect, useState } from "react";
import { HistoryModel } from "../types/HistoryModel";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/server";
import { deleteHistory, getHistories } from "../lib/auth";
import { ADMIN_EMAIL } from "../lib/config";
import AddHistoryModal from "./AddHistoryModal";
import EditHistoryModal from "./EditHistoryModal";

export default function HistorySection() {
  const [histories, setHistories] = useState<HistoryModel[]>([]);
  const [user, setUser] = useState<any>(null);
  const [historyToEdit, setHistoryToEdit] = useState<HistoryModel | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u));
    fetchHistories();
  }, []);

  const fetchHistories = async () => {
    const data = await getHistories();
    setHistories(data);
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleDelete = async (id: string) => {
    const ok = confirm("Supprimer cette réussite ?");
    if (ok) {
      await deleteHistory(id);
      fetchHistories();
    }
  };

  return (
    <section className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">🏆 Historique de nos Réussites</h2>
        {isAdmin && (
          <button
            className="btn btn-success"
            onClick={() =>
              (
                document.getElementById(
                  "add_history_modal"
                ) as HTMLDialogElement
              ).showModal()
            }
          >
            ➕ Ajouter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {histories.map((item) => (
          <div
            key={item.id}
            className="card bg-base-100 border-l-4 border-accent rounded-lg shadow-sm transition-all duration-300 hover:shadow-[0_4px_20px_rgba(59,130,246,0.1)] animate-fade-in-up"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-primary">
                  🎯 {item.title}
                </h3>
                <span className="badge badge-accent badge-outline text-sm px-3 py-1">
                  📅 {item.year}
                </span>
              </div>

              <p className="text-sm text-gray-700 mt-2">{item.description}</p>

              {isAdmin && (
                <div className="mt-4 flex gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => {
                      setHistoryToEdit(item);
                      (
                        document.getElementById(
                          "edit_history_modal"
                        ) as HTMLDialogElement
                      ).showModal();
                    }}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDelete(item.id!)}
                  >
                    🗑 Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isAdmin && (
        <>
          <AddHistoryModal onAdded={fetchHistories} />
          {historyToEdit && (
            <EditHistoryModal
              history={historyToEdit}
              onUpdated={fetchHistories}
            />
          )}
        </>
      )}
    </section>
  );
}
