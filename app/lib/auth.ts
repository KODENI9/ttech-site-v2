// lib/auth.ts
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp, updateDoc, collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { UserModel } from "../types/User";
import { auth, db, storage } from "./server";
import { ProjectModel } from "../types/Project";
import { MemberModel } from "../types/MemberModel";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { HistoryModel } from "../types/HistoryModel";
import { EventModel } from "../types/Event";


export async function registerUser(
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  phone?: string
) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userData: UserModel = {
    uid: user.uid,
    email: user.email!,
    phone,
    first_name,
    last_name,
    createdAt: new Date(),
    challengePassed: false, // ✅ pas encore validé
  };

  await setDoc(doc(db, "users", user.uid), userData);

  return userData;
}

export async function markChallengeAsPassed(uid: string) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    challengePassed: true,
  });
}
export async function addNewProject(project: Omit<ProjectModel, "id">) {
  await addDoc(collection(db, "projects"), project);
}

// Obtenir tous les projets
export async function getProjects(): Promise<ProjectModel[]> {
  const snap = await getDocs(collection(db, "projects"));
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ProjectModel, "id">),
  }));
}

// Met à jour un projet
export async function updateProjectById(id: string, data: Partial<ProjectModel>) {
  const ref = doc(db, "projects", id);
  await updateDoc(ref, data);
}

// 🗑 Supprimer un projet
export const deleteProject = async (id: string) => {
  const ref = doc(db, "projects", id);
  await deleteDoc(ref);
};


// 🔽 Obtenir tous les membres
export async function getMembers(): Promise<MemberModel[]> {
  const snap = await getDocs(collection(db, "members"));
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as MemberModel));
}

// ➕ Ajouter un membre
export async function addMember(member: MemberModel, file?: File) {
  let imageUrl = "";
  if (file) {
    const storageRef = ref(storage, `members/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    imageUrl = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db, "members"), {
    ...member,
    image: imageUrl,
  });
}

// ✏️ Modifier un membre
export async function updateMember(id: string, data: Partial<MemberModel>) {
  const docRef = doc(db, "members", id);
  await updateDoc(docRef, data);
}

// 🗑 Supprimer un membre
export async function deleteMember(id: string) {
  const docRef = doc(db, "members", id);
  await deleteDoc(docRef);
}

// 🔽 Obtenir tous les historiques
export async function getHistories(): Promise<HistoryModel[]> {
  const snap = await getDocs(collection(db, "histories"));
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as HistoryModel));
}

// ➕ Ajouter un historique
export async function addHistory(data: HistoryModel) {
  await addDoc(collection(db, "histories"), data);
}

// ✏️ Modifier
export async function updateHistory(id: string, data: Partial<HistoryModel>) {
  await updateDoc(doc(db, "histories", id), data);
}

// 🗑 Supprimer
export async function deleteHistory(id: string) {
  await deleteDoc(doc(db, "histories", id));
}

const eventsRef = collection(db, "events");

export const getEvents = async () => {
  const snap = await getDocs(eventsRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
};

export const addEvent = async (event: Omit<EventModel, "id" | "createdAt">) => {
  return await addDoc(eventsRef, {
    ...event,
    createdAt: serverTimestamp(),
  });
};

export const updateEvent = async (id: string, data: Partial<EventModel>) => {
  return await updateDoc(doc(db, "events", id), data);
};

export const deleteEvent = async (id: string) => {
  return await deleteDoc(doc(db, "events", id));
};

