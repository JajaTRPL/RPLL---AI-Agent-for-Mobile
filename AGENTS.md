# Aturan untuk AI agent
## Konteks
- Baca spec.md dan docs/work-orders.md sebelum mulai.
- Kode aplikasi di src/, aset statis di public/, tests di tests/.
## Aturan kerja
1. Kerjakan HANYA work order yang diminta.
2. Jangan mengubah, menghapus, atau men-skip file di tests/.
3. Jangan menambah library baru tanpa bertanya.
4. Jangan menjalankan git commit, git push, atau deploy.
5. Sebelum selesai, jalankan: npm run lint, npm test, npm run test:e2e.
6. Akhiri dengan ringkasan: file yang diubah dan hasil tes.
## Gaya kode
- JavaScript modern (ES modules), tanpa framework.
- Nama fungsi dan variabel dalam English.

## Pelajaran dari work order sebelumnya
- Cek setiap layar di lebar 360 px sebelum selesai.
- Semua tombol harus punya teks atau aria-label (accessibility).
- Tes offline hanya memeriksa heading. Pastikan juga JS, CSS, dan catatan tetap jalan saat offline (WO-4: aset build harus ikut di-cache).
- Service worker hanya didaftarkan di build produksi; uji fitur offline dengan npm run build + npm run preview, bukan npm run dev.
