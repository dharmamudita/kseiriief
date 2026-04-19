// ===== DATABASE: KEGIATAN MANAGEMENT =====
// Menyimpan dan mengelola data kegiatan (materi-soal, kajian, seminar, lomba)

import { getSubmissions, saveSubmissions } from './submissions';
import { getAttendance, saveAttendance } from './attendance';
import { saveAndSync } from './fireSync';

const STORAGE_KEY = 'ksei_kegiatan';

// --- Auto status berdasarkan tanggal & jam ---
export const computeStatus = (k) => {
  if (!k.openDate && !k.closeDate) return k.status || 'open';
  const now = new Date();
  const open = k.openDate ? new Date(k.openDate) : null;
  const close = k.closeDate ? new Date(k.closeDate) : null;
  if (open && now < open) return 'closed'; // belum dibuka
  if (close && now > close) return 'closed'; // sudah ditutup
  return 'open';
};

// --- Data Default ---
const defaultKegiatan = [
  {
    id: 'keg-1',
    kategori: 'materi-soal',
    title: 'Pengantar Ekonomi Syariah',
    description: 'Materi dasar tentang prinsip-prinsip ekonomi syariah dan perbedaannya dengan ekonomi konvensional.',
    type: 'soal',
    status: 'open',
    openDate: '2024-03-01',
    closeDate: '2026-12-31',
    createdAt: '2024-03-01',
    createdBy: 'Admin RIIEF',
    materiContent: 'Ekonomi syariah adalah sistem ekonomi yang berlandaskan pada Al-Quran dan Hadits. Prinsip utamanya meliputi: larangan riba, keadilan dalam transaksi, transparansi, dan pembagian risiko. Berbeda dengan ekonomi konvensional yang mengandalkan bunga sebagai instrumen utama, ekonomi syariah menggunakan sistem bagi hasil (mudharabah), jual beli (murabahah), dan sewa (ijarah).',
    questions: [
      { id: 'q1', type: 'pilihan_ganda', question: 'Apa prinsip utama ekonomi syariah?', options: ['Memaksimalkan keuntungan','Larangan riba dan keadilan','Sistem bunga tetap','Monopoli pasar'], correctAnswer: 1, points: 20 },
      { id: 'q2', type: 'pilihan_ganda', question: 'Mudharabah adalah sistem...', options: ['Jual beli','Sewa menyewa','Bagi hasil','Pinjam meminjam'], correctAnswer: 2, points: 20 },
      { id: 'q3', type: 'pilihan_ganda', question: 'Yang BUKAN termasuk akad dalam ekonomi syariah adalah...', options: ['Murabahah','Ijarah','Interest rate','Musyarakah'], correctAnswer: 2, points: 20 },
      { id: 'q4', type: 'essay', question: 'Jelaskan perbedaan utama antara ekonomi syariah dan ekonomi konvensional!', points: 20 },
      { id: 'q5', type: 'essay', question: 'Mengapa riba dilarang dalam Islam? Berikan contoh praktiknya!', points: 20 },
    ],
  },
  {
    id: 'keg-2',
    kategori: 'materi-soal',
    title: 'Kewirausahaan Islam',
    description: 'Soal tentang prinsip-prinsip kewirausahaan dalam perspektif Islam.',
    type: 'soal',
    status: 'open',
    openDate: '2024-03-15',
    closeDate: '2026-12-31',
    createdAt: '2024-03-15',
    createdBy: 'Admin RIIEF',
    materiContent: 'Kewirausahaan Islam menekankan pada bisnis yang halal, jujur, dan bermanfaat bagi masyarakat. Rasulullah SAW sendiri adalah seorang pedagang yang dikenal dengan kejujurannya.',
    questions: [
      { id: 'q1', type: 'pilihan_ganda', question: 'Siapa sahabat Nabi yang terkenal sebagai pengusaha sukses?', options: ['Abu Bakar','Umar bin Khattab','Abdurrahman bin Auf','Ali bin Abi Thalib'], correctAnswer: 2, points: 25 },
      { id: 'q2', type: 'pilihan_ganda', question: 'Prinsip utama bisnis dalam Islam adalah...', options: ['Profit maximization','Kejujuran dan amanah','Monopoli pasar','Spekulasi'], correctAnswer: 1, points: 25 },
      { id: 'q3', type: 'essay', question: 'Jelaskan etika bisnis menurut Islam!', points: 25 },
      { id: 'q4', type: 'essay', question: 'Bagaimana cara memulai usaha yang sesuai syariah?', points: 25 },
    ],
  },
  {
    id: 'keg-3',
    kategori: 'materi-soal',
    title: 'Perbankan Syariah',
    description: 'Materi tentang sistem perbankan syariah di Indonesia.',
    type: 'materi',
    status: 'open',
    openDate: '2024-04-01',
    closeDate: '2026-12-31',
    createdAt: '2024-04-01',
    createdBy: 'Admin RIIEF',
    materiContent: 'Perbankan syariah di Indonesia telah berkembang pesat sejak berdirinya Bank Muamalat Indonesia pada tahun 1991. Bank syariah beroperasi berdasarkan prinsip bagi hasil dan tidak menerapkan sistem bunga. Produk-produk utama meliputi: tabungan wadiah, deposito mudharabah, pembiayaan murabahah, dan lainnya. OJK mengatur dan mengawasi perbankan syariah di Indonesia.',
    questions: [],
  },
  {
    id: 'keg-4',
    kategori: 'kajian',
    title: 'Kajian Rutin: Fiqh Muamalah',
    description: 'Kajian rutin mingguan membahas hukum-hukum transaksi dalam Islam meliputi jual beli, sewa, pinjaman, dan kerjasama usaha.',
    status: 'open',
    openDate: '2024-02-15',
    closeDate: '2026-12-31',
    createdAt: '2024-02-15',
    createdBy: 'Admin RIIEF',
    jadwal: 'Setiap Jumat, 13:00 - 15:00 WIB',
    tempat: 'Ruang Diskusi FEBI Lt. 2',
    pemateri: 'Ustadz Ahmad Fauzi, M.Ag',
  },
  {
    id: 'keg-5',
    kategori: 'kajian',
    title: 'Kajian Bedah Buku: Ekonomi Islam',
    description: 'Seri bedah buku ekonomi Islam karya Dr. Muhammad Syafii Antonio tentang Bank Syariah.',
    status: 'open',
    openDate: '2024-03-10',
    closeDate: '2026-12-31',
    createdAt: '2024-03-10',
    createdBy: 'Admin RIIEF',
    jadwal: 'Setiap Sabtu, 09:00 - 11:00 WIB',
    tempat: 'Aula FEBI',
    pemateri: 'Tim Divisi RnD',
  },
  {
    id: 'keg-6',
    kategori: 'seminar',
    title: 'Seminar Nasional Ekonomi Digital Syariah',
    description: 'Seminar nasional yang membahas perkembangan fintech syariah, cryptocurrency halal, dan transformasi digital perbankan syariah.',
    status: 'open',
    openDate: '2024-04-05',
    closeDate: '2026-12-31',
    createdAt: '2024-04-05',
    createdBy: 'Admin RIIEF',
    jadwal: '20 April 2024, 08:00 - 16:00 WIB',
    tempat: 'Aula Utama UIN Raden Intan Lampung',
    pemateri: 'Dr. Irfan Syauqi Beik (IPB), Prof. Didin Hafidhuddin',
    kuota: 200,
  },
  {
    id: 'keg-7',
    kategori: 'seminar',
    title: 'Workshop Bisnis Plan Syariah',
    description: 'Workshop intensif penyusunan bisnis plan sesuai prinsip syariah untuk mahasiswa yang ingin memulai usaha.',
    status: 'closed',
    openDate: '2024-02-20',
    closeDate: '2024-03-05',
    createdAt: '2024-02-20',
    createdBy: 'Admin RIIEF',
    jadwal: '5 Maret 2024, 09:00 - 15:00 WIB',
    tempat: 'Lab Komputer FEBI',
    pemateri: 'Tim Divisi Entrepreneurship',
    kuota: 50,
  },
  {
    id: 'keg-8',
    kategori: 'lomba',
    title: 'Lomba Karya Tulis Ilmiah Ekonomi Islam',
    description: 'Kompetisi penulisan karya ilmiah tentang solusi ekonomi Islam untuk permasalahan ekonomi kontemporer.',
    status: 'open',
    openDate: '2024-04-10',
    closeDate: '2026-12-31',
    createdAt: '2024-04-10',
    createdBy: 'Admin RIIEF',
    jadwal: 'Deadline: 30 April 2024',
    tempat: 'Online (Submit via Google Form)',
    hadiah: 'Juara 1: Rp 2.000.000 | Juara 2: Rp 1.500.000 | Juara 3: Rp 1.000.000',
  },
  {
    id: 'keg-9',
    kategori: 'lomba',
    title: 'Islamic Business Competition',
    description: 'Kompetisi bisnis plan dan presentasi ide usaha berbasis syariah antar mahasiswa se-Lampung.',
    status: 'closed',
    openDate: '2024-01-15',
    closeDate: '2024-02-11',
    createdAt: '2024-01-15',
    createdBy: 'Admin RIIEF',
    jadwal: '10-11 Februari 2024',
    tempat: 'Gedung Serbaguna UIN Raden Intan',
    hadiah: 'Juara 1: Rp 3.000.000 + Trophy | Juara 2: Rp 2.000.000 | Juara 3: Rp 1.000.000',
  },
];

// --- Read (dengan auto-sync status berdasarkan tanggal) ---
export const getKegiatan = () => {
  const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return raw.map(k => ({ ...k, status: computeStatus(k) }));
};
export const saveKegiatan = (data) => saveAndSync(STORAGE_KEY, data);
export const getKegiatanById = (id) => {
  const k = getKegiatan().find(k => k.id === id);
  return k ? { ...k, status: computeStatus(k) } : null;
};

// --- Create ---
export const createKegiatan = (data) => {
  const list = getKegiatan();
  const item = { id: `keg-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0], ...data };
  list.push(item);
  saveKegiatan(list);
  return item;
};

// --- Update ---
export const updateKegiatan = (id, data) => {
  const list = getKegiatan().map(k => k.id === id ? { ...k, ...data } : k);
  saveKegiatan(list);
  return list;
};

// --- Delete ---
export const deleteKegiatan = (id) => {
  const list = getKegiatan().filter(k => k.id !== id);
  saveKegiatan(list);
  // Hapus submissions & attendance terkait
  const subs = getSubmissions().filter(s => s.kegiatanId !== id);
  saveSubmissions(subs);
  const atts = getAttendance().filter(a => a.kegiatanId !== id);
  saveAttendance(atts);
  return list;
};

// --- Initialize ---
export const initializeKegiatan = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    saveKegiatan(defaultKegiatan);
  }
};
