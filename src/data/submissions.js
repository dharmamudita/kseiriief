// ===== DATABASE: SUBMISSION MANAGEMENT =====
// Menyimpan dan mengelola data pengerjaan soal/quiz oleh pengguna

const STORAGE_KEY = 'ksei_submissions';

// --- Read ---
export const getSubmissions = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
export const saveSubmissions = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export const getSubmissionsByKegiatan = (kegiatanId) => getSubmissions().filter(s => s.kegiatanId === kegiatanId);
export const getSubmissionsByUser = (userId) => getSubmissions().filter(s => s.userId === userId);
export const getUserSubmission = (kegiatanId, userId) => getSubmissions().find(s => s.kegiatanId === kegiatanId && s.userId === userId);

// --- Create / Update ---
export const submitAnswer = (kegiatanId, userId, userName, answers, score) => {
  const subs = getSubmissions();
  const existing = subs.findIndex(s => s.kegiatanId === kegiatanId && s.userId === userId);
  const submission = {
    id: `sub-${Date.now()}`,
    kegiatanId,
    userId,
    userName,
    answers,
    score,
    submittedAt: new Date().toISOString(),
  };

  if (existing >= 0) {
    subs[existing] = submission;
  } else {
    subs.push(submission);
  }

  saveSubmissions(subs);
  return submission;
};

// --- Initialize ---
export const initializeSubmissions = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    saveSubmissions([]);
  }
};
