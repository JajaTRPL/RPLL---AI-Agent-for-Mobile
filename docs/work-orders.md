# Work Orders

Kerjakan satu work order per branch, berurutan. Setiap work order dianggap
selesai jika gate-nya lulus DAN `npm run lint`, `npm test`, `npm run test:e2e`
tetap lulus. File di `tests/` ditulis oleh manajer, bukan oleh agent.

## WO-1: Storage
Tujuan: menyimpan catatan di localStorage lewat satu modul yang mudah dites.
File:
- `src/storage.js` (baru), mengekspor `createStore(storage = window.localStorage)`
  dengan fungsi `list()`, `save(note)`, `remove(id)`, `search(text)`.

Ketentuan:
- Bentuk catatan: `{ id, title, body, updatedAt }`.
- `save` tanpa id: buat id baru (`crypto.randomUUID()`), isi `updatedAt`,
  lalu kembalikan catatan yang tersimpan.
- `save` dengan id: perbarui catatan yang sudah ada dan `updatedAt`-nya.
- `remove(id)`: hapus catatan dengan id tersebut.
- `list()`: semua catatan, terbaru (`updatedAt`) di atas.
- Simpan sebagai JSON di satu key localStorage; data rusak dianggap daftar kosong.
- Hanya memakai `getItem` dan `setItem` dari objek storage.

Gate: `tests/unit/storage.test.js` blok `storage (WO-1)`.

## WO-2: Layar daftar dan editor
Tujuan: UI notes sesuai "UI contract" di spec.md, memakai `createStore()`.
File:
- `index.html`, `src/main.js`, `src/style.css` (diubah).
- Hapus file contoh Vite: `src/counter.js`, `src/assets/`, dan aset contoh
  di `public/` yang tidak dipakai.

Ketentuan:
- Alur: daftar catatan → "Tambah catatan" atau klik item → editor
  (input "Judul", "Isi") → "Simpan" atau "Hapus" → kembali ke daftar.
- Tombol "Hapus" hanya ada di editor, tanpa `confirm()` bawaan browser.
- Setiap judul catatan hanya tampil sekali di halaman.
- Rapi di lebar 360 px tanpa horizontal scroll; area sentuh minimal 44 x 44 px.
- `<html lang="id">`, semua teks UI dalam Bahasa Indonesia.

Gate: `tests/e2e/notes.spec.js` tes WO-2
("catatan tetap ada setelah reload", "tombol Simpan terlihat di layar 360 px").

## WO-3: Pencarian
Tujuan: input "Cari" memfilter daftar saat mengetik, memakai `store.search`.
File:
- `src/storage.js` (melengkapi `search`), `src/main.js`, `index.html`.

Ketentuan:
- Mencocokkan teks di judul atau isi, tanpa beda huruf besar/kecil.
- Teks kosong (atau hanya spasi) mengembalikan semua catatan.
- Tampilkan pesan jika tidak ada hasil.

Gate: `tests/unit/storage.test.js` blok `search (WO-3)` dan
`tests/e2e/notes.spec.js` tes "mencari catatan".

## WO-4: Offline + home screen
Tujuan: aplikasi bisa dibuka offline dan di-install ke HP.
File:
- `public/manifest.webmanifest` (nama, ikon, `display: standalone`,
  `start_url` dan `scope` relatif: `./`).
- `public/icons/` (PNG 192 dan 512 px).
- `public/sw.js` (cache-first, `skipWaiting()` dan `clients.claim()`).
- `index.html` (link manifest, `theme-color`), pendaftaran service worker
  di `src/main.js`.

Ketentuan:
- Semua path relatif agar jalan di `https://<username>.github.io/notes-app/`.
- Saat offline, halaman utama dan catatan yang tersimpan tetap tampil.

Gate: `tests/e2e/notes.spec.js` tes "tetap bisa dibuka saat offline".

## WO-5: Polish
Tujuan: Lighthouse (mode Mobile) Performance dan Accessibility >= 90.
File: sesuai temuan Lighthouse (umumnya `index.html`, `src/style.css`,
`src/main.js`).

Ketentuan:
- Perbaiki temuan merah/oranye tanpa menambah library dan tanpa mengubah tests.

Gate: laporan Lighthouse di Chrome DevTools (Performance dan Accessibility
>= 90) + semua tes tetap lulus.
