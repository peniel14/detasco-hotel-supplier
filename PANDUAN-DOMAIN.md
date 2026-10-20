# Panduan Menghubungkan Domain Custom (detasco.com) ke GitHub Pages

Dokumen ini berisi panduan langkah demi langkah untuk mengarahkan domain `detasco.com` ke repositori `peniel14/detasco-hotel-supplier`.

---

## Langkah 1: Pengaturan DNS di Panel Domain Registrar

Buka dashboard tempat Anda membeli domain (misalnya: Niagahoster, DomaiNesia, Rumahweb, Cloudflare, Namecheap, GoDaddy, dll.), lalu buka menu **DNS Management** atau **Zone Editor**.

Tambahkan **4 A Record** dan **1 CNAME Record** berikut:

### 1. Record A (Untuk Root Domain: `detasco.com` atau `@`)
| Tipe | Nama / Host | Nilai / Target IP | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` (atau kosongkan) | `185.199.108.153` | Automatic / 3600 |
| **A** | `@` (atau kosongkan) | `185.199.109.153` | Automatic / 3600 |
| **A** | `@` (atau kosongkan) | `185.199.110.153` | Automatic / 3600 |
| **A** | `@` (atau kosongkan) | `185.199.111.153` | Automatic / 3600 |

### 2. Record CNAME (Untuk Subdomain `www.detasco.com`)
| Tipe | Nama / Host | Nilai / Target Host | TTL |
| :--- | :--- | :--- | :--- |
| **CNAME** | `www` | `peniel14.github.io.` | Automatic / 3600 |

*Catatan: Pastikan ada tanda titik di akhir `peniel14.github.io.` jika panel DNS Anda mewajibkannya.*

---

## Langkah 2: Mengaktifkan File CNAME di Repositori

Setelah DNS diatur dan tersimpan:
1. Ganti nama file `CNAME.example` menjadi `CNAME` (atau buat file bernama `CNAME` yang berisi teks `detasco.com`).
2. Commit dan push ke branch `main`:
   ```bash
   git add CNAME
   git commit -m "feat(domain): aktifkan CNAME detasco.com"
   git push origin main
   ```

---

## Langkah 3: Mengaktifkan HTTPS di GitHub Pages

1. Buka repositori di GitHub:  
   👉 `https://github.com/peniel14/detasco-hotel-supplier/settings/pages`
2. Pada bagian **Custom domain**, pastikan tertulis `detasco.com` dan statusnya centang hijau (*DNS check successful*).
3. Centang opsi **Enforce HTTPS** agar situs aman dengan sertifikat SSL otomatis.

---

## Langkah 4: Memberikan Hak Akses Admin ke Rekan (Collaborator)

Jika ingin rekan Anda yang mengurus dan mengonfigurasi pengaturan Pages secara langsung:
1. Buka: `https://github.com/peniel14/detasco-hotel-supplier/settings/access`
2. Cari nama akun rekan Anda di daftar *Collaborators*.
3. Klik tombol titik tiga (...) atau peran saat ini (*Write*), lalu ubah menjadi **Admin**.
4. Simpan perubahan.
