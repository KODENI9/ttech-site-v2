"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { deleteProject, getProjects } from "../lib/auth";
import { ProjectModel } from "../types/Project";
import { auth, db } from "../lib/server";
import AddProjectModal from "./AddProjectModal";
import { doc, getDoc } from "firebase/firestore";
import EditProjectModal from "./EditProjectModal";
import { ADMIN_EMAIL } from "../lib/config";

export default function ProjetsEnCours() {
    const [projects, setProjects] = useState<ProjectModel[]>([]);
    const [user, setUser] = useState<any>(null);
    const [challengePassed, setChallengePassed] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<ProjectModel | null>(null);

    const openEditModal = (project: ProjectModel) => {
        setProjectToEdit(project);
        (document.getElementById("edit_project_modal") as HTMLDialogElement).showModal();
    };


    const fetchProjects = async () => {
        const data = await getProjects();
        setProjects(data);
    };

    useEffect(() => {
        onAuthStateChanged(auth, async (u) => {
            if (u) {
                setUser(u);

                // Aller chercher les données depuis Firestore
                const userDoc = await getDoc(doc(db, "users", u.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setChallengePassed(data.challengePassed === true);
                }
            }
        });
        fetchProjects();
    }, []);

    return (
        <section className="mt-10 max-w-5xl mx-auto p-4 space-y-6">
            <h2 className="text-2xl font-bold">📂 Projets en cours</h2>

            {challengePassed && (
                <div className="text-right">
                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            (document.getElementById("add_project_modal") as HTMLDialogElement).showModal()
                        }
                    >
                        ➕ Ajouter un projet
                    </button>
                </div>
            )}


            <div className="grid md:grid-cols-2 gap-4">
                {projects.map((p) => (
                    <div
  key={p.id}
  className="relative group bg-gradient-to-br from-base-100 to-base-200 rounded-xl md:rounded-br-[3rem] rounded-tl-[2rem] shadow-md border border-primary/30 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:-rotate-1"
>
  {/* Badge "🔥 En cours" */}
  <div className="absolute top-3 right-3 bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
    🔥 En cours
  </div>

  {/* Bande verticale à gauche */}
  <div className="absolute left-0 top-0 h-full w-2 bg-primary rounded-r"></div>

  {/* Contenu */}
  <div className="card-body p-6 space-y-3">
    <h2 className="card-title text-xl font-bold text-primary">
      🚀 {p.title}
    </h2>

    <p className="text-gray-600">{p.description}</p>

    {p.link && (
      <a
        href={p.link}
        target="_blank"
        className="text-blue-600 hover:underline text-sm inline-block"
      >
        🔗 Voir le projet
      </a>
    )}

    {/* 📊 Progression */}
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500">⏳ Progression</label>
      <progress
        className="progress progress-primary w-full"
        value={p.progress ?? 0}
        max="100"
      ></progress>
      <div className="text-right text-xs text-gray-400">
        {p.progress ?? 0}%
      </div>
    </div>

    {/* 🛠️ Actions */}
    {(user?.uid === p.uid || user?.email === ADMIN_EMAIL) && (
      <div className="flex justify-end gap-2 mt-4 flex-wrap">
        <button
          className="btn btn-sm btn-outline btn-warning"
          onClick={() => openEditModal(p)}
        >
          ✏️ Modifier
        </button>
        <button
          className="btn btn-sm btn-outline btn-error"
          onClick={async () => {
            if (confirm("Confirmer la suppression du projet ?")) {
              await deleteProject(p.id);
              fetchProjects();
            }
          }}
        >
          🗑 Supprimer
        </button>
      </div>
    )}
  </div>
</div>

 
                ))}

            </div>

            {/* Modal d'ajout */}
            <AddProjectModal onAdded={fetchProjects} />

            {/* ✅ Modal d'édition */}
            {projectToEdit && (
                <EditProjectModal project={projectToEdit} onUpdated={fetchProjects} />
            )}
        </section>
    );
}
