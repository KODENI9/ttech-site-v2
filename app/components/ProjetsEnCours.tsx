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
                        className="card shadow-xl bg-gradient-to-br from-base-100 to-base-200 border border-base-300 hover:shadow-2xl transition duration-300"
                    >
                        <div className="card-body space-y-4">
                            <h2 className="card-title text-xl text-primary">🚀 {p.title}</h2>

                            <p className="text-gray-600">{p.description}</p>

                            {p.link && (
                                <a
                                    href={p.link}
                                    target="_blank"
                                    className="link text-blue-600"
                                >
                                    🔗 Voir le projet
                                </a>
                            )}

                            <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                                {/* 📊 Barre de progression */}
                                <div className="w-full md:w-2/3">
                                    <label className="text-sm text-gray-500 mb-1 block">
                                        ⏳ Progression du projet
                                    </label>
                                    <progress
                                        className="progress progress-primary w-full"
                                        value={p.progress ?? 0}
                                        max="100"
                                    ></progress>
                                    <div className="text-right text-xs text-gray-500 mt-1">
                                        {p.progress ?? 0}%
                                    </div>
                                </div>

                                {/* 🛠️ Actions */}
                                {(user?.uid === p.uid || user?.email === ADMIN_EMAIL) && (
                                    <div className="flex flex-wrap gap-2 justify-end">
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
