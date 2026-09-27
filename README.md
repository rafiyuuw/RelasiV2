# RELASI (Report, Evaluate, & Link Anti-Bullying System)

Platform pelaporan dan penanganan insiden perundungan di lingkungan sekolah yang dirancang dengan pendekatan **Privacy-Preserving Reporting**.

RELASI dikembangkan sebagai **competition prototype / Minimum Viable Product (MVP)** untuk mendemonstrasikan alur pelaporan, penelaahan kasus, korelasi laporan, dan pengelolaan akses berdasarkan peran pengguna.

> **Important:** Repository ini berisi implementasi MVP/prototype. Beberapa komponen pada arsitektur produksi yang dijelaskan di bawah merupakan **Target Architecture** dan belum diimplementasikan pada versi repository ini.

---

## 📌 Status Repositori

### Competition Prototype / MVP
Versi saat ini berfokus pada demonstrasi alur interaksi pengguna secara end-to-end tanpa membutuhkan konfigurasi backend atau database eksternal.

### Implemented MVP
Teknologi dan mekanisme yang saat ini benar-benar diimplementasikan:

- **Framework:** Next.js 14 dengan App Router
- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **State & Persistence:** Client-side state dan `localStorage`
- **Role Simulation:** Simulasi peran Pelapor, Penelaah (Guru BK), dan Administrator
- **Signal Correlation:** Deterministic Rule-Based Heuristic Matching
- **Version Control:** Git & GitHub

Karena MVP menggunakan `localStorage`, data pada versi prototype bersifat lokal pada browser dan tidak digunakan sebagai penyimpanan data terpusat antar pengguna.

---

## 🔎 Relationship Signal Simulation

Salah satu fungsi prototype RELASI adalah mendeteksi kemungkinan keterkaitan antara laporan yang masuk.

Pada MVP, fungsi ini **bukan** menggunakan Artificial Intelligence, Machine Learning, NLP, atau LLM.

Mekanisme yang digunakan adalah:
**Deterministic Rule-Based Heuristic Matching**

Implementasinya berada pada logic aplikasi client-side dan bekerja dengan pendekatan seperti:
- pencocokan kategori laporan
- pencocokan kata atau frasa tertentu
- pencocokan informasi pihak yang terlibat
- normalisasi string menggunakan lowercase conversion
- deterministic scoring
- threshold untuk menentukan apakah terdapat kemungkinan keterkaitan

Hasil pencocokan kemudian digunakan untuk mensimulasikan **Relationship Signal** pada alur prototype.

Mekanisme ini dipilih untuk mendemonstrasikan konsep korelasi laporan secara deterministik tanpa membutuhkan model AI atau layanan eksternal.

### Planned AI Integration
Pada pengembangan berikutnya, mekanisme rule-based tersebut dapat dikembangkan menjadi sistem yang menggunakan NLP atau LLM untuk membantu proses seperti:
- ekstraksi informasi dari narasi laporan
- pengelompokan laporan berdasarkan konteks
- pembuatan ringkasan kasus
- identifikasi kemungkinan keterkaitan antar laporan

Integrasi tersebut merupakan bagian dari **Target Architecture** dan bukan bagian dari implementasi MVP pada repository ini.

---

## 👥 Role Simulation

MVP menyediakan simulasi beberapa peran pengguna untuk mendemonstrasikan perbedaan alur dan akses dalam sistem.

### Pelapor
Digunakan untuk mensimulasikan proses:
- membuat laporan
- melihat status laporan
- melihat informasi yang relevan dengan laporan

### Penelaah / Guru BK
Digunakan untuk mensimulasikan proses:
- meninjau laporan
- melihat informasi kasus
- melihat relationship signal
- melakukan simulasi pengelolaan kasus

### Administrator
Digunakan untuk mensimulasikan fungsi administratif dan pengelolaan sistem pada level prototype.

*Role pada versi MVP merupakan simulasi client-side, bukan implementasi authorization infrastructure untuk lingkungan production.*

---

## 💾 Data Persistence

MVP menggunakan:
- React/client-side state untuk state aplikasi
- Browser `localStorage` untuk persistence

Pendekatan ini memungkinkan prototype mempertahankan data selama demonstrasi tanpa memerlukan database eksternal.

Namun, karena data disimpan pada browser pengguna:
- data tidak tersinkronisasi antar perangkat
- data tidak menjadi database terpusat
- data tidak dimaksudkan untuk penggunaan production
- data prototype dapat berbeda antara browser atau perangkat yang berbeda

Untuk deployment produksi, sistem membutuhkan persistent backend storage dan mekanisme pengelolaan data terpusat.

---

## 🔐 Security & Privacy

Privacy merupakan prinsip desain utama RELASI.

Pada MVP, privacy-preserving behavior masih berada pada tingkat prototype simulation dan belum merepresentasikan infrastruktur keamanan production.

MVP saat ini **belum** mengimplementasikan:
- JWT authentication
- HTTP-only secure session cookies
- password hashing dengan Argon2/BCrypt
- production-grade RBAC
- encrypted database
- PII scrubbing
- EXIF metadata stripping
- tamper-evident audit trail
- secure server-side file storage

Komponen tersebut termasuk dalam rancangan Target Production Architecture.

Dengan demikian, repository ini tidak dimaksudkan untuk menyimpan data pribadi atau laporan sensitif yang sebenarnya.

---

## 🏗️ Target Production Architecture

Untuk implementasi lapangan, RELASI dirancang agar dapat dikembangkan dari prototype client-side menjadi arsitektur dengan backend dan penyimpanan data terpusat.

Komponen yang direncanakan meliputi:

### Backend
- Node.js / Next.js Server-side Endpoints
- API layer untuk komunikasi antara frontend dan backend
- Server-side validation dan business logic

### Database
- PostgreSQL
- Prisma ORM

### Authentication & Authorization
- HTTP-only secure cookies
- Session/JWT-based authentication
- Password hashing menggunakan algoritma yang sesuai untuk production
- Role-based access control

### AI Processing
- External LLM API
- NLP-based processing
- PII scrubbing sebelum data dikirim ke layanan AI
- AI-assisted summarization dan information extraction

### Security & Privacy
Arsitektur produksi juga dirancang untuk mempertimbangkan:
- encrypted communication
- secure server-side storage
- audit logging
- access control
- privacy-aware data processing
- secure attachment handling

*Komponen di atas merupakan Target Production Architecture / Future Development dan belum menjadi bagian dari implementasi MVP pada repository ini.*

---

## 🧭 Development Roadmap

### Phase 1 — Competition MVP
- [x] Student reporting flow
- [x] Role-based interface simulation
- [x] Counselor/reviewer flow simulation
- [x] Administrator flow simulation
- [x] Client-side state management
- [x] LocalStorage persistence
- [x] Rule-based relationship signal simulation
- [x] Responsive interface
- [x] Prototype deployment

### Phase 2 — Backend & Centralized Data
- [ ] Backend/API implementation
- [ ] PostgreSQL database
- [ ] Prisma ORM
- [ ] Server-side validation
- [ ] Centralized data persistence

### Phase 3 — Production Security
- [ ] Real authentication
- [ ] Secure session management
- [ ] Production-grade RBAC
- [ ] Password hashing
- [ ] Audit logging
- [ ] Secure attachment processing
- [ ] Privacy and data protection mechanisms

### Phase 4 — AI-Assisted Processing
- [ ] NLP/LLM integration
- [ ] Narrative summarization
- [ ] Information extraction
- [ ] Advanced relationship detection
- [ ] Privacy-aware AI processing

---

## 🛠️ Local Development

### Requirements
- Node.js
- npm

### Installation
Clone repository:
```bash
git clone https://github.com/rafiyuuw/RelasiV2.git
cd RelasiV2
```

Install dependencies:
```bash
npm install
```

Run development server:
```bash
npm run dev
```

The application will be available through the local development server shown by Next.js.

### Production Build
To verify the production build:
```bash
npm run build
```

The production server can be started using:
```bash
npm run start
```

---

## 📁 Project Structure

Struktur utama project mengikuti arsitektur Next.js App Router:

```text
Relasi/
├── public/
│   └── images/
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── package.json
├── next.config.*
├── tailwind.config.*
└── tsconfig.json
```

*Struktur aktual dapat berkembang mengikuti kebutuhan pengembangan prototype.*

---

## 🚀 Deployment

MVP dapat dideploy menggunakan platform yang mendukung aplikasi Next.js.

Deployment prototype tidak membutuhkan database eksternal karena persistence pada versi ini menggunakan browser localStorage.

Namun, deployment tersebut tidak mengubah karakteristik penyimpanan data MVP. Data tetap bersifat client-side dan tidak menjadi data terpusat antar pengguna.

---

## ⚠️ Prototype Limitations

Karena RELASI merupakan competition prototype, terdapat beberapa batasan:
- Data masih disimpan secara lokal pada browser.
- Tidak terdapat backend/API production.
- Authentication dan authorization masih berupa simulasi.
- Relationship detection masih menggunakan deterministic rule-based matching.
- AI/LLM belum diintegrasikan.
- Infrastruktur security production belum diterapkan.
- Prototype tidak ditujukan untuk penggunaan dengan data laporan perundungan yang sebenarnya.

Batasan tersebut menjadi dasar pengembangan menuju Target Production Architecture.

---

## 📄 Project Context

RELASI dikembangkan sebagai prototype untuk mengeksplorasi bagaimana platform digital dapat membantu proses pelaporan dan penanganan insiden perundungan di lingkungan sekolah dengan memperhatikan aspek privacy, accessibility, dan structured case handling.

Fokus utama MVP adalah mendemonstrasikan user flow dan konsep sistem, sedangkan arsitektur backend, centralized storage, production security, dan AI-assisted processing diposisikan sebagai pengembangan tahap berikutnya.
