// ===== STORE HUB =====
// File ini mengumpulkan semua database module agar mudah di-import

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

// --- Registrations ---
export {
  getRegistrations, saveRegistrations, getRegSettings, saveRegSettings,
  toggleRegistration, submitRegistration, updateRegStatus, deleteRegistration,
  initializeRegistrations,
} from './registrations';

// --- Feedback ---
export {
  getFeedback, saveFeedback, submitFeedback, deleteFeedback,
  initializeFeedback,
} from './feedback';

// --- Initialize All ---
import { initializeUsers } from './users';
import { initializeKegiatan } from './kegiatan';
import { initializeSubmissions } from './submissions';
import { initializeAttendance } from './attendance';
import { initializeForum } from './forum';
import { initializeRegistrations } from './registrations';
import { initializeFeedback } from './feedback';
import { syncAllFromCloud } from './fireSync';

export const initializeData = async () => {
  initializeUsers();
  initializeKegiatan();
  initializeSubmissions();
  initializeAttendance();
  initializeForum();
  initializeRegistrations();
  initializeFeedback();
  await syncAllFromCloud();
};
