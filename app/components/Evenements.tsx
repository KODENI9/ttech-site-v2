"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/server";
import { EventModel } from "../types/Event";
import { addEvent, deleteEvent, getEvents, updateEvent } from "../lib/auth";
import { ADMIN_EMAIL } from "../lib/config";

export default function Evenements() {
  const [events, setEvents] = useState<EventModel[]>([]);
  const [user, setUser] = useState<any>(null);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "" });
  const [editingEvent, setEditingEvent] = useState<EventModel | null>(null);

  const fetchEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
    fetchEvents();
  }, []);

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.description) return;
    await addEvent(newEvent);
    setNewEvent({ title: "", date: "", description: "" });
    fetchEvents();
  };

  const handleUpdate = async () => { 
    if (editingEvent) {
      await updateEvent(editingEvent.id, {
        title: editingEvent.title,
        date: editingEvent.date,
        description: editingEvent.description,
      });
      setEditingEvent(null);
      fetchEvents();
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">🎤 Congrès & Événements</h2>

      <div className="space-y-6">
        {events.map((e) => (
          <div
            key={e.id}
            className="card bg-base-100 shadow-md border border-base-200 p-4 space-y-2"
          >
            <h3 className="text-xl font-semibold">📅 {e.date} – {e.title}</h3>
            <p className="text-sm">{e.description}</p>

            {user?.email === ADMIN_EMAIL && (
              <div className="flex gap-2 mt-2">
                <button className="btn btn-sm btn-outline btn-warning" onClick={() => setEditingEvent(e)}>✏️ Modifier</button>
                <button className="btn btn-sm btn-outline btn-error" onClick={async () => {
                  if (confirm("Supprimer cet événement ?")) {
                    await deleteEvent(e.id);
                    fetchEvents();
                  }
                }}>🗑 Supprimer</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {user?.email === ADMIN_EMAIL && (
        <>
          <div className="divider mt-10">➕ Ajouter un événement</div>
          <div className="grid gap-4 md:grid-cols-3">
            <input
              className="input input-bordered"
              placeholder="Mois + année (ex: Avril 2025)"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            />
            <input
              className="input input-bordered"
              placeholder="Titre"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <input
              className="input input-bordered"
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
            <button className="btn btn-primary col-span-full" onClick={handleAddEvent}>Ajouter</button>
          </div>
        </>
      )}

      {/* Modal d’édition */}
      {editingEvent && (
        <dialog id="edit_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">✏️ Modifier l événement</h3>
            <input
              className="input input-bordered w-full mt-2"
              placeholder="Date"
              value={editingEvent.date}
              onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
            />
            <input
              className="input input-bordered w-full mt-2"
              placeholder="Titre"
              value={editingEvent.title}
              onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
            />
            <textarea
              className="textarea textarea-bordered w-full mt-2"
              placeholder="Description"
              value={editingEvent.description}
              onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
            />
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleUpdate}>💾 Enregistrer</button>
              <button className="btn" onClick={() => setEditingEvent(null)}>❌ Fermer</button>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
