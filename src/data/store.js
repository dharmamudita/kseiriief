// ===== STORE HUB =====
// File ini mengumpulkan semua database module agar mudah di-import
// Struktur database:
//   - users.js       → Manajemen pengguna (admin & member)
//   - kegiatan.js    → Manajemen kegiatan (materi, kajian, seminar, lomba)
//   - submissions.js → Manajemen pengerjaan soal/quiz
//   - attendance.js  → Manajemen absensi kegiatan
//   - forum.js       → Manajemen forum diskusi

// --- Users ---
export {
  getUsers, saveUsers, loginUser, logoutUser, getCurrentUser,
  createUser, updateUser, deleteUser, initializeUsers,
} from './users';

// --- Kegiatan ---
export {
  getKegiatan, saveKegiatan, getKegiatanById, computeStatus,
  createKegiatan, updateKegiatan, deleteKegiatan, initializeKegiatan,
} from './kegiatan';

// --- Submissions ---
export {
  getSubmissions, saveSubmissions,
  getSubmissionsByKegiatan, getSubmissionsByUser, getUserSubmission,
  submitAnswer, initializeSubmissions,
} from './submissions';

// --- Attendance ---
export {
  generateAttendanceCode, getAttendance, saveAttendance,
  getAttendanceByKegiatan, getUserAttendance,
  recordAttendance, getAllCodesForKegiatan, downloadAttendancePDF,
  initializeAttendance,
} from './attendance';

// --- Forum ---
export {
  getTopics, saveTopics, getTopicById,
  createTopic, addReply, deleteTopic, initializeForum,
} from './forum';

// --- Initialize All ---
import { initializeUsers } from './users';
import { initializeKegiatan } from './kegiatan';
import { initializeSubmissions } from './submissions';
import { initializeAttendance } from './attendance';
import { initializeForum } from './forum';
import { syncAllFromCloud } from './fireSync';

export const initializeData = async () => {
  // 1. Load defaults dulu (jika localStorage kosong)
  initializeUsers();
  initializeKegiatan();
  initializeSubmissions();
  initializeAttendance();
  initializeForum();
  // 2. Sync dari Firestore (override localStorage jika ada data cloud)
  await syncAllFromCloud();
};
