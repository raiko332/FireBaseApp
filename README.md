# FireBaseApp – Movie List

Aplikasi React Native (Expo) dengan Firebase Authentication dan Firestore untuk mengelola daftar film pribadi (CRUD + realtime).

## Menjalankan

1. Pastikan dependency sudah terpasang

```bash
npm install
```

2. Jalankan Expo

```bash
npm run start
```

3. Buka di Expo Go (Android/iOS) atau emulator.

## Konfigurasi Firebase

Ubah kredensial Firebase di `FirebaseConfig.ts` sesuai project Anda. Paket yang digunakan: `firebase@^12` (modular SDK).

## Skema Firestore

Collection: `movies`

Dokumen Movie:

- `title`: string (wajib)
- `year`: number (opsional)
- `genre`: string (opsional)
- `posterUrl`: string (opsional)
- `description`: string (opsional)
- `rating`: number 0..10 (opsional)
- `watched`: boolean (default false)
- `userId`: string (wajib)
- `createdAt`: timestamp (serverTimestamp)
- `updatedAt`: timestamp (serverTimestamp)

## Rekomendasi Rules (contoh)

Atur rules agar user hanya bisa baca/tulis film miliknya sendiri:

```
rules_version = '2';
service cloud.firestore {
	match /databases/{database}/documents {
		match /movies/{movieId} {
			allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
			allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
		}
	}
}
```

## Struktur Kode Utama

- `app/services/movies.ts`: Tipe `Movie` + fungsi CRUD Firestore
- `app/screens/Home.tsx`: Daftar film, tambah film (modal), navigasi ke detail
- `app/screens/Details.tsx`: Detail film, edit dan hapus
- `app/screens/Login.tsx`: Login/Sign up email-password
- `App.tsx`: Navigasi dan guard berdasarkan auth state

## Catatan

- Realtime daftar film berbasis `onSnapshot` dan disaring per `userId`.
- Input sederhana dengan validasi minimal. Perluas sesuai kebutuhan.
