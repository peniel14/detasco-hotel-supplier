// DETASCO - ID/EN Language Switcher (shared by index.html & katalog.html)
// Works by walking static text nodes and swapping exact-match strings via DICTIONARY.
// Dynamically-rendered product content (title/desc/specs) is translated separately
// by the render functions themselves, using the *_en fields in products-data.js.
(function () {
  var STORAGE_KEY = 'detasco-lang';

  var DICTIONARY = {
    // ---- Shared Nav ----
    "Beranda": "Home",
    "Linen": "Linen",
    "Amenities": "Amenities",
    "Gorden": "Curtains",
    "Towel": "Towels",
    "Katalog": "Catalog",
    "Kategori": "Categories",
    "Inspirasi": "Inspiration",
    "Standar": "Standards",
    "Kontak": "Contact",
    "Lokasi": "Location",
    "Lokasi Showroom": "Showroom Location",
    "Kategori Suplai": "Supply Categories",
    "20 Produk": "20 Products",
    "21 Produk": "21 Products",
    "Semua Koleksi": "All Collections",
    "Katalog lengkap hotel": "Complete hotel catalog",
    "Sprei, duvet & handuk": "Sheets, duvets & towels",
    "Buka Seluruh Katalog (20 Koleksi)": "View Full Catalog (20 Collections)",
    "Buka Seluruh Katalog (21 Koleksi)": "View Full Catalog (21 Collections)",
    "Konsultasi": "Consultation",
    "Buka Laman Katalog Lengkap →": "View Full Catalog Page →",
    "Menu Navigasi": "Navigation Menu",

    // ---- Hero (index.html) ----
    "SOLUSI PENGADAAN HOSPITALITY BINTANG 5 DI SELURUH INDONESIA": "5-STAR HOSPITALITY PROCUREMENT SOLUTIONS ACROSS INDONESIA",
    "Sertifikasi Standar Industri Hotel": "Certified to Hotel Industry Standards",
    "Distribusi Cepat Seluruh Nusantara": "Fast Distribution Nationwide",

    // ---- Katalog Produk Unggulan (index.html) ----
    "KATALOG PRODUK UNGGULAN": "FEATURED PRODUCT CATALOG",
    "Koleksi esensial perhotelan dengan spesifikasi komersial teruji, didesain untuk durabilitas tinggi dan kemewahan sentuhan tamu.": "Essential hospitality collections with field-tested commercial specifications, built for high durability and a luxurious guest touch.",
    "Semua Koleksi (20)": "All Collections (20)",
    "Semua Koleksi (21)": "All Collections (21)",
    "Tidak ada koleksi produk yang sesuai filter.": "No product collection matches this filter.",
    "Tampilkan Semua Koleksi": "Show All Collections",
    "See All Products (Lihat Seluruh Koleksi)": "See All Products (View Full Collection)",
    "See All Linen & Bedding (Katalog Lengkap)": "See All Linen & Bedding (Full Catalog)",
    "See All Guest Amenities (Katalog Lengkap)": "See All Guest Amenities (Full Catalog)",
    "Tersedia 20+ koleksi lengkap dengan filter spesifikasi komersial di laman katalog": "20+ full collections available with commercial spec filters on the catalog page",
    "Tersedia 21+ koleksi lengkap dengan filter spesifikasi komersial di laman katalog": "21+ full collections available with commercial spec filters on the catalog page",
    "*Memerlukan penyesuaian dimensi matras, bordir lambang khusus, atau formulasi aroma (*signature scent*) hotel Anda?": "*Need custom mattress dimensions, special logo embroidery, or a signature scent formulation for your hotel?",
    "Hubungi Tim Spesifikasi Teknis B2B": "Contact Our B2B Technical Specification Team",

    // ---- Product card template (dynamic, but static wrapper text) ----
    "MINTA PENAWARAN": "REQUEST A QUOTE",
    "PRODUK BARU": "NEW ARRIVAL",

    // ---- Kategori Pasokan Utama (index.html) ----
    "RUANG LINGKUP PENGADAAN KOMPREHENSIF": "COMPREHENSIVE PROCUREMENT SCOPE",
    "KATEGORI PASOKAN UTAMA": "CORE SUPPLY CATEGORIES",
    "Mendukung seluruh tahapan operasional properti: mulai dari proyek pembukaan awal (": "Supporting every stage of property operations: from the initial (",
    ") hingga pengadaan terjadwal bulanan.": ") project through to scheduled monthly procurement.",
    "Sprei, duvet cover, bantal microfibre bulu angsa, matras topper, dan handuk tebal 650 GSM dengan penyerapan prima.": "Sheets, duvet covers, down-alternative microfibre pillows, mattress toppers, and thick 650 GSM towels with superior absorbency.",
    "Dental kit ramah lingkungan, sabun alami esensial, sampo herbal, serta sandal hotel tebal dengan sol anti-slip.": "Eco-friendly dental kits, natural essential soaps, herbal shampoo, and thick hotel slippers with anti-slip soles.",
    "Formulasi Tersertifikasi BPOM": "BPOM-Certified Formulation",

    // ---- Inspirasi (index.html) ----
    "PORTOFOLIO SUASANA PROPERTI": "PROPERTY AMBIENCE PORTFOLIO",
    "INSPIRASI KEMEWAHAN RUANG HOTEL": "LUXURY HOTEL SPACE INSPIRATION",
    "Bagaimana produk-produk DETASCO berpadu sempurna menghadirkan kenyamanan kelas dunia di berbagai sudut hotel dan resor rekanan kami.": "How DETASCO products come together to deliver world-class comfort across our partner hotels and resorts.",

    // ---- Stats ----
    "Hotel & Resor Rekanan": "Partner Hotels & Resorts",
    "Kamar Dilayani di Seluruh RI": "Rooms Served Across Indonesia",
    "Tingkat Ketepatan Pengiriman (SLA)": "On-Time Delivery Rate (SLA)",
    "Pengalaman Industri Supplier": "Years of Supplier Industry Experience",

    // ---- What You Need? / Our Categories ----
    "our categories": "our categories",
    "What you Need?": "What you Need?",
    "Tingkatkan kenyamanan tamu dengan linen hotel berkualitas tinggi lembut, tahan lama, dan elegan. Tersedia dalam berbagai ukuran dan warna. cocok untuk hotel bintang 3 hingga 5. Bisa custom dengan logo hotel Anda untuk tampilan yang lebih eksklusif.": "Enhance guest comfort with high-quality, soft, durable, and elegant hotel linen. Available in multiple sizes and colors, suitable for 3 to 5-star hotels. Customizable with your hotel logo for a more exclusive look.",
    "Ciptakan kesan pertama yang berkesan dengan amenities hotel yang tampil bersih, wangi, dan premium. Kami menyediakan paket sabun, sampo, sikat gigi, shower cap, hingga sandal hotel bisa dikemas custom sesuai branding hotel Anda.": "Create a memorable first impression with clean, fragrant, and premium hotel amenities. We provide soap, shampoo, dental kits, shower caps, and hotel slippers that can be custom packaged to match your hotel branding.",
    "Percantik kamar dan atur pencahayaan alami dengan gorden hotel elegan dari bahan pilihan. Tersedia dalam berbagai model: blackout, sheer, atau kombinasi. Cocok untuk suasana kamar yang tenang, hangat, dan eksklusif.": "Beautify rooms and manage natural lighting with elegant hotel curtains crafted from selected fabrics. Available in blackout, sheer, or combination models. Perfect for calm, warm, and exclusive guest rooms.",
    "Handuk tebal, lembut, dan cepat menyerap memberikan pengalaman mandi yang menyenangkan bagi tamu Anda. Tersedia berbagai jenis: hand towel, bath towel, face towel, dan pool towel. Bisa bordir nama atau logo hotel.": "Thick, plush, and highly absorbent towels provide a delightful bathing experience for your guests. Available in hand, bath, face, and pool towels. Custom embroidery with your hotel name or logo available.",
    "SEE MORE": "SEE MORE",

    // ---- Mengapa Memilih Detasco ----
    "MENGAPA MEMILIH DETASCO": "WHY CHOOSE DETASCO",
    "Kemitraan pengadaan jangka panjang dengan kepastian kualitas konsisten, transparansi harga pabrik, dan dedikasi layanan purna jual.": "A long-term procurement partnership built on consistent quality, transparent factory pricing, and dedicated after-sales service.",
    "STANDAR BINTANG 5": "5-STAR STANDARD",
    "Diproduksi dengan bahan baku pilihan yang lolos uji ketahanan cuci intensif dan regulasi hospitality internasional.": "Manufactured from selected raw materials that pass intensive wash-durability testing and international hospitality regulations.",
    "CUSTOM LOGO & BRANDING": "CUSTOM LOGO & BRANDING",
    "Kustomisasi logo hotel pada linen (bordir benang emas), kemasan kemewahan amenities, serta leatherette desk organizer.": "Custom hotel logo on linen (gold-thread embroidery), luxury amenity packaging, and leatherette desk organizers.",
    "KAPASITAS VOLUME BESAR": "LARGE-VOLUME CAPACITY",
    "Didukung jaringan rantai pasok terintegrasi dan kapasitas gudang besar yang sanggup menyuplai ratusan kamar secara simultan.": "Backed by an integrated supply chain network and large warehouse capacity able to supply hundreds of rooms simultaneously.",
    "GARANSI & SLA PENGIRIMAN": "WARRANTY & DELIVERY SLA",
    "Jaminan penggantian unit cacat pabrik secara cepat (": "Fast factory-defect replacement guarantee (",
    ") dan kepastian tanggal serah terima proyek.": ") and guaranteed project handover dates.",
    "DIPERCAYA OLEH RESOR DAN JARINGAN HOTEL TERNAMA": "TRUSTED BY LEADING RESORTS AND HOTEL CHAINS",

    // ---- Cara Pemesanan ----
    "CARA PEMESANAN": "HOW TO ORDER",
    "Empat Langkah Mudah": "Four Easy Steps",
    "Proses pemesanan yang singkat dan transparan, dari memilih produk sampai barang tiba.": "A short, transparent ordering process, from choosing products to delivery.",
    "Pilih Produk": "Choose Products",
    "Pilih kategori produk dan catat kebutuhan, spesifikasi, serta kustomisasi Anda.": "Select product categories and note your needs, specifications, and customization.",
    "Minta Penawaran": "Request a Quote",
    "Kirim daftar kebutuhan lewat WhatsApp atau formulir. Kami balas dengan penawaran harga grosir.": "Send your requirements via WhatsApp or the form. We'll reply with wholesale pricing.",
    "Konfirmasi & Persiapan": "Confirm & Prepare",
    "Sepakati spesifikasi, desain custom (jika ada), pembayaran, dan jadwal pengerjaan.": "Agree on specifications, custom design (if any), payment, and production schedule.",
    "Pengiriman": "Delivery",
    "Pesanan dikemas rapi dan dikirim ke alamat properti atau institusi Anda.": "Orders are neatly packed and shipped to your property or institution.",

    // ---- Kontak & Form (index.html) ----
    "Layanan Pengadaan B2B": "B2B Procurement Service",
    "Hubungi Tim Konsultan Pengadaan DETASCO": "Contact the DETASCO Procurement Consultant Team",
    "Kami melayani pembelian partai besar, tender pengadaan, pengiriman sampel fisik (": "We handle bulk purchases, procurement tenders, physical sample shipping (",
    "), serta kontrak pasokan jangka panjang dengan termin fleksibel.": "), and long-term supply contracts with flexible terms.",
    "Kantor Pusat & Pergudangan Terpadu": "Head Office & Integrated Warehouse",
    "Sentra Logistik & Pergudangan Modern, Medan": "Modern Logistics & Warehouse Hub, Medan",
    "Email Resmi Procurement": "Official Procurement Email",
    "Hotline WhatsApp Sales Proyek": "Project Sales WhatsApp Hotline",
    "(Senin - Sabtu, 08:30 - 17:30 WIB)": "(Mon - Sat, 08:30 - 17:30 WIB)",
    "Formulir Permintaan Penawaran & Sampel Produk": "Quote & Product Sample Request Form",
    "Isi detail kebutuhan properti Anda. Tim kami akan menyiapkan estimasi penawaran resmi B2B dalam waktu 1x24 jam.": "Fill in your property's requirements. Our team will prepare an official B2B quote estimate within 24 hours.",
    "Nama Lengkap PIC": "Full Name of PIC",
    "Nama Properti / Hotel": "Property / Hotel Name",
    "Email Perusahaan": "Company Email",
    "Nomor WhatsApp Aktif": "Active WhatsApp Number",
    "Kategori Kebutuhan": "Requirement Category",
    "Jumlah Kamar / Unit": "Number of Rooms / Units",
    "Spesifikasi Tambahan & Catatan Khusus": "Additional Specifications & Special Notes",
    "KIRIM PERMINTAAN PENAWARAN RESMI": "SUBMIT OFFICIAL QUOTE REQUEST",
    "Contoh: Bpk. Hendra Wijaya": "e.g. Mr. Hendra Wijaya",
    "Contoh: The Grand Palace Hotel": "e.g. The Grand Palace Hotel",
    "Contoh: 120 Kamar": "e.g. 120 Rooms",
    "Sebutkan detail pesanan (contoh: Katun satin 500TC, logo bordir emas di sudut sprei, butuh mock-up sampel minggu depan)...": "Describe your order details (e.g. 500TC satin cotton, gold embroidered logo on the sheet corner, need a mock-up sample next week)...",
    "Linen & Bedding (Sprei, Handuk 500TC)": "Linen & Bedding (Sheets, 500TC Towels)",
    "Paket Lengkap Hotel Pre-Opening": "Full Hotel Pre-Opening Package",

    // ---- Footer (index.html) ----
    "Mitra pengadaan terpercaya perlengkapan perhotelan bintang 5 dan resor terkemuka di seluruh nusantara.": "A trusted procurement partner for 5-star hospitality supplies and leading resorts nationwide.",
    "NAVIGASI": "NAVIGATION",
    "Katalog Unggulan": "Featured Catalog",
    "Kategori Pasokan": "Supply Categories",
    "Inspirasi Suasana Kamar": "Room Ambience Inspiration",
    "Standar Kualitas": "Quality Standards",
    "Kontak & Quotation": "Contact & Quotation",
    "Lokasi & Showroom": "Location & Showroom",
    "LINI PASOKAN": "SUPPLY LINE",
    "FASILITAS B2B": "B2B FACILITIES",
    "Mendukung faktur pajak resmi, dokumen kelayakan tender korporat, serta skema termin pembayaran PO.": "Supports official tax invoices, corporate tender eligibility documents, and PO payment term schemes.",
    "© 2026 DETASCO. Hak Cipta Dilindungi. Luxury Hotel & Hospitality Supplier.": "© 2026 DETASCO. All Rights Reserved. Luxury Hotel & Hospitality Supplier.",
    "Kebijakan Privasi": "Privacy Policy",
    "Syarat Pengadaan": "Procurement Terms",
    "Garansi Kualitas": "Quality Warranty",

    // ---- Lokasi & Showroom (index.html, rebuilt section without embedded maps) ----
    "JARINGAN LOGISTIK & SHOWROOM RESMI": "OFFICIAL LOGISTICS & SHOWROOM NETWORK",
    "LOKASI PERUSAHAAN & SHOWROOM": "COMPANY & SHOWROOM LOCATIONS",
    "Kunjungi fasilitas sentral pergudangan dan showroom kami untuk meninjau langsung tekstur linen, ketahanan amenities, serta simulasi mock-up tata ruang kamar hotel bersama spesialis teknis kami.": "Visit our central warehouse and showroom facilities to inspect linen texture, amenity durability, and hotel room mock-up simulations with our technical specialists.",
    "KANTOR PUSAT & PERGUDANGAN SENTRAL": "HEAD OFFICE & CENTRAL WAREHOUSE",
    "KANTOR PUSAT & SHOWROOM UTAMA": "HEAD OFFICE & MAIN SHOWROOM",
    "HUB DISTRIBUSI & SHOWROOM REGIONAL": "REGIONAL DISTRIBUTION HUB & SHOWROOM",
    "Showroom Buka": "Showroom Open",
    "Pusat inventori nasional, display room perlengkapan kamar hotel bintang 5, serta laboratorium pengujian benang linen & formula aroma amenities.": "National inventory hub, 5-star hotel room equipment showroom, and a testing lab for linen threads & amenity scent formulas.",
    "Pusat inventori nasional, galeri display perlengkapan kamar hotel & resor bintang 5, serta laboratorium pengujian benang linen dan formula amenities komersial.": "National inventory hub, 5-star hotel & resort room equipment gallery, plus a commercial testing lab for linen threads and amenity formulas.",
    "Pusat pasokan cepat dan showroom hotel & resort luxury untuk wilayah Bali, Lombok, dan Nusa Tenggara dengan buffer stock darurat tersedia.": "A rapid-supply hub and luxury hotel & resort showroom for Bali, Lombok, and Nusa Tenggara, with emergency buffer stock available.",
    "Alamat Fisik:": "Physical Address:",
    "Salin Alamat": "Copy Address",
    "Tersalin! ✓": "Copied! ✓",
    "Buka Google Maps": "Open Google Maps",
    "Jam Operasional Showroom:": "Showroom Operating Hours:",
    "Senin – Jumat: 08:30 – 17:30 WIB | Sabtu: 08:30 – 14:00 WIB (Minggu/Hari Libur Tutup)": "Mon – Fri: 08:30 – 17:30 WIB | Sat: 08:30 – 14:00 WIB (Closed Sun/Public Holidays)",
    "Senin – Sabtu: 09:00 – 18:00 WITA (Minggu Tutup)": "Mon – Sat: 09:00 – 18:00 WITA (Closed Sundays)",
    "Telepon & WhatsApp:": "Phone & WhatsApp:",
    "Fasilitas Kunjungan:": "Visit Facilities:",
    "Fasilitas Kunjungan Rekanan:": "Partner Visit Facilities:",
    "Ruang Mock-Up Kamar Hotel, Bedding Texture Gallery, Meja Uji Amenities, Area Parkir Truk & Kontainer": "Hotel Room Mock-Up Space, Bedding Texture Gallery, Amenities Testing Table, Truck & Container Parking Area",
    "Ruang Mock-Up Kamar Hotel, Bedding Texture Gallery, Meja Uji Formula Amenities, Area Parkir Truk & Kontainer": "Hotel Room Mock-Up Space, Bedding Texture Gallery, Amenities Formula Testing Bench, Truck & Container Parking Area",
    "Resort & Villa Linen Showcase, Scented Amenities Testing Bar, Buffer Stock Room, Area Parkir Tamu": "Resort & Villa Linen Showcase, Scented Amenities Testing Bar, Buffer Stock Room, Guest Parking Area",
    "Jadwalkan Kunjungan (Jakarta)": "Schedule a Visit (Jakarta)",
    "Jadwalkan Kunjungan (Bali)": "Schedule a Visit (Bali)",
    "Jadwalkan Kunjungan Showroom (WhatsApp)": "Schedule a Showroom Visit (WhatsApp)",
    "Jadwalkan Kunjungan & Mock-Up Sampel Bersama Tim Proyek": "Schedule a Visit & Sample Mock-Up With Our Project Team",
    "Dapatkan pendampingan langsung dari konsultan teknis hospitality DETASCO serta sampel gratis untuk diuji ketahanan dan kenyamanannya di properti hotel Anda.": "Get direct guidance from DETASCO's hospitality technical consultants, plus free samples to test for durability and comfort at your hotel property.",
    "Konsultasi Kunjungan Showroom": "Showroom Visit Consultation",

    // ---- Product Modal (shared labels) ----
    "Lini Kategori:": "Category Line:",
    "Kode Item / SKU:": "Item Code / SKU:",
    "Standar Kualitas:": "Quality Standard:",
    "Nama Produk": "Product Name",
    "Deskripsi lengkap produk perlengkapan hotel.": "Full description of the hotel equipment product.",
    "Tersedia Kustomisasi Bordir Logo / Emboss Foil Nama Hotel": "Custom Logo Embroidery / Hotel Name Foil Embossing Available",
    "Minta Penawaran Resmi via WhatsApp": "Request an Official Quote via WhatsApp",
    "Unduh Lembar Spesifikasi Teknis (PDF)": "Download Technical Spec Sheet (PDF)",
    "Kategori:": "Category:",
    "Kode SKU:": "SKU Code:",
    "Spesifikasi Komersial B2B": "B2B Commercial Specifications",
    "Kembali ke Katalog": "Back to Catalog",

    // ---- Floating WhatsApp ----
    "Chat Sales B2B": "Chat with B2B Sales",

    // ---- katalog.html: Top announcement bar ----
    "Solusi Pasokan & Pengadaan Resmi Hotel Bintang 4 & 5 Seluruh Indonesia": "Official Supply & Procurement Solutions for 4 & 5-Star Hotels Across Indonesia",
    "WhatsApp Resmi B2B": "Official B2B WhatsApp",

    // ---- katalog.html: Nav ----
    "Katalog Lengkap": "Full Catalog",
    "Aktif": "Active",
    "Inspirasi Kemewahan": "Luxury Inspiration",
    "Standar & Kualitas": "Standards & Quality",
    "Kontak & Penawaran": "Contact & Quotation",
    "Hubungi Tim Penjualan B2B": "Contact Our B2B Sales Team",

    // ---- katalog.html: Page header ----
    "Katalog Produk Lengkap": "Full Product Catalog",
    "PORTOFOLIO PENGADAAN LENGKAP": "FULL PROCUREMENT PORTFOLIO",
    "Jelajahi seluruh 20 koleksi pasokan esensial perhotelan bintang 4 & 5. Seluruh unit siap suplai dalam skala proyek baru, peremajaan kamar, maupun kontrak pasokan berkala dengan garansi mutu resmi.": "Explore all 20 essential 4 & 5-star hospitality supply collections. Every unit is ready to supply for new projects, room renovations, or periodic supply contracts with an official quality guarantee.",
    "Jelajahi seluruh 21 koleksi pasokan esensial perhotelan bintang 4 & 5. Seluruh unit siap suplai dalam skala proyek baru, peremajaan kamar, maupun kontrak pasokan berkala dengan garansi mutu resmi.": "Explore all 21 essential 4 & 5-star hospitality supply collections. Every unit is ready to supply for new projects, room renovations, or periodic supply contracts with an official quality guarantee.",
    "Total Koleksi": "Total Collections",
    "Produk B2B": "B2B Products",

    // ---- katalog.html: Toolbar ----
    "Cari nama produk, SKU, bahan...": "Search product name, SKU, material...",
    "Urutkan: Rekomendasi": "Sort: Recommended",
    "Rating Tertinggi": "Highest Rating",
    "Nama Produk (A-Z)": "Product Name (A-Z)",
    "Nama Produk (Z-A)": "Product Name (Z-A)",

    // ---- katalog.html: Results header / empty state ----
    "Menampilkan": "Showing",
    "dari": "of",
    "koleksi produk": "product collections",
    "Spesifikasi Komersial B2B Ready": "B2B-Ready Commercial Specifications",
    "Tidak Ditemukan Produk yang Cocok": "No Matching Products Found",
    "Pencarian Anda tidak membuahkan hasil. Coba kata kunci lain atau bersihkan filter untuk menampilkan seluruh koleksi.": "Your search returned no results. Try different keywords or clear the filters to show the full collection.",
    "Tampilkan Seluruh Koleksi (20)": "Show Full Collection (20)",
    "Tampilkan Seluruh Koleksi (21)": "Show Full Collection (21)",

    // ---- katalog.html: Wholesale banner ----
    "KUSTOMISASI & PROYEK BARU": "CUSTOMIZATION & NEW PROJECTS",
    "Memerlukan Bordir Logo atau Spesifikasi Ukuran Khusus?": "Need Logo Embroidery or Custom Size Specifications?",
    "Tim spesifikasi teknis DETASCO melayani pesanan khusus (OEM/ODM), formulasi *signature scent* amenities, hingga cetak jacquard tenun khusus untuk memperkuat identitas brand hotel Anda.": "DETASCO's technical specification team handles custom orders (OEM/ODM), signature-scent amenity formulation, and custom jacquard weave printing to strengthen your hotel's brand identity.",
    "Konsultasi Kustomisasi": "Customization Consultation",
    "Formulir Penawaran": "Quotation Form",

    // ---- katalog.html: Footer ----
    "Mitra strategis terpercaya pengadaan perlengkapan komersial hotel, resor mewah, serviced apartment, dan rumah sakit kelas atas di seluruh Indonesia.": "A trusted strategic partner for commercial procurement of hotels, luxury resorts, serviced apartments, and upscale hospitals across Indonesia.",
    "Navigasi Cepat": "Quick Navigation",
    "Seluruh Katalog Produk (20)": "Full Product Catalog (20)",
    "Seluruh Katalog Produk (21)": "Full Product Catalog (21)",
    "Kategori Pasokan Utama": "Core Supply Categories",
    "Standar & SLA Pasokan": "Supply Standards & SLA",
    "Permintaan Penawaran Harga": "Price Quote Request",
    "Lokasi Showroom & Kantor": "Showroom & Office Location",
    "Lini Produk": "Product Line",
    "Handuk Hotel 650 GSM": "Hotel Towels 650 GSM",
    "Lihat 20+ Produk Selengkapnya →": "View 20+ More Products →",
    "Lihat 21+ Produk Selengkapnya →": "View 21+ More Products →",
    "Kantor & Showroom": "Office & Showroom",
    "Sentral Jakarta:": "Jakarta Central:",
    "Hub Distribusi Bali:": "Bali Distribution Hub:",

    // ---- linen.html / amenities.html / gorden.html / towel.html: shared dedicated-page strings ----
    "Lini Pasokan": "Supply Line",
    "Butuh Spesifikasi Khusus?": "Need Custom Specifications?",
    "Konsultasi via WhatsApp": "Consult via WhatsApp",
    "Aman untuk kulit sensitif": "Safe for sensitive skin",

    // ---- linen.html ----
    "Linen & Bedding Hotel Bintang 5": "5-Star Hotel Linen & Bedding",
    "Tingkatkan kenyamanan tamu dengan linen hotel berkualitas tinggi lembut, tahan lama, dan elegan. Tersedia dalam berbagai ukuran dan warna, cocok untuk hotel bintang 3 hingga 5. Bisa custom dengan logo hotel Anda untuk tampilan yang lebih eksklusif.": "Elevate guest comfort with premium hotel linen that's soft, durable, and elegant. Available in a wide range of sizes and colors, suitable for 3- to 5-star hotels. Can be customized with your hotel's logo for an even more exclusive look.",
    "Minta Penawaran Linen": "Request Linen Quote",
    "Bahan Premium": "Premium Materials",
    "Combed cotton pilihan, tahan cuci industri & suhu sterilisasi tinggi.": "Select combed cotton, resistant to industrial washing & high sterilization temperatures.",
    "Custom Ukuran & Warna": "Custom Size & Color",
    "Single, Queen, King, Super King — warna disesuaikan brand hotel Anda.": "Single, Queen, King, Super King — colors tailored to your hotel brand.",
    "Bordir Logo Hotel": "Hotel Logo Embroidery",
    "Opsi bordir logo di sudut sprei, sarung bantal, hingga bathrobe.": "Logo embroidery option on sheet corners, pillowcases, and bathrobes.",
    "MOQ Fleksibel": "Flexible MOQ",
    "Mendukung proyek pre-opening baru maupun replenishment rutin.": "Supports new pre-opening projects as well as routine replenishment.",
    "Karet elastis di empat sudut, pas membungkus kasur tanpa melorot": "Elastic band on all four corners, fits snugly around the mattress without slipping",
    "Permukaan rata bebas kerutan untuk tampilan kamar yang rapi": "Smooth, wrinkle-free surface for a neat room appearance",
    "Bahan combed cotton breathable, nyaman sepanjang malam": "Breathable combed cotton fabric, comfortable all night long",
    "Tahan dicuci suhu tinggi & deterjen laundry industri hotel": "Withstands high-temperature washing & industrial hotel laundry detergents",
    "Permukaan sprei atas yang halus dan lembut di kulit": "Smooth top sheet surface that's gentle on the skin",
    "Mudah diselipkan rapi di bawah kasur (hospital corner)": "Easy to tuck neatly under the mattress (hospital corner)",
    "Finishing presisi ala hotel bintang 5": "Precision finishing in true 5-star hotel style",
    "Warna tetap cerah meski dicuci berulang kali": "Colors stay vibrant even after repeated washing",
    "Lapisan dekoratif teratas yang mempercantik tampilan kamar": "Top decorative layer that enhances the room's appearance",
    "Mudah dirapikan dan disusun di atas kasur": "Easy to tidy and arrange on the bed",
    "Tampilan senada dengan konsep interior kamar hotel": "Matches the hotel room's interior concept",
    "Bahan tahan noda dan nyaman disentuh": "Stain-resistant fabric that's comfortable to the touch",
    "Sarung duvet 100% katun, bisa dilepas-pasang dan dicuci": "100% cotton duvet cover, removable and washable",
    "Resleting tersembunyi, memudahkan ganti isian duvet": "Hidden zipper for easy duvet insert changes",
    "Melindungi inner duvet dari debu dan kotoran": "Protects the inner duvet from dust and dirt",
    "Warna netral & elegan, serasi dengan palet kamar": "Neutral, elegant colors that complement the room's palette",
    "Mudah dilepas dan dicuci rutin oleh housekeeping": "Easy to remove and wash routinely by housekeeping",
    "Isian empuk yang menghangatkan namun tetap breathable": "Soft, warming fill that stays breathable",
    "Bahan hipoalergenik, aman untuk kulit sensitif": "Hypoallergenic material, safe for sensitive skin",
    "Mempertahankan bentuk & ketebalan meski sering dicuci": "Retains its shape & thickness even with frequent washing",
    "Ringan digunakan di berbagai musim": "Lightweight for use across all seasons",
    "Menutupi rangka dan kaki kasur agar tampilan kamar lebih rapi": "Covers the bed frame and legs for a neater room appearance",
    "Karet elastis atau tali pengikat yang mudah dipasang": "Elastic band or ties that are easy to install",
    "Memberi kesan tailored dan mewah pada tempat tidur": "Gives the bed a tailored, luxurious look",
    "Tersedia custom ukuran sesuai tinggi kasur": "Available in custom sizes to match mattress height",
    "Aksen dekoratif melintang di ujung kasur untuk sentuhan mewah": "Decorative accent across the foot of the bed for a touch of luxury",
    "Tekstur dan warna kontras yang mempercantik tampilan bed cover": "Contrasting texture and color that enhance the bed cover's look",
    "Mudah diganti mengikuti tema musiman kamar": "Easy to swap to follow the room's seasonal theme",
    "Bisa custom bordir logo hotel Anda": "Can be custom-embroidered with your hotel logo",
    "Permukaan lembut yang nyaman menyentuh wajah": "Soft surface that's comfortable against the face",
    "Resleting tersembunyi untuk bantal yang rapi dan aman": "Hidden zipper for a neat, secure pillow",
    "Tersedia ukuran standard, queen, dan king": "Available in standard, queen, and king sizes",
    "Warna putih bersih khas hotel atau custom sesuai brand": "Classic hotel-clean white or custom colors to match your brand",
    "Mudah dipadukan dengan segala jenis tema hotel": "Easy to pair with any hotel theme",
    "Isian empuk namun tetap menopang kepala dan leher": "Soft fill that still supports the head and neck",
    "Bentuk bolster klasik khas hotel bintang 5": "Classic bolster shape typical of 5-star hotels",
    "Kombinasi bantal tidur dan bantal dekoratif dalam satu set": "A combination of sleeping pillows and decorative pillows in one set",
    "Tahan lama meski dipakai dan dicuci rutin": "Durable even with regular use and washing",
    "Lapisan penghangat yang ringan dan nyaman": "A lightweight, comfortable warming layer",
    "Tekstur rajut atau tenun yang lembut di kulit": "Knitted or woven texture that's soft on the skin",
    "Mudah dirawat dan cepat kering setelah dicuci": "Easy to care for and quick-drying after washing",
    "Praktis dilipat dan disimpan saat tidak digunakan": "Convenient to fold and store when not in use",
    "Matras Protector": "Mattress Protector",
    "Lapisan pelindung anti air yang tetap breathable": "Waterproof protective layer that stays breathable",
    "Melindungi kasur dari noda, keringat, dan alergen": "Protects the mattress from stains, sweat, and allergens",
    "Material senyap, tidak berisik saat digunakan": "Quiet material, noiseless during use",
    "Karet elastis di sekeliling agar pas di semua sisi kasur": "Elastic band all around for a snug fit on every side of the mattress",
    "Bahan ekstra lembut dan hipoalergenik untuk kulit bayi": "Extra-soft, hypoallergenic fabric for baby's skin",
    "Ukuran pas untuk boks/tempat tidur bayi di kamar hotel": "Perfect fit for a hotel room crib/baby bed",
    "Mudah dicuci dan cepat kering untuk pergantian rutin": "Easy to wash and quick-drying for routine changes",
    "Warna ceria dan netral, cocok untuk bayi perempuan maupun laki-laki": "Cheerful, neutral colors suitable for both baby girls and boys",
    "Memberi kesan hangat dan aman bagi tamu yang membawa bayi": "Gives a warm, safe feeling for guests traveling with a baby",
    "Pesan Sekarang!": "Order Now!",
    "Konsultasikan Kebutuhan Linen Hotel Anda": "Discuss Your Hotel Linen Needs",

    // ---- amenities.html ----
    "Amenities Hotel Premium": "Premium Hotel Amenities",
    "Ciptakan kesan pertama yang berkesan dengan amenities hotel yang tampil bersih, wangi, dan premium. Kami menyediakan paket sabun, sampo, sikat gigi, shower cap, hingga sandal hotel — bisa custom packaging sesuai branding hotel Anda.": "Make a lasting first impression with hotel amenities that look clean, fragrant, and premium. We supply soap, shampoo, toothbrush, shower cap, and hotel slipper sets — with custom packaging available to match your hotel's branding.",
    "Minta Penawaran Amenities": "Request Amenities Quote",
    "Kemasan Custom Branding": "Custom Branding Packaging",
    "Logo & warna hotel di setiap kemasan, hot foil stamp emas/hitam.": "Hotel logo & colors on every package, gold/black hot foil stamping.",
    "Formula Aman di Kulit": "Skin-Safe Formula",
    "Bahan nabati lembut, cocok untuk kulit sensitif tamu hotel.": "Gentle plant-based ingredients, suitable for guests' sensitive skin.",
    "Opsi Ramah Lingkungan": "Eco-Friendly Options",
    "Gagang jerami gandum biodegradable, kemasan kraft daur ulang.": "Biodegradable wheat-straw handles, recycled kraft packaging.",
    "Paket Lengkap": "Complete Package",
    "Satu kali order untuk seluruh kebutuhan amenities kamar.": "One order covers all your room amenity needs.",
    "Shampo": "Shampoo",
    "Material lembut dan nyaman": "Soft and comfortable material",
    "Anti slip dan aman": "Anti-slip and safe",
    "Menambah estetika hotel": "Enhances hotel aesthetics",
    "Bisa custom bordir logo": "Custom logo embroidery available",
    "Halus & cocok untuk kulit sensitif": "Gentle & suitable for sensitive skin",
    "Aroma relaksasi ala spa": "Spa-like relaxing fragrance",
    "Busa yang lembut di kulit": "Soft, skin-gentle lather",
    "Desain estetis dan elegan": "Elegant, aesthetic design",
    "Aroma mewah dan lembut": "Luxurious, gentle fragrance",
    "Memberikan kesegaran pada rambut": "Leaves hair feeling fresh",
    "Wangi dan tidak merusak rambut": "Fragrant and gentle on hair",
    "Desain ergonomis": "Ergonomic design",
    "Bulu sikat lembut & nyaman": "Soft, comfortable bristles",
    "Melindungi gigi dan gusi dari iritasi": "Protects teeth and gums from irritation",
    "Menjaga napas tetap segar": "Keeps breath fresh",
    "Melembutkan & menutrisi rambut": "Softens & nourishes hair",
    "Memudahkan penataan rambut": "Makes hair easier to style",
    "Formula lembut tanpa bahan keras": "Gentle formula, free of harsh ingredients",
    "Aroma segar tahan lama": "Long-lasting fresh fragrance",
    "Bahan tahan air berkualitas": "Quality water-resistant material",
    "Elastis dan pas di kepala": "Elastic, snug fit on the head",
    "Desain praktis sekali pakai": "Practical single-use design",
    "Melindungi rambut tetap kering": "Keeps hair dry",
    "Kapas lembut & higienis": "Soft, hygienic cotton",
    "Kemasan praktis sekali pakai": "Practical single-use packaging",
    "Tangkai kokoh tidak mudah patah": "Sturdy, break-resistant stem",
    "Gigi sisir halus anti patah rambut": "Fine teeth that prevent hair breakage",
    "Ergonomis & nyaman digenggam": "Ergonomic and comfortable grip",
    "Material ringan berkualitas": "Lightweight, quality material",
    "Bisa custom logo hotel": "Custom hotel logo available",
    "Konsultasikan Kebutuhan Amenities Hotel Anda": "Consult Us About Your Hotel Amenities Needs",

    // ---- gorden.html ----
    "Gorden Hotel Elegan": "Elegant Hotel Curtains",
    "Minta Penawaran Gorden": "Request Curtain Quote",
    "Blackout, Sheer & Kombinasi": "Blackout, Sheer & Combination",
    "Pilih tingkat kegelapan sesuai kebutuhan ruang tamu.": "Choose the darkness level to suit your guest room needs.",
    "Bahan Tahan Lama": "Durable Materials",
    "Kain pilihan, mudah dirawat, dan tahan luntur warna.": "Selected fabrics, easy to maintain, and fade-resistant.",
    "Custom Warna & Motif": "Custom Colors & Patterns",
    "Disesuaikan dengan interior dan identitas brand hotel.": "Tailored to your hotel's interior and brand identity.",
    "Ukur & Pasang di Lokasi": "On-Site Measuring & Installation",
    "Tim teknis dapat survei langsung untuk proyek skala besar.": "Our technical team can conduct on-site surveys for large-scale projects.",
    "All-In Gorden Solution": "All-In Curtain Solution",
    "Karena gorden dibuat sesuai ukuran & interior tiap properti, spesifikasi lengkap dan harga diberikan setelah konsultasi.": "Because curtains are made to the size and interior of each property, full specifications and pricing are provided after consultation.",
    "Tidur nyenyak tanpa gangguan cahaya": "Sleep soundly without light disturbance",
    "Membantu menjaga suhu ruangan tetap sejuk": "Helps keep the room temperature cool",
    "Terbuat dari bahan premium yang tahan lama": "Made from durable premium materials",
    "Praktis diatur naik-turun sesuai kebutuhan cahaya": "Conveniently raised and lowered to suit lighting needs",
    "Desain ringkas yang cocok untuk ruangan kecil": "Compact design suited for smaller rooms",
    "Memberikan kesan elegan & modern": "Creates an elegant & modern look",
    "Tahan debu & noda": "Dust & stain resistant",
    "Mudah mengatur intensitas cahaya": "Easy to adjust light intensity",
    "Perawatannya cukup mudah": "Easy to maintain",
    "Anti Darah": "Blood-Resistant Curtain",
    "Permukaan anti-noda yang menolak darah & cairan tubuh": "Stain-resistant surface that repels blood & bodily fluids",
    "Tidak mudah rusak meski sering dicuci": "Durable even with frequent washing",
    "Ideal untuk ruang rawat dengan standar kebersihan tinggi": "Ideal for patient rooms with high hygiene standards",
    "Menyaring cahaya matahari secara lembut": "Softly filters sunlight",
    "Menjaga privasi tanpa membuat ruangan gelap": "Maintains privacy without darkening the room",
    "Tampilan ringan & elegan untuk interior hotel": "Light & elegant look for hotel interiors",
    "Mudah digeser & dibuka-tutup": "Easy to slide open & closed",
    "Lipatan kain jatuh rapi secara alami": "Fabric folds fall naturally neat",
    "Tampilan modern, cocok untuk lobby & kamar": "Modern look, suited for lobbies & guest rooms",
    "Lipatan gelombang halus & konsisten": "Smooth & consistent wave folds",
    "Memberi kesan mewah dan rapi": "Creates a luxurious and neat impression",
    "Cocok untuk jendela besar di area lobby": "Suited for large windows in lobby areas",
    "Bahan tahan air & anti jamur": "Water-resistant & anti-mold material",
    "Mudah dibersihkan dan cepat kering": "Easy to clean and quick-drying",
    "Menjaga area kamar mandi tetap higienis": "Keeps the bathroom area hygienic",
    "Butuh Ukuran & Model Khusus?": "Need a Custom Size & Model?",
    "Konsultasikan Kebutuhan Gorden Hotel Anda": "Consult Your Hotel Curtain Needs",

    // ---- towel.html ----
    "Handuk Hotel Premium": "Premium Hotel Towels",
    "Minta Penawaran Handuk": "Request a Towel Quote",
    "Gramasi Tebal": "Heavyweight GSM",
    "600–700 GSM, terasa mewah dan tahan lama meski dicuci berulang.": "600–700 GSM, feels luxurious and stays durable even after repeated washing.",
    "Daya Serap Tinggi": "High Absorbency",
    "Menyerap air dalam hitungan detik, cepat kering antar pemakaian.": "Absorbs water within seconds and dries quickly between uses.",
    "Bordir Nama/Logo": "Name/Logo Embroidery",
    "Personalisasi dengan nama hotel atau logo brand Anda.": "Personalize with your hotel's name or brand logo.",
    "Varian Lengkap": "Complete Range",
    "Bath, hand, face, hingga pool towel tersedia dalam satu order.": "Bath, hand, face, and pool towels all available in a single order.",
    "Lembut & halus di kulit": "Soft and gentle on skin",
    "Cepat menyerap air": "Quickly absorbs water",
    "Tahan lama & anti-kuman": "Durable and antibacterial",
    "Terbuat dari katun tebal": "Made from thick cotton",
    "Ukuran extra (custom)": "Extra size (customizable)",
    "Bahan halus & lembut": "Smooth and soft material",
    "Cepat kering dan mudah dicuci": "Dries quickly and easy to wash",
    "Warna tidak mudah pudar": "Color resists fading",
    "Mudah digantung dan dilipat rapi": "Easy to hang and fold neatly",
    "Cocok untuk tangan, wajah, dan dekorasi": "Suitable for hands, face, and decoration",
    "Banyak variasi model, bahan, dan ukuran": "Wide variety of styles, materials, and sizes",
    "Bahan 100% katun lembut, aman untuk kulit wajah sensitif": "100% soft cotton material, safe for sensitive facial skin",
    "Ukuran kecil dan ringkas, mudah digenggam": "Small and compact size, easy to hold",
    "Menyerap sisa air & krim wajah tanpa menggores kulit": "Absorbs leftover water and facial cream without scratching the skin",
    "Warna netral & elegan, cocok untuk interior kamar mana pun": "Neutral, elegant color that suits any room interior",
    "Praktis digunakan dan mudah disimpan di rak kecil": "Practical to use and easy to store on a small shelf",
    "Alas anti-slip untuk keamanan ekstra di lantai basah": "Anti-slip base for extra safety on wet floors",
    "Bulu lembut namun kuat menyerap tetesan air dari kaki": "Soft pile that effectively absorbs water drips from feet",
    "Cepat kering sehingga lantai kamar mandi tetap higienis": "Dries quickly, keeping the bathroom floor hygienic",
    "Tahan lama dan tidak mudah kusut meski sering diinjak": "Durable and resists matting even with frequent use",
    "Ukuran jumbo, cukup untuk membalut tubuh secara penuh": "Jumbo size, large enough to wrap the entire body",
    "Nyaman digunakan sebagai pelapis usai mandi atau spa": "Comfortable to use as a wrap after bathing or spa treatments",
    "Bahan tebal dan lembut, menyerap air lebih banyak dalam sekali usap": "Thick, soft material that absorbs more water in a single wipe",
    "Cocok untuk kebutuhan hotel bintang lima & layanan spa premium": "Ideal for five-star hotel needs and premium spa services",
    "Handuk gulung kecil untuk ritual sambutan tamu yang berkesan": "Small rolled towel for a memorable guest welcome ritual",
    "Dapat disajikan hangat maupun dingin sesuai kebutuhan": "Can be served warm or cold as needed",
    "Higienis & praktis, sekali pakai untuk setiap tamu": "Hygienic and practical, single-use for each guest",
    "Bahan lembut, halus, dan tahan lama (premium)": "Soft, smooth, and durable (premium) material",
    "Daya serap air tinggi": "High water absorbency",
    "Tebal & anti-bakteri": "Thick and antibacterial",
    "Konsultasikan Kebutuhan Handuk Hotel Anda": "Consult on Your Hotel Towel Needs",

    // ---- hospital.html ----
    "Rumah Sakit": "Hospital",
    "Perlengkapan Rumah Sakit": "Hospital Supplies",
    "DETASCO menyediakan lini lengkap tekstil dan seragam medis untuk rumah sakit, klinik, dan fasilitas kesehatan: mulai dari linen medis, gorden anti darah, hingga baju pasien dan scrub suit. Seluruh produk dipilih dari bahan yang higienis, mudah disterilkan, dan tahan pencucian suhu tinggi sesuai standar rumah sakit. Kami juga melayani custom ukuran dan jumlah sesuai kebutuhan instansi kesehatan Anda.": "DETASCO provides a complete line of medical textiles and uniforms for hospitals, clinics, and healthcare facilities: from medical linen and blood-resistant curtains to patient gowns and scrub suits. Every product is made from hygienic materials that are easy to sterilize and withstand high-temperature washing to hospital standards. We also offer custom sizes and quantities to match your healthcare institution's needs.",
    "Minta Penawaran Rumah Sakit": "Request Hospital Supply Quote",
    "Bahan Antimikroba & Mudah Disterilkan": "Antimicrobial & Easy-to-Sterilize Material",
    "Serat tekstil higienis yang menghambat pertumbuhan bakteri dan siap melalui proses sterilisasi rutin.": "Hygienic textile fibers that inhibit bacterial growth and are ready for routine sterilization.",
    "Tahan Cuci Suhu Tinggi": "High-Temperature Wash Resistant",
    "Mampu dicuci berulang dengan suhu tinggi dan cairan disinfektan tanpa mudah rusak atau pudar.": "Withstands repeated high-temperature washing and disinfectant fluids without easily wearing out or fading.",
    "Custom Ukuran RS & Klinik": "Custom Hospital & Clinic Sizing",
    "Sprei, gorden, hingga seragam dapat disesuaikan dengan ukuran dan kebutuhan fasilitas Anda.": "Sheets, curtains, and uniforms can be tailored to your facility's size and needs.",
    "Kepatuhan Standar Rumah Sakit": "Hospital Standards Compliance",
    "Diproduksi mengikuti standar kebersihan dan keselamatan yang berlaku di lingkungan kesehatan.": "Manufactured to meet the hygiene and safety standards required in healthcare settings.",
    "Sprei Rumah Sakit": "Hospital Bed Sheet",
    "Bahan katun berkualitas, nyaman dan tidak panas untuk pasien": "Quality cotton fabric, comfortable and cool for patients",
    "Tahan pencucian suhu tinggi dan cairan disinfektan rumah sakit": "Withstands high-temperature washing and hospital disinfectants",
    "Warna putih bersih yang memudahkan deteksi noda": "Clean white color that makes stains easy to spot",
    "Tersedia dalam ukuran standar ranjang rumah sakit": "Available in standard hospital bed sizes",
    "Selimut Pasien": "Patient Blanket",
    "Bahan hangat namun ringan, nyaman dipakai dalam waktu lama": "Warm yet lightweight fabric, comfortable for extended use",
    "Mudah dicuci berulang tanpa mengubah tekstur kain": "Easy to wash repeatedly without changing the fabric's texture",
    "Tidak mudah berbulu meski melalui pencucian rumah sakit": "Resists pilling even through hospital laundering",
    "Tersedia pilihan warna sesuai identitas ruang rawat": "Available in colors to match your ward's identity",
    "Gorden Medis Anti Darah": "Blood-Resistant Medical Curtain",
    "Bahan non-woven yang menolak rembesan darah & cairan tubuh": "Non-woven fabric that resists blood & bodily fluid seepage",
    "Menjaga privasi pasien di setiap bilik ruang rawat": "Maintains patient privacy in every ward cubicle",
    "Mudah dibersihkan dan tahan terhadap paparan cairan medis": "Easy to clean and resistant to medical fluid exposure",
    "Tersedia ukuran custom sesuai bilik atau ruang rawat": "Available in custom sizes for any cubicle or ward",
    "Baju Pasien": "Patient Gown",
    "Potongan longgar dengan bukaan praktis untuk memudahkan perawatan": "Loose cut with practical openings for easier patient care",
    "Bahan lembut dan menyerap keringat, nyaman untuk pasien rawat inap": "Soft, sweat-absorbent fabric, comfortable for inpatients",
    "Tahan pencucian berulang tanpa mudah luntur atau menyusut": "Withstands repeated washing without fading or shrinking easily",
    "Tersedia berbagai ukuran untuk pasien dewasa dan anak": "Available in various sizes for adult and child patients",
    "Baju Medis / Scrub Suit": "Medical Wear / Scrub Suit",
    "Desain praktis dengan saku fungsional untuk alat medis": "Practical design with functional pockets for medical tools",
    "Bahan ringan dan sejuk, nyaman dipakai sepanjang shift kerja": "Lightweight, breathable fabric, comfortable for an entire shift",
    "Tahan terhadap pencucian suhu tinggi dan cairan disinfektan": "Resistant to high-temperature washing and disinfectant fluids",
    "Tersedia berbagai warna untuk membedakan unit kerja": "Available in various colors to distinguish work units",
    "Jas Lab Dokter": "Doctor's Lab Coat",
    "Bahan katun-polyester yang rapi dan tidak mudah kusut": "Neat cotton-polyester fabric that resists wrinkling",
    "Potongan formal dengan saku depan untuk alat tulis dan stetoskop": "Formal cut with front pockets for pens and a stethoscope",
    "Warna putih bersih yang mencerminkan profesionalisme medis": "Clean white color that reflects medical professionalism",
    "Tahan lama meski dicuci dan disetrika berulang kali": "Durable even with repeated washing and ironing",
    "Perlak Alas Pasien": "Waterproof Patient Bed Pad",
    "Lapisan anti bocor yang melindungi kasur dari cairan tubuh": "Leak-proof layer that protects the mattress from bodily fluids",
    "Permukaan lembut yang aman untuk kulit sensitif pasien": "Soft surface that's safe for patients' sensitive skin",
    "Mudah dibersihkan dan cepat kering setelah dicuci": "Easy to clean and quick-drying after washing",
    "Tersedia ukuran yang menyesuaikan ranjang pasien maupun bayi": "Available in sizes to fit both patient and infant beds",
    "Tas Kemasan Obat": "Medicine Packaging Bag",
    "Bahan plastik food-grade yang aman untuk kemasan obat": "Food-grade plastic material safe for medicine packaging",
    "Segel rapat menjaga kebersihan dan keamanan obat pasien": "Tight seal keeps patient medication clean and secure",
    "Transparan sehingga isi kemasan mudah diperiksa": "Transparent design makes contents easy to inspect",
    "Tersedia berbagai ukuran sesuai kebutuhan farmasi rumah sakit": "Available in various sizes to suit hospital pharmacy needs",
    "Konsultasikan Kebutuhan Rumah Sakit Anda": "Consult Your Hospital Needs",

    // ---- Overhauled Subcategories (M1 Amenities, M2 Gorden, M3 Towels, M0 Linen) ----
    // Subpage Page Titles & Headings
    "Linen & Bedding Hotel Bintang 5 | DETASCO": "5-Star Hotel Linen & Bedding | DETASCO",
    "Handuk Hotel Premium | DETASCO": "5-Star Hotel Towels & Bathrobes | DETASCO",
    "Amenities Hotel Premium | DETASCO": "5-Star Hotel Guest Amenities | DETASCO",
    "Gorden Hotel Elegan | DETASCO": "Hotel Curtains & Window Treatments | DETASCO",
    "ALL-IN LINEN SOLUTION": "ALL-IN LINEN SOLUTION",
    "#1 Best Quality | 100% Cotton": "#1 Best Quality | 100% Cotton",
    "ALL-IN TOWEL & BATHROBE SOLUTION": "ALL-IN TOWEL & BATHROBE SOLUTION",
    "#1 Best Quality | 100% Combed Cotton": "#1 Best Quality | 100% Combed Cotton",
    "ALL-IN AMENITIES SOLUTION": "ALL-IN AMENITIES SOLUTION",
    "ALL-IN GUEST AMENITIES SOLUTION": "ALL-IN GUEST AMENITIES SOLUTION",
    "#1 Best Quality | BPOM & Eco-Friendly": "#1 Best Quality | BPOM & Eco-Friendly",
    "#1 Eco-Luxury & Certified Standard | Zero-Waste Options": "#1 Eco-Luxury & Certified Standard | Zero-Waste Options",
    "ALL-IN CURTAINS & DRAPERY SOLUTION": "ALL-IN CURTAINS & DRAPERY SOLUTION",
    "ALL-IN WINDOW TREATMENT SOLUTION": "ALL-IN WINDOW TREATMENT SOLUTION",
    "#1 Best Quality | Flame-Retardant & Blackout": "#1 Best Quality | Flame-Retardant & Blackout",
    "#1 100% Blackout | Flame-Retardant & Acoustic Hotel Standard": "#1 100% Blackout | Flame-Retardant & Acoustic Hotel Standard",
    "Smooth & Soft Towel | 100% Cotton": "Smooth & Soft Towel | 100% Cotton",
    "No.1 The Best Hotel": "No.1 The Best Hotel",
    "Minta Penawaran": "Request Quote",
    "Minta Penawaran →": "Request Quote →",

    // Subpage 4-Pillar Features
    "Bahan Premium": "Premium Materials",
    "Combed cotton pilihan, tahan cuci industri & suhu sterilisasi tinggi.": "Selected combed cotton, resistant to industrial washing & high sterilization temperatures.",
    "Custom Ukuran & Warna": "Custom Sizes & Colors",
    "Single, Queen, King, Super King — warna disesuaikan brand hotel Anda.": "Single, Queen, King, Super King — colors tailored to your hotel brand.",
    "Bordir Logo Hotel": "Hotel Logo Embroidery",
    "Opsi bordir logo di sudut sprei, sarung bantal, hingga bathrobe.": "Logo embroidery options on sheet corners, pillowcases, and bathrobes.",
    "MOQ Fleksibel": "Flexible MOQ",
    "Mendukung proyek pre-opening baru maupun replenishment rutin.": "Supports new pre-opening projects as well as regular replenishment.",
    "Gramasi Tebal": "Heavyweight GSM",
    "600–700 GSM, terasa mewah dan tahan lama meski dicuci berulang.": "600–700 GSM, feels luxurious and lasts through repeated laundering.",
    "Daya Serap Tinggi": "Superior Absorption",
    "Menyerap air dalam hitungan detik, cepat kering antar pemakaian.": "Absorbs water in seconds, dries quickly between guest uses.",
    "Bordir Nama/Logo": "Name/Logo Embroidery",
    "Personalisasi dengan nama hotel atau logo brand Anda.": "Personalization with your hotel name or brand logo.",
    "Varian Lengkap": "Complete Variants",
    "Bath, hand, face, hingga pool towel tersedia dalam satu order.": "Bath, hand, face, to pool towels available in a single order.",
    "Kemasan Custom Branding": "Custom Branding Packaging",
    "Bisa cetak logo hotel pada kemasan sachet, tube, maupun kotak kraft.": "Hotel logo printing available on sachets, tubes, and kraft boxes.",
    "Formula Aman di Kulit": "Safe Skin Formula",
    "Bahan alami berkualitas, wangi tahan lama, dan tidak menyebabkan iritasi.": "Quality natural ingredients, long-lasting fragrance, non-irritating.",
    "Opsi Ramah Lingkungan": "Eco-Friendly Options",
    "Gagang jerami gandum biodegradable, kemasan kraft daur ulang.": "Biodegradable wheat straw handles, recycled kraft packaging.",
    "Paket Lengkap": "Complete Package",
    "Satu kali order untuk seluruh kebutuhan amenities kamar.": "A single order for all in-room guest amenity needs.",
    "Blackout, Sheer & Kombinasi": "Blackout, Sheer & Combination",
    "Pilih tingkat kegelapan sesuai kebutuhan ruang tamu.": "Choose light blockage levels suited to guest room needs.",
    "Bahan Tahan Lama": "Durable Materials",
    "Kain pilihan, mudah dirawat, dan tahan luntur warna.": "Selected fabrics, easy to care for, and fade resistant.",
    "Custom Warna & Motif": "Custom Colors & Patterns",
    "Disesuaikan dengan interior dan identitas brand hotel.": "Tailored to interior themes and hotel brand identity.",
    "Ukur & Pasang di Lokasi": "On-Site Measurement & Installation",
    "Tim teknis dapat survei langsung untuk proyek skala besar.": "Technical team can survey on-site for large-scale projects.",

    // Linen Product Catalog (12 Products & Bullets)
    "Fitted Sheet": "Fitted Sheet",
    "Flat Sheet": "Flat Sheet",
    "Bed Cover": "Bed Cover",
    "Quilt Cover": "Quilt Cover",
    "Inner Duvet": "Inner Duvet",
    "Bed Skirt": "Bed Skirt",
    "Bed Runner": "Bed Runner",
    "Pillow Cover": "Pillow Cover",
    "Pillow & Bolster": "Pillow & Bolster",
    "Blanket": "Blanket",
    "Matras Protector": "Mattress Protector",
    "Bed Cover Baby": "Baby Bed Cover",
    "Lembut & halus di kulit": "Soft & gentle on skin",
    "Cepat menyerap air": "Rapid water absorption",
    "Tahan lama & anti-kuman": "Durable & anti-microbial",
    "Terbuat dari katun tebal": "Crafted from heavyweight cotton",
    "Ukuran extra (custom)": "Extra (custom) dimensions",
    "Bahan halus & lembut": "Delicate & smooth fabric",
    "Cepat kering dan mudah dicuci": "Fast-drying and easy to launder",
    "Warna tidak mudah pudar": "Fade-resistant colorfastness",
    "Mudah digantung dan dilipat rapi": "Easy to hang and fold neatly",
    "Cocok untuk tangan, wajah, dan dekorasi": "Suitable for hands, face, and decor",
    "Banyak variasi model, bahan, dan ukuran": "Wide variety of models, fabrics, and sizes",
    "Bahan 100% Katun": "100% Cotton Fabric",
    "Lebih lembut untuk kulit sensitif": "Softer for sensitive skin",
    "Ukuran ideal & praktis": "Ideal & practical size",
    "Warna netral & elegan": "Neutral & elegant colors",
    "Mudah digunakan dan disimpan": "Easy to use and store",
    "Lembut di kulit, memberi kesan eksklusif": "Soft on skin, provides an exclusive impression",
    "Higienis & praktis": "Hygienic & practical",
    "Cocok untuk segala jenis cuaca (panas/ dingin)": "Suitable for all weather conditions (hot/cold)",
    "Bisa bordir logo Anda": "Custom logo embroidery available",
    "Bahan lembut, halus, dan tahan lama (premium)": "Soft, delicate, and durable (premium) fabric",
    "Daya serap air tinggi": "High moisture absorbency",
    "Tebal & Anti-bakteri": "Thick & Antibacterial",
    "Ukuran universal (unisex)": "Universal unisex sizing",
    "Mudah dipadukan dengan segala jenis tema hotel": "Easily paired with any hotel interior theme",

    // Amenities Product Catalog (12 Products & Bullets)
    "Eco Dental Kit (Wheat Straw)": "Eco Dental Kit (Wheat Straw)",
    "Botanical Guest Soap 30g": "Botanical Guest Soap 30g",
    "Liquid Wall Dispenser 300ml": "Liquid Wall Dispenser 300ml",
    "Hotel Slippers Waffle 8mm EVA": "Hotel Slippers Waffle 8mm EVA",
    "Luxury Vanity Kit": "Luxury Vanity Kit",
    "Precision Shaving Kit": "Precision Shaving Kit",
    "Aromatherapy Bath Salt 50g": "Aromatherapy Bath Salt 50g",
    "Biodegradable Shower Cap": "Biodegradable Shower Cap",
    "Hygiene Sanitary Bag": "Hygiene Sanitary Bag",
    "Fabric Laundry Bag Drawstring": "Fabric Laundry Bag Drawstring",
    "Natural Wooden Comb": "Natural Wooden Comb",
    "Leatherette Room Compendium": "Leatherette Room Compendium",
    "Gagang biodegradable wheat straw bio-composite": "Biodegradable wheat straw bio-composite handle",
    "Bulu sikat lembut charcoal / nylon 0.15mm": "Soft 0.15mm charcoal / nylon bristles",
    "Pasta gigi 6g resmi terdaftar BPOM & Halal MUI": "6g toothpaste registered with BPOM & Halal MUI",
    "Kemasan water-resistant stone paper / kraft": "Water-resistant stone paper / kraft packaging",
    "Formulasi resmi BPOM tanpa bahan kimia keras": "Official BPOM formulation free of harsh chemicals",
    "100% vegetable oil base (minyak sawit & zaitun)": "100% vegetable oil base (palm & olive oil)",
    "Formula hypoallergenic aman kulit sensitif": "Hypoallergenic formula safe for sensitive skin",
    "Kemasan pleated wrap higienis custom foil logo": "Hygienic pleated wrap with custom foil logo",
    "Botol amber heavy-duty shatter-proof PET/Glass": "Heavy-duty shatter-proof amber PET/Glass bottle",
    "Braket SUS304 anti-karat dengan magnetic lock": "Rust-proof SUS304 bracket with magnetic lock",
    "Pompa presisi anti-tetes 1.5ml hemat cairan": "1.5ml anti-drip precision pump for liquid economy",
    "Sablon permanen: Body Wash, Shampoo, Conditioner": "Permanent silkscreen: Body Wash, Shampoo, Conditioner",
    "Upper katun waffle breathable lapis spon 5mm": "Breathable cotton waffle upper with 5mm sponge lining",
    "Sol EVA 8mm anti-slip berpola diamond grip": "8mm anti-slip EVA sole with diamond grip pattern",
    "Pilihan open toe atau closed toe ergonomis": "Ergonomic open-toe or closed-toe options",
    "Opsi bordir timbul atau sablon logo hotel": "Embossed embroidery or silkscreen hotel logo options",
    "4 cotton buds gagang bambu ramah lingkungan": "4 eco-friendly bamboo stem cotton buds",
    "2 kapas wajah katun 100% ultra-soft lint-free": "2 ultra-soft lint-free 100% cotton facial pads",
    "1 kikir kuku emery board mini dua sisi": "1 double-sided mini emery board nail file",
    "Kemasan kotak kraft FSC bersertifikat ramah lingkungan": "FSC-certified eco-friendly kraft box packaging",
    "Pisau cukur 3-blade bio-composite gandum tajam": "Sharp 3-blade wheat bio-composite razor",
    "Strip pelumas aloe vera cegah iritasi cukur": "Aloe vera lubricating strip prevents shaving irritation",
    "Krim cukur busa lembut 15ml melembapkan (BPOM)": "15ml moisturizing gentle foam shave cream (BPOM)",
    "Kemasan box foil hot-stamp logo hotel": "Hot-stamped foil box packaging with hotel logo",
    "Garam laut alami diperkaya essential oil lavender": "Natural sea salt enriched with lavender essential oil",
    "Relaksasi otot & peremajaan kulit tamu bathtub": "Muscle relaxation & skin rejuvenation for bathtub guests",
    "Kemasan sachet foil kedap udara / glass jar": "Airtight foil sachet / glass jar packaging",
    "Standar fasilitas kesehatan & wellness retreat luxury": "Luxury wellness retreat & health facility standards",
    "Material bio-plastic PLA berbasis pati jagung": "Cornstarch-based PLA bio-plastic material",
    "Karet elastis ganda rapat kedap air tanpa pusing": "Comfortable double elastic band for a waterproof seal",
    "Ramah lingkungan terurai alami dalam 12–24 bulan": "Eco-friendly, naturally biodegrades within 12–24 months",
    "Kemasan amplop kertas batu tahan cipratan air": "Splash-resistant stone paper envelope packaging",
    "Kantong oxo-biodegradable kedap bau & bakteri": "Odor & bacteria-tight oxo-biodegradable bag",
    "Sablon petunjuk higienitas bilingual (ID/EN)": "Bilingual hygiene instructions print (ID/EN)",
    "Format lipat praktis untuk dispenser dinding": "Practical folded format for wall-mounted dispensers",
    "Bahan non-woven spunbond 80 GSM / kanvas katun": "80 GSM non-woven spunbond / cotton canvas material",
    "Izin edar resmi BPOM NA & sertifikasi Halal MUI": "Official BPOM NA distribution permit & Halal MUI certification",
    "Tali serut ganda (drawstring) kuat beban berat": "Strong dual drawstring handles for heavy laundry loads",
    "Sablon logo & checklist tamu (Room, Name, Date)": "Silkscreen logo & guest laundry checklist (Room, Name, Date)",
    "Tahan percikan air dan dapat dicuci berulang": "Water-splash resistant and machine washable",
    "Material kayu birchwood / bambu alami halus": "Smooth natural birchwood / bamboo material",
    "Ujung gigi membulat (rounded tips) nyaman di kulit": "Rounded teeth tips gentle on scalp and skin",
    "Grafir laser presisi logo hotel eksklusif": "Precision laser engraving for exclusive hotel logo",
    "Anti-statis dan tidak merusak kelembapan rambut": "Anti-static and preserves hair moisture balance",
    "Higienis, hypoallergenic & anti-bakteri": "Hygienic, hypoallergenic & anti-bacterial",
    "Kulit sintetis PU premium tahan gores & anti-air": "Premium scratch & water-resistant PU leatherette",
    "Jahitan nilon presisi dengan rangka kayu MDF kokoh": "Precision nylon stitching over sturdy MDF wooden frame",
    "Set 5 item: direktori folder, kotak tisu, tray, memo": "5-piece set: directory folder, tissue box, tray, memo pad",
    "Deboss timbul atau gold hot-stamping logo hotel": "Embossed deboss or gold hot-stamping hotel logo",
    "Sangat mudah dibersihkan hanya dengan lap lembap": "Effortlessly cleaned with a damp cloth",

    // Gorden Product Catalog (12 Products & Bullets)
    "100% Blackout Drapery Fabric": "100% Blackout Drapery Fabric",
    "Luxury Sheer Voile Curtains": "Luxury Sheer Voile Curtains",
    "Fire-Retardant (FR) Hotel Fabric (NFPA 701 & BS 5867)": "Fire-Retardant (FR) Hotel Fabric (NFPA 701 & BS 5867)",
    "Acoustic Noise-Reduction Curtains (10–12 dB)": "Acoustic Noise-Reduction Curtains (10–12 dB)",
    "Motorized Smart Track System (Ultra-quiet < 30 dB)": "Motorized Smart Track System (Ultra-quiet < 30 dB)",
    "Heavy-Duty Double Track Rail": "Heavy-Duty Double Track Rail",
    "Custom Roman Shades": "Custom Roman Shades",
    "Blackout Roller Blinds Commercial": "Blackout Roller Blinds Commercial",
    "Wooden Venetian Blinds (Basswood 50mm)": "Wooden Venetian Blinds (Basswood 50mm)",
    "Hospital & Clinic Cubicle Track": "Hospital & Clinic Cubicle Track",
    "Velvet Luxury Blackout Drapery": "Velvet Luxury Blackout Drapery",
    "Ripple Fold Wave Curtain System": "Ripple Fold Wave Curtain System",
    "3-layer weaving teknologi benang hitam densitas tinggi": "3-layer weaving technology with high-density black yarn",
    "100% blokir sinar matahari & radiasi panas UV kamar": "100% blocks solar glare & room UV heat radiation",
    "Lapisan belakang thermal blackout foam coating tahan cuci": "Wash-resistant thermal blackout foam coating backing",
    "Struktur jatuh tebal (drape) anggun berbobot 340 GSM": "Graceful heavyweight 340 GSM drape structure",
    "Voil poliester ultra-lembut tembus cahaya alami": "Ultra-soft polyester voile allowing soft natural daylight",
    "Menjaga privasi kamar di siang hari dari luar": "Preserves daytime room privacy from exterior view",
    "Tahan kusut dan mudah dicuci laundry komersial": "Crease-resistant and easy to wash in commercial laundry",
    "Jahitan lipit pinch pleat atau ripple fold mewah": "Luxury pinch pleat or ripple fold tailored stitching",
    "Standar keselamatan internasional NFPA 701 & BS 5867": "International fire safety standards NFPA 701 & BS 5867",
    "Benang serat inherently flame-retardant (IFR) tahan cuci": "Inherently flame-retardant (IFR) yarn, wash durable",
    "Padam sendiri dalam 2 detik saat terpapar lidah api": "Self-extinguishes within 2 seconds upon flame contact",
    "Lolos uji keselamatan gedung hotel bintang 5": "Certified for 5-star hotel building safety compliance",
    "Reduksi kebisingan hingga 10–12 dB (Sound Transmission)": "Noise reduction up to 10–12 dB (Sound Transmission)",
    "Lapisan insulasi thermal multi-layer peredam gema": "Multi-layer thermal insulation dampening indoor echoes",
    "Menjaga efisiensi pendingin udara (AC) hemat energi": "Maintains air conditioner efficiency for energy savings",
    "Ideal untuk kamar hotel dekat jalan raya / bandara": "Ideal for hotel rooms near highways or airports",
    "Motor senyap (< 30 dB ultra-quiet) kendali remote & app": "Ultra-quiet (< 30 dB) motor with remote & app control",
    "Kompatibel dengan Smart Room Automation (Zigbee/RS485)": "Compatible with Smart Room Automation (Zigbee/RS485)",
    "Fitur touch-motion (ditarik manual otomatis bergerak)": "Touch-motion feature (pull gently to trigger motorized gliding)",
    "Kapasitas beban tirai berat hingga 50 kg per rel": "Heavy-duty curtain load capacity up to 50 kg per track",
    "Jalur ganda untuk tirai blackout dan sheer sekaligus": "Dual track for simultaneous blackout and sheer curtains",
    "Profil aluminium ekstrusi tebal anti-karat & anti-melengkung": "Thick extruded aluminum profile, rust & warp proof",
    "Roda runner nilon silikon meluncur mulus tanpa bising": "Silicone nylon runner wheels glide smoothly and silently",
    "Braket ceiling atau wall mount berdaya topang kokoh": "Sturdy ceiling or wall mount brackets with strong support",
    "Lipatan horizontal bertingkat rapi saat ditarik ke atas": "Neat layered horizontal folds when drawn upward",
    "Pilihan bahan blackout, dimout, atau linen texture": "Blackout, dimout, or textured linen fabric options",
    "Mekanisme rantai tarikan halus dengan safety child-lock": "Smooth chain mechanism with child-safety lock",
    "Cocok untuk suite room, kamar mandi, atau jendela vila": "Suitable for suite rooms, bathrooms, or villa windows",
    "Kain fiberglass/polyester lapis PVC 100% anti-air & jamur": "Fiberglass/polyester fabric with PVC coating, 100% water & mildew proof",
    "Tabung aluminium 38mm heavy-duty anti-melengkung": "38mm heavy-duty warp-resistant aluminum tube",
    "Tekstur tebal tahan sobek dapat digunakan berulang": "Tear-resistant thick texture suitable for repeated use",
    "Ideal untuk jendela kamar mandi, meeting room, & kantor": "Ideal for bathroom windows, meeting rooms, and executive offices",
    "Bilah kayu basswood 50mm dengan finishing UV anti-pudar": "50mm basswood slats with UV fade-resistant finish",
    "Pengaturan sudut penetrasi cahaya matahari presisi": "Precision tilt angle adjustment for solar penetration",
    "Tahan lembap dengan tali ladder tape kain katun tebal": "Moisture resistant with thick cotton cloth ladder tape",
    "Desain modern minimalis favorit arsitek hotel luxury": "Modern minimalist design preferred by luxury hotel architects",
    "Rel lengkung modular fleksibel tanpa sambungan macet": "Flexible modular curved track without jammed joints",
    "Jaring ventilasi mesh atas untuk sirkulasi & sprinkler": "Top mesh ventilation for airflow and fire sprinkler compliance",
    "Kain anti-bakteri, anti-noda, mudah disterilisasi cuci": "Antibacterial, stain-resistant fabric, easy to sterilize",
    "Aksen tropis mewah untuk vila resor & executive lounge": "Luxury tropical accent for resort villas & executive lounges",
    "Tekstur beludru tebal premium aksen royal hotel bintang 5": "Thick velvet luxury texture with 5-star royal accents",
    "Kemampuan peredam akustik tinggi dan 100% blackout": "High acoustic dampening capability and 100% blackout",
    "Pilihan warna klasik: Royal Emerald, Sapphire, Gold": "Classic color palette: Royal Emerald, Sapphire, Gold",
    "Warna tahan luntur terhadap paparan matahari": "Fade-resistant color against direct sunlight exposure",
    "Gelombang lipatan wave seragam simetris presisi": "Uniform, symmetrical, precision wave fold pleats",
    "Rel khusus dengan snap-tape runner jarak konstan": "Special track with constant-spacing snap-tape runners",
    "Menghemat ruang tumpukan kain (stack-back) jendela": "Saves window stack-back space when opened",

    // Towel & Bathrobe Product Catalog (12 Products & Bullets)
    "Luxury Hotel Bath Towel 650 GSM": "Luxury Hotel Bath Towel 650 GSM",
    "Executive Hand Towel 500 GSM": "Executive Hand Towel 500 GSM",
    "Deluxe Face Towel / Washcloth 450 GSM": "Deluxe Face Towel / Washcloth 450 GSM",
    "Bath Mat Jacquard Anti-Slip 800 GSM": "Bath Mat Jacquard Anti-Slip 800 GSM",
    "Pool & Beach Cabana Stripe Towel 600 GSM": "Pool & Beach Cabana Stripe Towel 600 GSM",
    "Kimono Waffle Hotel Bathrobe 450 GSM": "Kimono Waffle Hotel Bathrobe 450 GSM",
    "Plush Velour Hooded Bathrobe 550 GSM": "Plush Velour Hooded Bathrobe 550 GSM",
    "Spa & Sauna Towel 500 GSM": "Spa & Sauna Towel 500 GSM",
    "Gym & Fitness Active Towel 450 GSM": "Gym & Fitness Active Towel 450 GSM",
    "Embossed Foot Towel 750 GSM": "Embossed Foot Towel 750 GSM",
    "Classic Shawl Collar Terry Bathrobe 500 GSM": "Classic Shawl Collar Terry Bathrobe 500 GSM",
    "Salon & Massage Treatment Towel 480 GSM": "Salon & Massage Treatment Towel 480 GSM",
    "Gramasi 650 GSM super empuk & tebal": "650 GSM extra thick & plush weight",
    "Penyerapan instan berdaya serap tinggi": "High instant absorption rate (< 3 seconds)",
    "100% benang katun combed ring-spun 20/2": "100% 20/2 ring-spun combed cotton yarn",
    "Jahitan dobel anti-runtas tahan cuci industri": "Double-stitched hems resistant to industrial laundry",
    "Opsi bordir logo hotel benang emas": "Custom gold thread hotel logo embroidery option",
    "Gramasi 500 GSM ideal wastafel & vanity": "500 GSM ideal for vanity & washbasins",
    "Cepat kering antar pemakaian tamu": "Fast-drying between guest uses",
    "100% combed cotton bebas serat rontok (lint-free)": "100% combed cotton free of lint shedding (lint-free)",
    "Bebas serat rontok (lint-free)": "Lint-free combed cotton fibers",
    "Aksen dobby border elegan & rapi": "Elegant & neat dobby border accents",
    "Aksen dobby border elegan": "Elegant dobby border accents",
    "Gramasi 450 GSM ekstra halus untuk wajah": "450 GSM extra delicate for facial skin",
    "100% Long-Staple Cotton Zero Twist": "100% Zero-Twist Long-Staple Cotton",
    "Higienis & anti-bakteri": "Hygienic & antibacterial",
    "Jahitan obras ganda presisi anti-terurai": "Precision double-overlock unravel-resistant stitching",
    "Gramasi ekstra padat 800 GSM serap seketika": "Extra dense 800 GSM instant absorbency",
    "Motif embossed jacquard anti-selip": "Non-slip embossed jacquard pattern",
    "100% combed cotton benang dobel loop 20/2": "100% combed cotton 20/2 double loop yarn",
    "Benang dobel loop 20/2 ekstra kuat": "Extra heavy-duty 20/2 double loop yarn",
    "Tepi rapat anti-melengkung (anti-curling)": "Reinforced non-curling edges (anti-curling)",
    "Teruji tahan mesin cuci tunnel industri": "Tested for industrial tunnel washers",
    "Gramasi 600 GSM ukuran jumbo 90x180 cm": "600 GSM jumbo size 90x180 cm",
    "Vat-dyed tahan klorin & sinar UV matahari": "Vat-dyed chlorine and UV resistant",
    "Motif garis cabana stripe klasik mewah": "Classic luxury cabana stripe pattern",
    "100% 2-ply combed cotton tebal & awet": "100% 2-ply combed cotton thick & durable",
    "Cepat kering di sirkulasi udara terbuka": "Quick-drying in open-air ventilation",
    "Tenunan sarang lebah (honeycomb) sejuk & ringan": "Cool & lightweight honeycomb waffle weave",
    "100% katun combed serap air cepat & lekas kering": "100% combed cotton fast-absorbing & quick-drying",
    "Ringan, serap air cepat & lekas kering": "Lightweight, fast absorbent & quick to dry",
    "Kerah kimono elegan dengan 2 saku depan luas": "Elegant kimono collar with 2 spacious front pockets",
    "Sabuk pengikat loop ganda finishing pre-shrunk": "Dual loop tie belt with pre-shrunk finish",
    "Opsi bordir logo hotel di dada kiri": "Hotel logo embroidery option on left chest",
    "Gramasi mewah 550 GSM dengan tudung (hood)": "Luxury 550 GSM with attached hood",
    "Luar velour beludru, dalam terry serap air": "Velvet velour exterior, absorbent terry interior",
    "Sensasi hangat eksklusif suite hotel bintang 5": "Warm and exclusive 5-star hotel suite feel",
    "100% combed cotton dengan kelim tebal anti-runtas": "100% combed cotton with thick fray-resistant hems",
    "Tahan pencucian mesin komersial berulang kali": "Withstands repeated commercial machine washing",
    "Dimensi panjang 80x180 cm menutup tubuh sempurna": "Long 80x180 cm dimensions covering the body completely",
    "100% low-twist combed cotton sangat empuk": "100% low-twist combed cotton ultra-plush",
    "Tahan uap panas sauna & minyak aromaterapi": "Resistant to sauna steam & aromatherapy oils",
    "Mudah dilipat & digulung rapi untuk spa display": "Easy to fold & roll neatly for spa displays",
    "Tahan deterjen alkali & proses sterilisasi rutin": "Resistant to alkaline detergents & routine sterilization",
    "Bentuk memanjang 30x100 cm pas di leher": "Elongated 30x100 cm shape contours neck perfectly",
    "Menyerap keringat seketika saat berolahraga": "Absorbs sweat instantly during sports & workouts",
    "100% combed cotton anti-bakteri & anti-odor": "100% combed cotton antibacterial & anti-odor",
    "Jahitan bisban tepi rapat tahan gesekan tinggi": "Reinforced taped binding resistant to high friction",
    "Cepat kering, efisien untuk rotasi laundry harian": "Fast-drying, highly efficient for daily laundry cycles",
    "Gramasi 750 GSM padat dengan daya serap maksimal": "Dense 750 GSM with maximum absorbency",
    "Border embossed jacquard FOOT TOWEL rapi": "Neat embossed jacquard FOOT TOWEL border",
    "100% ring spun combed cotton 20/2 tidak licin": "100% ring-spun combed cotton 20/2 non-slip",
    "Tahan abrasi gesekan pemakaian harian": "Resistant to daily foot-friction abrasion",
    "Memenuhi standar higienitas kamar mandi bintang 5": "Meets 5-star bathroom hygiene standards",
    "Kerah syal (shawl collar) tebal mewah klasik": "Classic thick luxury shawl collar styling",
    "100% combed cotton double-sided terry loop": "100% combed cotton double-sided terry loop",
    "Gramasi 500 GSM serap tetesan air seketika": "500 GSM absorbs water droplets instantly",
    "Manset lengan lipat fleksibel & dua saku depan dalam": "Flexible turn-back cuffs & two deep front pockets",
    "Tahan proses setrika uap industri (steam press)": "Resistant to industrial steam pressing",
    "Formula tahan luntur minyak pijat & zat salon": "Resistant to massage oils & salon treatment chemicals",
    "Katun combed 480 GSM tetap lembut di kulit": "Combed cotton 480 GSM stays gentle on skin",
    "Pilihan warna gelap menyamarkan noda kosmetik": "Dark color options conceal cosmetic stains",
    "Jahitan nilon dobel tepi ganda tahan kimia": "Double-needle nylon stitching resistant to chemicals",
    "Pilihan ideal fasilitas salon, massage & spa resor": "Ideal choice for resort salon, massage & spa facilities",
    "Tahan pencucian suhu tinggi 85°C": "Resistant to high-temperature washing up to 85°C",
    "Tahan sterilisasi suhu tinggi & pemutih oksigen": "Resistant to high-temperature sterilization & oxygen bleach"
  };

  var textNodes = [];
  var attrNodes = [];

  function isSkippable(el) {
    while (el) {
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return true;
      if (el.hasAttribute && el.hasAttribute('data-no-i18n')) return true;
      el = el.parentElement;
    }
    return false;
  }

  function scan(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) {
      if (!n.nodeValue || !n.nodeValue.trim()) continue;
      if (isSkippable(n.parentElement)) continue;
      textNodes.push({ node: n, original: n.nodeValue });
    }
    root.querySelectorAll('[placeholder]').forEach(function (el) {
      attrNodes.push({ el: el, attr: 'placeholder', original: el.getAttribute('placeholder') });
    });
  }

  function translateFragment(text) {
    var lead = text.match(/^\s*/)[0];
    var trail = text.match(/\s*$/)[0];
    var core = text.slice(lead.length, text.length - trail.length);
    if (Object.prototype.hasOwnProperty.call(DICTIONARY, core)) {
      return lead + DICTIONARY[core] + trail;
    }
    return text;
  }

  function applyToEntries(lang) {
    textNodes.forEach(function (entry) {
      entry.node.nodeValue = lang === 'en' ? translateFragment(entry.original) : entry.original;
    });
    attrNodes.forEach(function (entry) {
      var value = lang === 'en' ? translateFragment(entry.original) : entry.original;
      entry.el.setAttribute(entry.attr, value);
    });
  }

  function getLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'id';
    } catch (e) {
      return 'id';
    }
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  var listeners = [];

  function updateToggleUI(lang) {
    document.querySelectorAll('[data-lang-set]').forEach(function (btn) {
      var isActive = btn.getAttribute('data-lang-set') === lang;
      btn.classList.toggle('lang-btn-active', isActive);
    });
    var titleEl = document.querySelector('title');
    if (titleEl) {
      var titleMap = {
        "Katalog Lengkap Perlengkapan Hotel Bintang 5 | DETASCO": "Complete 5-Star Hotel Supplies Catalog | DETASCO",
        "DETASCO | Solusi Pengadaan Hospitality Bintang 5 di Seluruh Indonesia": "DETASCO | 5-Star Hospitality Procurement Solutions Across Indonesia",
        "Linen & Bedding Hotel Bintang 5 | DETASCO": "5-Star Hotel Linen & Bedding | DETASCO",
        "Handuk Hotel Premium | DETASCO": "5-Star Hotel Towels & Bathrobes | DETASCO",
        "Amenities Hotel Premium | DETASCO": "5-Star Hotel Guest Amenities | DETASCO",
        "Gorden Hotel Elegan | DETASCO": "Hotel Curtains & Window Treatments | DETASCO"
      };
      if (!titleEl.dataset.origTitle) titleEl.dataset.origTitle = titleEl.textContent;
      titleEl.textContent = (lang === 'en' && titleMap[titleEl.dataset.origTitle]) ? titleMap[titleEl.dataset.origTitle] : titleEl.dataset.origTitle;
    }
    document.documentElement.setAttribute('lang', lang);
  }

  function setLang(lang) {
    storeLang(lang);
    applyToEntries(lang);
    updateToggleUI(lang);
    listeners.forEach(function (fn) {
      try { fn(lang); } catch (e) {}
    });
  }

  window.DetascoI18n = {
    getLang: getLang,
    setLang: setLang,
    onLangChange: function (fn) {
      listeners.push(fn);
    },
    refreshScope: function (root) {
      scan(root);
      applyToEntries(getLang());
    },
    pick: function (product, field) {
      var lang = getLang();
      var enField = field + '_en';
      if (lang === 'en' && product && product[enField]) return product[enField];
      return product ? product[field] : '';
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    scan(document.body);
    updateToggleUI(getLang());
    applyToEntries(getLang());

    document.querySelectorAll('[data-lang-set]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.getAttribute('data-lang-set'));
      });
    });
  });
})();
