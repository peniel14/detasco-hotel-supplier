// DETASCO - ID/EN Language Switcher (shared by index.html & katalog.html)
// Works by walking static text nodes and swapping exact-match strings via DICTIONARY.
// Dynamically-rendered product content (title/desc/specs) is translated separately
// by the render functions themselves, using the *_en fields in products-data.js.
(function () {
  var STORAGE_KEY = 'detasco-lang';

  var DICTIONARY = {
    // ---- Shared Nav ----
    "Beranda": "Home",
    "Katalog": "Catalog",
    "Kategori": "Categories",
    "Inspirasi": "Inspiration",
    "Standar": "Standards",
    "Kontak": "Contact",
    "Lokasi": "Location",
    "Lokasi Showroom": "Showroom Location",
    "Kategori Suplai": "Supply Categories",
    "20 Produk": "20 Products",
    "Semua Koleksi": "All Collections",
    "Katalog lengkap hotel": "Complete hotel catalog",
    "Sprei, duvet & handuk": "Sheets, duvets & towels",
    "Buka Seluruh Katalog (20 Koleksi)": "View Full Catalog (20 Collections)",
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
    "Tidak ada koleksi produk yang sesuai filter.": "No product collection matches this filter.",
    "Tampilkan Semua Koleksi": "Show All Collections",
    "See All Products (Lihat Seluruh Koleksi)": "See All Products (View Full Collection)",
    "See All Linen & Bedding (Katalog Lengkap)": "See All Linen & Bedding (Full Catalog)",
    "See All Guest Amenities (Katalog Lengkap)": "See All Guest Amenities (Full Catalog)",
    "See All In-Room & Housekeeping (Katalog Lengkap)": "See All In-Room & Housekeeping (Full Catalog)",
    "See All F&B & Banquet Supplies (Katalog Lengkap)": "See All F&B & Banquet Supplies (Full Catalog)",
    "Tersedia 20+ koleksi lengkap dengan filter spesifikasi komersial di laman katalog": "20+ full collections available with commercial spec filters on the catalog page",
    "*Memerlukan penyesuaian dimensi matras, bordir lambang khusus, atau formulasi aroma (*signature scent*) hotel Anda?": "*Need custom mattress dimensions, special logo embroidery, or a signature scent formulation for your hotel?",
    "Hubungi Tim Spesifikasi Teknis B2B": "Contact Our B2B Technical Specification Team",

    // ---- Product card template (dynamic, but static wrapper text) ----
    "MINTA PENAWARAN": "REQUEST A QUOTE",

    // ---- Kategori Pasokan Utama (index.html) ----
    "RUANG LINGKUP PENGADAAN KOMPREHENSIF": "COMPREHENSIVE PROCUREMENT SCOPE",
    "KATEGORI PASOKAN UTAMA": "CORE SUPPLY CATEGORIES",
    "Mendukung seluruh tahapan operasional properti: mulai dari proyek pembukaan awal (": "Supporting every stage of property operations: from the initial (",
    ") hingga pengadaan terjadwal bulanan.": ") project through to scheduled monthly procurement.",
    "Sprei, duvet cover, bantal microfibre bulu angsa, matras topper, dan handuk tebal 650 GSM dengan penyerapan prima.": "Sheets, duvet covers, down-alternative microfibre pillows, mattress toppers, and thick 650 GSM towels with superior absorbency.",
    "Dental kit ramah lingkungan, sabun alami esensial, sampo herbal, serta sandal hotel tebal dengan sol anti-slip.": "Eco-friendly dental kits, natural essential soaps, herbal shampoo, and thick hotel slippers with anti-slip soles.",
    "Formulasi Tersertifikasi BPOM": "BPOM-Certified Formulation",
    "Peralatan prasmanan chafing dish roll-top, cutlery stainless steel 18/10, kristal glassware, dan trolley room service.": "Roll-top chafing dish buffet equipment, 18/10 stainless steel cutlery, crystal glassware, and room service trolleys.",
    "Hidrolik Soft-Close Roll-top": "Hydraulic Soft-Close Roll-top",
    "Porselen Anti-Gores Restoran": "Scratch-Resistant Restaurant Porcelain",
    "Deposit box digital dengan audit trail, kettle elektrik 304 food-grade, gantungan kayu solid, dan trolley housekeeping.": "Digital safe boxes with audit trail, food-grade 304 electric kettles, solid wood hangers, and housekeeping trolleys.",
    "Brankas Kamar Digital Audit": "Digital Audit-Trail Room Safe",
    "Trolley Housekeeping Heavy Duty": "Heavy-Duty Housekeeping Trolley",

    // ---- Inspirasi (index.html) ----
    "PORTOFOLIO SUASANA PROPERTI": "PROPERTY AMBIENCE PORTFOLIO",
    "INSPIRASI KEMEWAHAN RUANG HOTEL": "LUXURY HOTEL SPACE INSPIRATION",
    "Bagaimana produk-produk DETASCO berpadu sempurna menghadirkan kenyamanan kelas dunia di berbagai sudut hotel dan resor rekanan kami.": "How DETASCO products come together to deliver world-class comfort across our partner hotels and resorts.",

    // ---- Stats ----
    "Hotel & Resor Rekanan": "Partner Hotels & Resorts",
    "Kamar Dilayani di Seluruh RI": "Rooms Served Across Indonesia",
    "Tingkat Ketepatan Pengiriman (SLA)": "On-Time Delivery Rate (SLA)",
    "Pengalaman Industri Supplier": "Years of Supplier Industry Experience",

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
    "Telusuri katalog dan catat produk, jumlah, serta kebutuhan kustomisasi Anda.": "Browse the catalog and note the products, quantities, and customization needs.",
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
    "Sentra Logistik & Pergudangan Modern, Jakarta & Kantor Perwakilan Bali": "Modern Logistics & Warehouse Hub, Jakarta & Bali Representative Office",
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
    "HUB DISTRIBUSI & SHOWROOM REGIONAL": "REGIONAL DISTRIBUTION HUB & SHOWROOM",
    "Showroom Buka": "Showroom Open",
    "Pusat inventori nasional, display room perlengkapan kamar hotel bintang 5, serta laboratorium pengujian benang linen & formula aroma amenities.": "National inventory hub, 5-star hotel room equipment showroom, and a testing lab for linen threads & amenity scent formulas.",
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
    "Ruang Mock-Up Kamar Hotel, Bedding Texture Gallery, Meja Uji Amenities, Area Parkir Truk & Kontainer": "Hotel Room Mock-Up Space, Bedding Texture Gallery, Amenities Testing Table, Truck & Container Parking Area",
    "Resort & Villa Linen Showcase, Scented Amenities Testing Bar, Buffer Stock Room, Area Parkir Tamu": "Resort & Villa Linen Showcase, Scented Amenities Testing Bar, Buffer Stock Room, Guest Parking Area",
    "Jadwalkan Kunjungan (Jakarta)": "Schedule a Visit (Jakarta)",
    "Jadwalkan Kunjungan (Bali)": "Schedule a Visit (Bali)",
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
    "Kategori Pasokan Utama": "Core Supply Categories",
    "Standar & SLA Pasokan": "Supply Standards & SLA",
    "Permintaan Penawaran Harga": "Price Quote Request",
    "Lokasi Showroom & Kantor": "Showroom & Office Location",
    "Lini Produk": "Product Line",
    "Handuk Hotel 650 GSM": "Hotel Towels 650 GSM",
    "Lihat 20+ Produk Selengkapnya →": "View 20+ More Products →",
    "Kantor & Showroom": "Office & Showroom",
    "Sentral Jakarta:": "Jakarta Central:",
    "Hub Distribusi Bali:": "Bali Distribution Hub:"
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
        "DETASCO | Solusi Pengadaan Hospitality Bintang 5 di Seluruh Indonesia": "DETASCO | 5-Star Hospitality Procurement Solutions Across Indonesia"
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
