# 🤝 Panduan Kolaborasi Multi-AI: Antigravity + Claude

Dokumen ini adalah panduan standar operasional (SOP) agar dua pengembang di laptop berbeda dapat bekerja secara **sinkron, aman, dan tanpa konflik kode**, menggunakan dua AI yang berbeda:
- **Developer 1 (Anda)**: Menggunakan **Google Antigravity**
- **Developer 2 (Teman Anda)**: Menggunakan **Anthropic Claude** (Claude Code / Claude Project / Web)
- **Repository Utama**: [https://github.com/peniel14/detasco-hotel-supplier.git](https://github.com/peniel14/detasco-hotel-supplier.git)

---

## 🎯 Mengapa Perlu Sinkronisasi Khusus?

Setiap model AI memiliki gaya penulisan kode dan asumsi yang berbeda. Jika tidak diarahkan:
1. Claude bisa saja mengubah desain warna atau tata letak yang sudah dibuat rapi oleh Antigravity (atau sebaliknya).
2. Salah satu AI bisa saja menulis ulang data produk secara statis dan merusak arsitektur `products-data.js`.
3. Perubahan bersamaan pada file yang sama tanpa `git pull` bisa memicu *merge conflict*.

Untuk mencegah hal tersebut, proyek ini dilengkapi dengan **`CLAUDE.md`** (yang otomatis dibaca oleh Claude) dan aturan kerja berikut.

---

## 🔁 4 Langkah Siklus Kerja (The Golden Loop)

Setiap kali Anda atau teman Anda ingin menambah atau mengedit fitur, **wajib ikuti 4 langkah ini**:

```
 [1. Tarik Kode Terbaru]  -->  [2. Beri Perintah ke AI]
          ^                                |
          |                                v
 [4. Push ke GitHub]     <--  [3. Tes di Browser (localhost)]
```

### Langkah 1: Tarik Perubahan Terbaru Sebelum Bekerja
Sebelum menyuruh AI menulis kode, pastikan kode di laptop adalah versi paling baru:
```bash
git pull origin main
```

### Langkah 2: Berikan Instruksi Terfokus ke AI
Minta AI hanya mengerjakan fitur atau bagian file yang menjadi tanggung jawabnya (lihat pembagian tugas di bawah).

### Langkah 3: Tes Hasil di Browser
Pastikan server lokal berjalan:
```bash
node server.js
```
Buka `http://localhost:3000` atau `http://localhost:3000/katalog.html` untuk memverifikasi tampilan.

### Langkah 4: Simpan & Kirim ke GitHub
Jika sudah oke, langsung commit dan push agar teman Anda bisa langsung menariknya:
```bash
git add .
git commit -m "feat: deskripsi perubahan yang jelas"
git push origin main
```

---

## 🛡️ Pembagian Area Kerja (Mencegah Tabrakan Kode)

Cara paling efektif agar tidak pernah terjadi *conflict*: **bagi kepemilikan file/halaman**:

| Pengembang | AI | Area Fokus Utama | File yang Diedit |
| :--- | :--- | :--- | :--- |
| **Developer 1** | **Antigravity** | Halaman Beranda, Tata Letak Global, Server | `index.html`, `server.js`, `logo.png` |
| **Developer 2** | **Claude** | Halaman Katalog Lengkap, Filter, Modal Detail | `katalog.html` |
| **Bersama** | Koordinasi | Data Master Produk | `products-data.js` *(koordinasikan sebelum edit)* |

> 💡 **Tips**: Jika salah satu ingin mengedit `products-data.js` (misalnya menambah produk baru), beri tahu teman terlebih dahulu lewat chat (WhatsApp/Slack) agar tidak bersamaan.

---

## 🤖 Template Prompt untuk Teman Anda (Pengguna Claude)

Beri tahu teman Anda untuk menyalin template prompt ini setiap kali memulai sesi baru dengan Claude:

```markdown
Halo Claude! Kita sedang mengerjakan proyek website hotel supplier "Detasco".
Proyek ini dikembangkan bersama rekan tim yang menggunakan Google Antigravity.

Mohon baca dan patuhi file `CLAUDE.md` yang ada di root direktori proyek ini:
1. Jangan hardcode data produk di HTML, semua produk wajib melalui `products-data.js`.
2. Pertahankan ritme warna mewah bergantian: Dark Obsidian (#0D1017) dan Warm Linen (#F8F5EE).
3. Header navigasi setinggi 80px, semua anchor link gunakan scroll-mt-20.
4. Di index.html katalog hanya 1 baris (4 item) dengan tombol ke katalog.html.

Tugas saya hari ini adalah: [Tuliskan tugas Anda di sini, misalnya: Menambahkan filter rentang harga di katalog.html]

Tolong periksa file terkait dan berikan kode yang presisi tanpa merusak bagian lain.
```

---

## 🌿 Opsi Lanjutan: Menggunakan Git Branch (Jika Mengerjakan Fitur Besar)

Jika teman Anda ingin mengerjakan fitur besar yang butuh waktu lama tanpa mengganggu branch `main`:

1. Buat branch baru:
   ```bash
   git checkout -b feature/nama-fitur
   ```
2. Kerjakan bersama Claude, lalu commit & push branch tersebut:
   ```bash
   git add .
   git commit -m "feat: tambahkan fitur X"
   git push origin feature/nama-fitur
   ```
3. Di GitHub, buat **Pull Request (PR)** dan merge ke `main` setelah direview.

---

## 🚨 Apa yang Harus Dilakukan Jika Terjadi "Git Conflict"?

Jika muncul pesan `CONFLICT (content): Merge conflict in ...`:

1. Buka file yang bermasalah di text editor (VS Code / Antigravity).
2. Anda akan melihat tanda seperti:
   ```html
   <<<<<<< HEAD (Perubahan Anda)
   <div class="bg-[#0D1017]">...</div>
   =======
   <div class="bg-[#0A0D13]">...</div>
   >>>>>>> origin/main (Perubahan Teman)
   ```
3. Pilih salah satu atau gabungkan keduanya, lalu hapus baris penanda (`<<<<<<<`, `=======`, `>>>>>>>`).
4. Jalankan:
   ```bash
   git add .
   git commit -m "fix: resolve merge conflict"
   git push origin main
   ```
5. Atau cukup minta AI (Antigravity atau Claude): *"Tolong bantu selesaikan git conflict pada file ini dan pertahankan perbaikan dari kedua sisi"*.
