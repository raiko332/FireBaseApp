import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../FirebaseConfig";

export interface Movie {
  id?: string;
  title: string;
  year?: number;
  genre?: string;
  posterUrl?: string;
  description?: string;
  rating?: number; // 0..10
  watched?: boolean;
  userId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const MOVIES_COLLECTION = "movies";

export const moviesCollection = collection(FIREBASE_DB, MOVIES_COLLECTION);

export function subscribeToUserMovies(
  userId: string,
  onChange: (movies: Movie[]) => void,
  onError?: (e: any) => void
) {
  const q = query(moviesCollection, where("userId", "==", userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Movie[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Movie),
      }));
      list.sort((a, b) => {
        const at = (a.createdAt as any)?.seconds || 0;
        const bt = (b.createdAt as any)?.seconds || 0;
        return bt - at; // newest first
      });
      onChange(list);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}

export async function addMovie(
  userId: string,
  data: Omit<Movie, "id" | "userId" | "createdAt" | "updatedAt">
) {
  const payload: Movie = {
    userId,
    title: data.title.trim(),
    year: data.year,
    genre: data.genre?.trim(),
    posterUrl: data.posterUrl?.trim(),
    description: data.description?.trim(),
    rating: data.rating ?? undefined,
    watched: data.watched ?? false,
    createdAt: serverTimestamp() as unknown as Timestamp,
    updatedAt: serverTimestamp() as unknown as Timestamp,
  };
  const ref = await addDoc(moviesCollection, payload as any);
  return ref.id;
}

export async function updateMovie(
  id: string,
  data: Partial<Omit<Movie, "id" | "userId" | "createdAt">>
) {
  const ref = doc(FIREBASE_DB, MOVIES_COLLECTION, id);
  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
  } as any;
  await updateDoc(ref, payload);
}

export async function deleteMovie(id: string) {
  const ref = doc(FIREBASE_DB, MOVIES_COLLECTION, id);
  await deleteDoc(ref);
}

export async function getMovieById(id: string): Promise<Movie | null> {
  const ref = doc(FIREBASE_DB, MOVIES_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Movie) };
}
