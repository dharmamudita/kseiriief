# 📐 Diagram Arsitektur Sistem — Platform Digital UKM KSEI RIIEF

**Pengembangan Platform Digital Terintegrasi untuk Optimalisasi Manajemen Organisasi dan Evaluasi Keaktifan Anggota UKM KSEI RIIEF**

> UIN Raden Intan Lampung

---

## 1. Arsitektur High-Level (Overview)

Sistem ini menggunakan arsitektur **3-Tier Client-Side** dengan Firebase Firestore sebagai backend realtime.

```mermaid
graph TB
    subgraph "🌐 CLIENT TIER - Browser"
        A["👤 User Browser<br/>(Desktop / Mobile)"]
    end

    subgraph "⚡ APPLICATION TIER - React SPA"
        B["React 19 + Vite 6<br/>Single Page Application"]
        C["React Router DOM v7<br/>Client-Side Routing"]
        D["Context API<br/>State Management"]
        E["TailwindCSS v4<br/>Styling Engine"]
    end

    subgraph "☁️ DATA TIER - Firebase"
        F["Firebase Firestore<br/>Realtime Database"]
        G["Collection: appData<br/>(8 Documents)"]
    end

    subgraph "🚀 DEPLOYMENT"
        H["Vercel<br/>Static Hosting + CDN"]
        I["GitHub Repository<br/>Version Control"]
    end

    A -->|"HTTP/HTTPS"| H
    H -->|"Serve SPA"| B
    B --> C
    B --> D
    B --> E
    D <-->|"onSnapshot<br/>(Realtime Listener)"| F
    D -->|"setDoc<br/>(Write)"| F
    F --> G
    I -->|"CI/CD Deploy"| H

    style A fill:#006a4e,color:#fff,stroke:#004d38
    style F fill:#ff9800,color:#fff,stroke:#e65100
    style H fill:#000,color:#fff,stroke:#333
    style G fill:#fff3e0,color:#333,stroke:#ff9800
```

---

## 2. Tech Stack & Build Pipeline

```mermaid
graph LR
    subgraph "📦 Development"
        A["Source Code<br/>JSX + CSS"] --> B["Vite 6<br/>Dev Server + HMR"]
        B --> C["Browser<br/>localhost:5173"]
    end

    subgraph "🔨 Build Process"
        A --> D["Vite Build"]
        D --> E["dist/<br/>Static Files"]
        E --> F["Vercel<br/>Production"]
    end

    subgraph "📚 Dependencies"
        G["React 19"]
        H["React Router DOM 7"]
        I["Firebase SDK 11"]
        J["React Icons 5"]
        K["TailwindCSS 4<br/>(@tailwindcss/vite)"]
    end

    G --> A
    H --> A
    I --> A
    J --> A
    K --> D

    style D fill:#646cff,color:#fff
    style F fill:#000,color:#fff
    style I fill:#ff9800,color:#fff
```

| Layer | Teknologi | Versi | Fungsi |
|-------|-----------|-------|--------|
| **UI Framework** | React | 19.0 | Komponen interaktif & rendering |
| **Build Tool** | Vite | 6.0 | Bundling, HMR, optimasi |
| **Styling** | TailwindCSS | 4.0 | Utility-first CSS framework |
| **Routing** | React Router DOM | 7.0 | Navigasi SPA client-side |
| **Database** | Firebase Firestore | 11.10 | Realtime NoSQL database |
| **Icons** | React Icons | 5.4 | Icon library + Emoji |
| **Font** | Plus Jakarta Sans | - | Google Fonts typography |
| **Hosting** | Vercel | - | Static deployment + CDN |
| **VCS** | GitHub | - | Version control |

---

## 3. Component Tree (React)

```mermaid
graph TD
    ROOT["🌳 main.jsx<br/>ReactDOM.createRoot"] --> APP["App.jsx"]
    
    APP --> ROUTER["BrowserRouter"]
    ROUTER --> DP["DataProvider<br/>(DataContext)"]
    DP --> AP["AuthProvider<br/>(AuthContext)"]
    AP --> STT["ScrollToTop"]
    AP --> LAYOUT["Layout Component"]
    
    LAYOUT --> NAVBAR["Navbar<br/>(conditional)"]
    LAYOUT --> ROUTES["Routes"]
    LAYOUT --> FOOTER["Footer<br/>(conditional)"]

    subgraph "📄 Public Pages (7)"
        ROUTES --> HOME["/ → Home"]
        ROUTES --> TENTANG["/tentang → Tentang"]
        ROUTES --> STRUKTUR["/struktur → Struktur"]
        ROUTES --> KEGIATAN["/kegiatan → Kegiatan"]
        ROUTES --> KEGDETAIL["/kegiatan/:id → KegiatanDetail"]
        ROUTES --> GALERI["/galeri → Galeri"]
        ROUTES --> KONTAK["/kontak → Kontak"]
        ROUTES --> LB["/leaderboard → Leaderboard"]
        ROUTES --> FORUM["/forum → Forum"]
    end

    subgraph "🔒 Auth Pages"
        ROUTES --> LOGIN["/login → Login"]
    end

    subgraph "🛡️ Protected Pages"
        ROUTES --> PR1["ProtectedRoute"]
        PR1 --> MEMBER["/dashboard → MemberDashboard"]
        ROUTES --> PR2["ProtectedRoute (adminOnly)"]
        PR2 --> ADMIN["/admin → AdminDashboard"]
    end

    style ROOT fill:#1a1a2e,color:#fff
    style DP fill:#006a4e,color:#fff
    style AP fill:#00896a,color:#fff
    style PR1 fill:#dc2626,color:#fff
    style PR2 fill:#dc2626,color:#fff
    style NAVBAR fill:#d4a843,color:#333
    style FOOTER fill:#1f2937,color:#fff
```

> [!NOTE]
> **Layout Conditional**: Navbar & Footer **disembunyikan** pada halaman `/login` dan `/admin`. Admin Dashboard memiliki sidebar navigasi sendiri.

---

## 4. Arsitektur Data Layer & Firebase Integration

```mermaid
graph TB
    subgraph "🖥️ React Components (Pages)"
        P1["Home / Tentang / Struktur"]
        P2["Kegiatan / KegiatanDetail"]
        P3["Leaderboard / Forum"]
        P4["AdminDashboard"]
        P5["MemberDashboard"]
        P6["Login / Kontak"]
    end

    subgraph "📊 Context Layer (State Management)"
        DC["DataContext<br/>━━━━━━━━━━━━━<br/>• users state<br/>• kegiatan state<br/>• submissions state<br/>• attendance state<br/>• forum state<br/>• registrations state<br/>• feedback state<br/>• regSettings state"]
        AC["AuthContext<br/>━━━━━━━━━━━<br/>• user state<br/>• login()<br/>• logout()<br/>• isAdmin"]
    end

    subgraph "🔥 Firebase Firestore"
        FS["Collection: appData"]
        D1["Doc: users"]
        D2["Doc: kegiatan"]
        D3["Doc: submissions"]
        D4["Doc: attendance"]
        D5["Doc: forum"]
        D6["Doc: registrations"]
        D7["Doc: feedback"]
        D8["Doc: regSettings"]
        FS --> D1 & D2 & D3 & D4 & D5 & D6 & D7 & D8
    end

    subgraph "📁 Legacy Data Layer (localStorage)"
        ST["store.js (Hub)"]
        M1["users.js"]
        M2["kegiatan.js"]
        M3["submissions.js"]
        M4["attendance.js"]
        M5["forum.js"]
        M6["registrations.js"]
        M7["feedback.js"]
        SYNC["fireSync.js<br/>(Write-Through Cache)"]
        ST --> M1 & M2 & M3 & M4 & M5 & M6 & M7
        M1 & M2 & M3 & M4 & M5 & M6 & M7 --> SYNC
    end

    P1 & P2 & P3 & P4 & P5 & P6 -->|"useData()"| DC
    P6 -->|"useAuth()"| AC
    AC -->|"loginUser()"| DC

    DC <-->|"onSnapshot()<br/>(Realtime)"| FS
    DC -->|"setDoc()<br/>(Write)"| FS

    SYNC -->|"pushToCloud()"| FS
    SYNC <-->|"pullFromCloud()"| FS

    style DC fill:#006a4e,color:#fff
    style AC fill:#00896a,color:#fff
    style FS fill:#ff9800,color:#fff
    style SYNC fill:#2196f3,color:#fff
```

### Pola Sinkronisasi Data (Dual-Mode)

```mermaid
sequenceDiagram
    participant C as React Component
    participant DC as DataContext
    participant FS as Firestore
    
    Note over DC,FS: === INIT: Realtime Listeners ===
    DC->>FS: onSnapshot(8 documents)
    FS-->>DC: Initial data snapshot
    DC->>DC: setState (users, kegiatan, dll)
    DC-->>C: Re-render dengan data

    Note over C,FS: === WRITE: Simpan Data ===
    C->>DC: createUser(data)
    DC->>DC: Update via Ref (latest state)
    DC->>FS: setDoc(updated array)
    FS-->>DC: onSnapshot trigger
    DC->>DC: setState (auto-update)
    DC-->>C: Re-render otomatis

    Note over C,FS: === REALTIME: Multi-Device ===
    FS-->>DC: onSnapshot (perubahan dari device lain)
    DC->>DC: setState (sinkron otomatis)
    DC-->>C: Re-render dengan data terbaru
```

> [!IMPORTANT]
> **DataContext** menggunakan dua pendekatan:
> 1. **Primary (Aktif)**: Langsung `onSnapshot` + `setDoc` ke Firestore — digunakan oleh semua komponen React via `useData()` hook
> 2. **Legacy (Backup)**: `store.js` + `fireSync.js` dengan localStorage sebagai cache — masih ada di codebase tapi tidak dipakai secara aktif oleh React components

---

## 5. Alur Autentikasi & Otorisasi

```mermaid
flowchart TD
    START(["👤 User Mengakses Website"]) --> CHECK{"Halaman yang<br/>diakses?"}
    
    CHECK -->|"Public Page<br/>(/, /tentang, /kegiatan, dll)"| PUBLIC["✅ Akses Langsung<br/>Tanpa Login"]
    CHECK -->|"/login"| LOGINPAGE["📝 Form Login<br/>(NPM + Password)"]
    CHECK -->|"/dashboard"| PROTECT1{"🛡️ ProtectedRoute<br/>User Login?"}
    CHECK -->|"/admin"| PROTECT2{"🛡️ ProtectedRoute<br/>adminOnly"}
    
    LOGINPAGE --> SUBMIT["Submit Form"]
    SUBMIT --> AUTH{"AuthContext<br/>login(npm, pwd)"}
    AUTH -->|"DataContext<br/>loginUser()"| VERIFY{"Cek di Firestore<br/>users collection"}
    VERIFY -->|"NPM & Password cocok"| SUCCESS["✅ Set user state<br/>(tanpa password)"]
    VERIFY -->|"Tidak cocok"| FAIL["❌ Error:<br/>NPM atau Password salah"]
    FAIL --> LOGINPAGE
    
    SUCCESS --> ROLECHECK{"user.role?"}
    ROLECHECK -->|"admin"| ADMIN_DASH["📊 Admin Dashboard<br/>/admin"]
    ROLECHECK -->|"member"| MEMBER_DASH["📋 Member Dashboard<br/>/dashboard"]
    
    PROTECT1 -->|"❌ Belum login"| REDIR1["↩️ Redirect → /login"]
    PROTECT1 -->|"✅ Sudah login"| MEMBER_DASH
    
    PROTECT2 -->|"❌ Belum login"| REDIR2["↩️ Redirect → /login"]
    PROTECT2 -->|"✅ Login tapi bukan admin"| REDIR3["↩️ Redirect → /"]
    PROTECT2 -->|"✅ Login & admin"| ADMIN_DASH

    style START fill:#006a4e,color:#fff
    style SUCCESS fill:#16a34a,color:#fff
    style FAIL fill:#dc2626,color:#fff
    style ADMIN_DASH fill:#d4a843,color:#333
    style MEMBER_DASH fill:#006a4e,color:#fff
    style REDIR1 fill:#f97316,color:#fff
    style REDIR2 fill:#f97316,color:#fff
    style REDIR3 fill:#f97316,color:#fff
```

### Tabel Role & Akses

| Halaman | Public | Member | Admin |
|---------|:------:|:------:|:-----:|
| Beranda, Tentang, Struktur | ✅ | ✅ | ✅ |
| Kegiatan (list & detail) | ✅ | ✅ | ✅ |
| Leaderboard | ✅ | ✅ | ✅ |
| Forum (baca) | ✅ | ✅ | ✅ |
| Forum (posting/reply) | ❌ | ✅ | ✅ |
| Kerjakan Quiz | ❌ | ✅ | ✅ |
| Input Absensi | ❌ | ✅ | ✅ |
| Pendaftaran (form) | ✅ | ✅ | ✅ |
| Member Dashboard | ❌ | ✅ | ❌ |
| Admin Dashboard | ❌ | ❌ | ✅ |

---

## 6. Routing Map

```mermaid
graph LR
    subgraph "🌐 Public Routes"
        R1["/ <br/> Home"]
        R2["/tentang <br/> Tentang"]
        R3["/struktur <br/> Struktur"]
        R4["/kegiatan <br/> Kegiatan"]
        R5["/kegiatan/:id <br/> KegiatanDetail"]
        R6["/galeri <br/> Galeri"]
        R7["/kontak <br/> Kontak/Pendaftaran"]
        R8["/leaderboard <br/> Leaderboard"]
        R9["/forum <br/> Forum"]
    end

    subgraph "🔐 Auth Route"
        R10["/login <br/> Login"]
    end

    subgraph "🛡️ Protected Routes"
        R11["/dashboard <br/> MemberDashboard"]
        R12["/admin <br/> AdminDashboard"]
    end

    R1 -.->|"Tentang Kami →"| R2
    R1 -.->|"Lihat Kegiatan"| R4
    R4 -.->|"Klik card"| R5
    R5 -.->|"← Kembali"| R4
    R10 -.->|"Login sukses (member)"| R11
    R10 -.->|"Login sukses (admin)"| R12
    R10 -.->|"← Kembali ke Beranda"| R1

    style R10 fill:#d4a843,color:#333
    style R11 fill:#006a4e,color:#fff
    style R12 fill:#dc2626,color:#fff
```

### Layout Rendering

| Route | Navbar | Footer | Layout Khusus |
|-------|:------:|:------:|---------------|
| `/` sampai `/forum` | ✅ | ✅ | Standard Layout |
| `/login` | ❌ | ❌ | Full-screen centered card |
| `/admin` | ❌ | ❌ | Sidebar + Top Header sendiri |
| `/dashboard` | ✅ | ✅ | Standard Layout |

---

## 7. Data Model — Firebase Firestore

Semua data disimpan dalam satu **collection `appData`** dengan **8 document**, masing-masing menyimpan field `items` (array) dan `updatedAt`.

```mermaid
erDiagram
    APPDATA ||--o{ USERS : "doc: users"
    APPDATA ||--o{ KEGIATAN : "doc: kegiatan"
    APPDATA ||--o{ SUBMISSIONS : "doc: submissions"
    APPDATA ||--o{ ATTENDANCE : "doc: attendance"
    APPDATA ||--o{ FORUM : "doc: forum"
    APPDATA ||--o{ REGISTRATIONS : "doc: registrations"
    APPDATA ||--o{ FEEDBACK : "doc: feedback"
    APPDATA ||--|| REGSETTINGS : "doc: regSettings"

    USERS {
        string id PK "user-xxx"
        string name "Nama lengkap"
        string npm "Nomor Pokok Mahasiswa"
        string password "Plain text"
        string role "member | admin"
        string divisi "Nama divisi"
        date createdAt "Tanggal daftar"
    }

    KEGIATAN {
        string id PK "keg-xxx"
        string kategori "materi-soal | kajian | seminar | lomba | arsip"
        string title "Judul kegiatan"
        string description "Deskripsi"
        string status "open | closed (computed)"
        datetime openDate "Tanggal buka"
        datetime closeDate "Tanggal tutup"
        string type "soal | materi"
        string materiContent "Konten materi"
        array questions "Array soal quiz"
        string jadwal "Jadwal pelaksanaan"
        string tempat "Lokasi"
        string pemateri "Nama pemateri"
        string hadiah "Info hadiah"
        string linkUrl "Link dokumen"
        string createdBy "Pembuat"
        date createdAt "Tanggal dibuat"
    }

    SUBMISSIONS {
        string id PK "sub-xxx"
        string kegiatanId FK "→ kegiatan.id"
        string userId FK "→ users.id"
        string userName "Nama user"
        object answers "Jawaban user"
        number score "Nilai 0-100"
        datetime submittedAt "Waktu submit"
    }

    ATTENDANCE {
        string id PK "att-xxx"
        string kegiatanId FK "→ kegiatan.id"
        string userId FK "→ users.id"
        string userName "Nama user"
        string code "6 char uppercase"
        datetime timestamp "Waktu absen"
    }

    FORUM {
        string id PK "topic-xxx"
        string userId FK "→ users.id"
        string userName "Nama user"
        string title "Judul topik"
        string content "Isi konten"
        string category "umum | diskusi | tanya | sharing"
        array replies "Array balasan"
        datetime createdAt "Waktu dibuat"
    }

    REGISTRATIONS {
        string id PK "reg-xxx"
        string nama "Nama pendaftar"
        string npm "NPM pendaftar"
        string angkatan "Tahun angkatan"
        string alasan "Alasan bergabung"
        string status "pending | accepted | rejected"
        datetime submittedAt "Waktu daftar"
    }

    FEEDBACK {
        string id PK "fb-xxx"
        string nama "Nama pemberi"
        string jenis "kritik | saran | apresiasi"
        string pesan "Isi pesan"
        datetime createdAt "Waktu dibuat"
    }

    REGSETTINGS {
        boolean isOpen "Status pendaftaran"
        string waNumber "Nomor WhatsApp"
    }

    KEGIATAN ||--o{ SUBMISSIONS : "1 kegiatan → banyak submission"
    KEGIATAN ||--o{ ATTENDANCE : "1 kegiatan → banyak absensi"
    USERS ||--o{ SUBMISSIONS : "1 user → banyak submission"
    USERS ||--o{ ATTENDANCE : "1 user → banyak absensi"
    USERS ||--o{ FORUM : "1 user → banyak topik"
```

### Struktur Penyimpanan Firestore

```
Firestore Database
└── 📁 Collection: appData
    ├── 📄 users         → { items: [...], updatedAt: "ISO" }
    ├── 📄 kegiatan      → { items: [...], updatedAt: "ISO" }
    ├── 📄 submissions   → { items: [...], updatedAt: "ISO" }
    ├── 📄 attendance    → { items: [...], updatedAt: "ISO" }
    ├── 📄 forum         → { items: [...], updatedAt: "ISO" }
    ├── 📄 registrations → { items: [...], updatedAt: "ISO" }
    ├── 📄 feedback      → { items: [...], updatedAt: "ISO" }
    └── 📄 regSettings   → { isOpen: true, waNumber: "..." }
```

---

## 8. Alur Fitur Utama

### 8.1 Alur Quiz (Materi & Soal)

```mermaid
sequenceDiagram
    actor Admin
    actor Member
    participant FE as React Frontend
    participant DC as DataContext
    participant FS as Firestore

    Note over Admin,FS: === ADMIN: Buat Kegiatan + Soal ===
    Admin->>FE: Buka Admin Dashboard → Tab Kegiatan
    Admin->>FE: Klik "Tambah Kegiatan"
    Admin->>FE: Pilih kategori "Materi & Soal"
    Admin->>FE: Isi judul, deskripsi, materi
    Admin->>FE: Tambah soal via Quiz Builder
    Note right of FE: Tipe: Pilihan Ganda (A/B/C/D)<br/>atau Essay, dengan poin kustom
    Admin->>FE: Set periode (openDate - closeDate)
    FE->>DC: createKegiatan(data)
    DC->>FS: setDoc(kegiatan, updated)
    FS-->>DC: onSnapshot → update state

    Note over Member,FS: === MEMBER: Kerjakan Soal ===
    Member->>FE: Buka /kegiatan/:id
    FE->>DC: getKegiatanById(id)
    DC-->>FE: Data kegiatan + status (computed)
    
    alt Status = "open" & belum dikerjakan
        FE->>FE: Tampilkan Tab Soal
        Member->>FE: Jawab semua soal
        Member->>FE: Klik "Kirim Jawaban"
        FE->>FE: Auto-grading (PG)
        Note right of FE: Score = (benar/total PG) × 100
        FE->>DC: submitAnswer(kegId, userId, answers, score)
        DC->>FS: setDoc(submissions, updated)
        FE->>FE: Tampilkan Tab Hasil + Score
    else Status = "closed"
        FE->>FE: Tampilkan "🔒 Soal Ditutup"
    else Sudah dikerjakan
        FE->>FE: Tampilkan "✅ Sudah Dikerjakan"
    end
```

### 8.2 Alur Absensi Digital

```mermaid
sequenceDiagram
    actor Admin
    actor Member
    participant FE as React Frontend
    participant DC as DataContext
    participant FS as Firestore

    Note over Admin,FS: === ADMIN: Cetak Kode Absensi ===
    Admin->>FE: Admin Dashboard → Tab Kegiatan
    Admin->>FE: Klik ikon 📄 (Kode Absensi)
    FE->>DC: getAllCodesForKegiatan(kegId)
    DC->>DC: Generate kode per member
    Note right of DC: Hash: userId-kegiatanId-ksei2024<br/>→ 6 char uppercase (deterministik)
    DC-->>FE: Array {name, npm, code}
    FE->>FE: Generate HTML table → Print PDF
    Admin->>Admin: Bagikan kode ke anggota

    Note over Member,FS: === MEMBER: Input Kode Absensi ===
    Member->>FE: Buka /kegiatan/:id (non materi-soal)
    FE->>FE: Tampilkan form absensi
    Member->>FE: Input 6-digit kode (UPPERCASE)
    FE->>DC: recordAttendance(kegId, userId, code)
    DC->>DC: Validasi kode vs expected hash
    
    alt Kode benar & belum absen
        DC->>FS: setDoc(attendance, updated)
        DC-->>FE: { success: true }
        FE->>FE: "✅ Absensi berhasil!"
    else Kode salah
        DC-->>FE: { error: "Kode salah" }
        FE->>FE: "❌ Kode absensi salah"
    else Sudah absen
        DC-->>FE: { error: "Sudah absen" }
    end
```

### 8.3 Alur Sistem Gamifikasi & Poin

```mermaid
flowchart TD
    A["👤 Member Melakukan Aktivitas"] --> B{"Jenis Aktivitas?"}
    
    B -->|"📝 Mengerjakan Quiz"| C["+15 Poin"]
    B -->|"📋 Absensi Kegiatan"| D["+10 Poin"]
    
    C --> E["Hitung Total Poin"]
    D --> E
    
    E --> F{"Total Poin?"}
    
    F -->|"≥ 100"| G["🏆 Sangat Aktif<br/>(Gold Badge)"]
    F -->|"≥ 60"| H["⭐ Aktif<br/>(Blue Badge)"]
    F -->|"≥ 30"| I["📊 Cukup Aktif<br/>(Gray Badge)"]
    F -->|"< 30"| J["🌱 Pemula<br/>(Green Badge)"]
    
    G & H & I & J --> K["📊 Leaderboard Publik<br/>(Ranking otomatis)"]
    K --> L["🥇🥈🥉 Podium Top 3"]
    K --> M["📋 Full Ranking List"]

    style C fill:#006a4e,color:#fff
    style D fill:#7c3aed,color:#fff
    style G fill:#d4a843,color:#333
    style H fill:#2563eb,color:#fff
    style I fill:#6b7280,color:#fff
    style J fill:#16a34a,color:#fff
```

---

## 9. State Management — Context API

```mermaid
graph TB
    subgraph "DataContext (Global State)"
        direction TB
        S1["📊 State Data"]
        S2["users: User[]"]
        S3["kegiatan: Kegiatan[]"]
        S4["submissions: Submission[]"]
        S5["attendance: Attendance[]"]
        S6["forum: Topic[]"]
        S7["registrations: Registration[]"]
        S8["feedback: Feedback[]"]
        S9["regSettings: RegSettings"]
        S10["loading: boolean"]
        S1 --- S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10
    end

    subgraph "DataContext Functions (28 total)"
        direction TB
        F1["👤 User (4):<br/>loginUser, createUser,<br/>updateUser, deleteUser"]
        F2["📋 Kegiatan (4):<br/>getKegiatanById, createKegiatan,<br/>updateKegiatan, deleteKegiatan"]
        F3["📝 Submissions (4):<br/>getSubmissionsByKegiatan,<br/>getSubmissionsByUser,<br/>getUserSubmission, submitAnswer"]
        F4["📋 Attendance (5):<br/>getAttendanceByKegiatan,<br/>getUserAttendance, recordAttendance,<br/>getAllCodesForKegiatan,<br/>generateAttendanceCode"]
        F5["💬 Forum (3):<br/>getTopicById, createTopic,<br/>addReply, deleteTopic"]
        F6["📝 Registrations (4):<br/>submitRegistration,<br/>updateRegStatus,<br/>deleteRegistration,<br/>toggleRegistration"]
        F7["📣 Feedback (2):<br/>submitFeedback,<br/>deleteFeedback"]
    end

    subgraph "AuthContext"
        A1["user: User | null"]
        A2["login(npm, pwd): Result"]
        A3["logout(): void"]
        A4["isAdmin: boolean"]
    end

    style S1 fill:#006a4e,color:#fff
    style A1 fill:#00896a,color:#fff
```

### Ref Pattern untuk Stale Closure Prevention

```mermaid
flowchart LR
    A["useState(data)"] -->|"setiap update"| B["useRef.current = data"]
    B -->|"akses di callbacks"| C["useCallback functions"]
    C -->|"selalu data terbaru"| D["saveToFirestore()"]
    
    style A fill:#2563eb,color:#fff
    style B fill:#d4a843,color:#333
    style C fill:#006a4e,color:#fff
```

> [!TIP]
> DataContext menggunakan pattern `useRef` + `useCallback` untuk menghindari **stale closure** — semua fungsi CRUD mengakses data terbaru via `usersRef.current` bukan `users` state langsung. Ini mencegah race condition saat data sering berubah.

---

## 10. Deployment Architecture

```mermaid
graph TB
    subgraph "👨‍💻 Developer"
        DEV["Local Development<br/>npm run dev<br/>(Vite HMR @ :5173)"]
    end

    subgraph "📦 Version Control"
        GH["GitHub Repository<br/>dharmamudita/kseiriief"]
    end

    subgraph "🚀 Vercel Platform"
        VB["Vite Build<br/>(npm run build)"]
        CDN["Vercel Edge Network<br/>(Global CDN)"]
        RW["SPA Rewrite Rule<br/>/(.*) → /index.html"]
    end

    subgraph "☁️ Firebase Cloud"
        FP["Firebase Project<br/>ksei-riief-web"]
        FST["Firestore Database<br/>(asia-southeast1)"]
    end

    subgraph "🌍 End Users"
        U1["👤 Admin"]
        U2["👤 Member"]
        U3["👤 Publik"]
    end

    DEV -->|"git push"| GH
    GH -->|"Auto Deploy<br/>(CI/CD)"| VB
    VB -->|"dist/ files"| CDN
    CDN -->|"SPA Routing"| RW
    
    U1 & U2 & U3 -->|"HTTPS"| CDN
    CDN -->|"Serve React SPA"| U1 & U2 & U3
    U1 & U2 & U3 <-->|"Firestore SDK<br/>(WebSocket)"| FST

    style DEV fill:#646cff,color:#fff
    style GH fill:#1f2937,color:#fff
    style CDN fill:#000,color:#fff
    style FST fill:#ff9800,color:#fff
```

### Konfigurasi Deployment

```json
// vercel.json — SPA Routing
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

```javascript
// vite.config.js — Build Configuration
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()]
})
```

---

## 11. Arsitektur Admin Dashboard (Internal)

```mermaid
graph TD
    AD["AdminDashboard.jsx<br/>(54KB — Komponen terbesar)"]
    
    AD --> SIDEBAR["🔧 Sidebar Navigation"]
    AD --> HEADER["📊 Top Header Bar"]
    AD --> CONTENT["Main Content Area"]
    
    CONTENT --> TAB1["👥 Tab: Pengguna<br/>CRUD users, search, filter"]
    CONTENT --> TAB2["📋 Tab: Kegiatan<br/>CRUD kegiatan, quiz builder,<br/>category filter"]
    CONTENT --> TAB3["⭐ Tab: Keaktifan<br/>Ranking, poin, detail member"]
    CONTENT --> TAB4["📝 Tab: Pendaftaran<br/>Toggle buka/tutup,<br/>approve/reject"]
    CONTENT --> TAB5["💬 Tab: Kritik & Saran<br/>View & delete feedback"]
    
    subgraph "Modal System"
        M1["Modal: Tambah/Edit User"]
        M2["Modal: Tambah/Edit Kegiatan<br/>+ Quiz Builder"]
        M3["Modal: Hasil Quiz"]
        M4["Modal: Daftar Absensi"]
        M5["Modal: Detail Keaktifan Member"]
    end
    
    TAB1 --> M1
    TAB2 --> M2 & M3 & M4
    TAB3 --> M5

    style AD fill:#006a4e,color:#fff
    style SIDEBAR fill:#f3f4f6,color:#333,stroke:#e5e7eb
```

---

## 12. Ringkasan Arsitektur

| Aspek | Detail |
|-------|--------|
| **Pattern** | Single Page Application (SPA) |
| **Rendering** | Client-Side Rendering (CSR) |
| **State** | React Context API (DataContext + AuthContext) |
| **Database** | Firebase Firestore (Realtime, NoSQL) |
| **Sync** | `onSnapshot` listeners (8 docs) + `setDoc` writes |
| **Auth** | Custom auth via Firestore (NPM + Password) |
| **Routing** | Client-side dengan React Router DOM v7 |
| **Styling** | TailwindCSS v4 (utility-first, @theme config) |
| **Build** | Vite 6 dengan HMR |
| **Deploy** | Vercel (auto dari GitHub) |
| **Total Pages** | 12 halaman (7 publik + 1 auth + 2 protected + 1 galeri + 1 detail) |
| **Total Firestore Docs** | 8 documents dalam 1 collection |
| **Total Context Functions** | 28 fungsi CRUD + utility |

---

*Dokumen ini dibuat berdasarkan analisis langsung terhadap source code project KSEI RIIEF.*
