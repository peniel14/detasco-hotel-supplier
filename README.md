# DETASCO - Hospitality Supplier Website

Portal Pengadaan Perlengkapan Komersial Hotel & Resor Bintang 4 & 5 di Indonesia.

## 📁 Struktur File
- `index.html`: Laman Beranda (Hero, Katalog 1 Baris Pilihan, Kategori, Inspirasi, Standar SLA, Cara Pemesanan 4 Langkah, Formulir Penawaran, Lokasi Kantor & Showroom Resmi).
- `katalog.html`: Laman Lengkap Katalog 20 Produk (Pencarian real-time, filter kategori, sorting, modal detail spesifikasi komersial, tombol WhatsApp terintegrasi).
- `products-data.js`: Database master terpusat untuk 20 item produk hotel (Single Source of Truth).
- `server.js`: Web server lokal menggunakan Node.js (Port 3000 & 3001).
- `logo.png`: Aset logo resmi Detasco.
- `CLAUDE.md`: Konfigurasi & instruksi otomatis khusus untuk rekan tim pengguna Anthropic Claude.
- `AI_GUIDELINES.md`: Panduan lengkap sinkronisasi kerja tim multi-AI (Antigravity + Claude).

## 🚀 Cara Menjalankan di Laptop

1. Pastikan **Node.js** terinstal di laptop.
2. Buka terminal pada folder proyek ini, lalu jalankan:
   ```bash
   node server.js
   ```
3. Buka browser pada alamat:
   - Beranda: `http://localhost:3000/`
   - Katalog Lengkap: `http://localhost:3000/katalog.html`

## 👥 Alur Kolaborasi Tim (Git & GitHub)

1. **Sebelum mulai mengedit**, selalu tarik perubahan terbaru:
   ```bash
   git pull
   ```
2. **Setelah selesai mengedit**, kirim perubahan ke repository:
   ```bash
   git add .
   git commit -m "Keterangan perubahan yang dilakukan"
   git push
   ```
