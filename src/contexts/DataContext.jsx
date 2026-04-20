// ===== DATA CONTEXT =====
// Semua data langsung dari Firestore (realtime), TANPA localStorage
// Data otomatis sinkron di semua device

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const DataContext = createContext();
export const useData = () => useContext(DataContext);

// Helper: compute status kegiatan berdasarkan tanggal
const computeStatus = (k) => {
  if (!k.openDate && !k.closeDate) return k.status || 'open';
  const now = new Date();
  const open = k.openDate ? new Date(k.openDate) : null;
  const close = k.closeDate ? new Date(k.closeDate) : null;
  if (open && now < open) return 'closed';
  if (close && now > close) return 'closed';
  return 'open';
};

// Helper: generate attendance code
const generateAttendanceCode = (userId, kegiatanId) => {
  const str = `${userId}-${kegiatanId}-ksei2024`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  let h = Math.abs(hash);
  for (let i = 0; i < 6; i++) {
    code += chars[h % chars.length];
    h = Math.floor(h / chars.length) + (i * 7);
  }
  return code;
};

// Default admin
const defaultAdmin = {
  id: 'admin-001',
  name: 'Admin RIIEF',
  npm: 'admin',
  password: 'admin123',
  role: 'admin',
  divisi: '',
  createdAt: '2024-01-22',
};

// Firestore document references
const DOCS = {
  users: doc(db, 'appData', 'users'),
  kegiatan: doc(db, 'appData', 'kegiatan'),
  submissions: doc(db, 'appData', 'submissions'),
  attendance: doc(db, 'appData', 'attendance'),
  forum: doc(db, 'appData', 'forum'),
  registrations: doc(db, 'appData', 'registrations'),
  feedback: doc(db, 'appData', 'feedback'),
  regSettings: doc(db, 'appData', 'regSettings'),
};

// Save to Firestore
const saveToFirestore = async (key, data) => {
  try {
    await setDoc(DOCS[key], { items: data, updatedAt: new Date().toISOString() });
  } catch (e) {
    console.warn('Firestore save error:', key, e.message);
  }
};

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [kegiatan, setKegiatan] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [forum, setForum] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [regSettings, setRegSettings] = useState({ isOpen: true, waNumber: '6281234567890' });
  const [loading, setLoading] = useState(true);

  // ===== REALTIME LISTENERS =====
  useEffect(() => {
    let loadedCount = 0;
    const totalDocs = 8;
    const checkLoaded = () => { loadedCount++; if (loadedCount >= totalDocs) setLoading(false); };

    const unsubs = [
      onSnapshot(DOCS.users, (snap) => {
        if (snap.exists() && snap.data().items) {
          setUsers(snap.data().items);
        } else {
          // First time: create default admin
          const defaultData = [defaultAdmin];
          setUsers(defaultData);
          saveToFirestore('users', defaultData);
        }
        checkLoaded();
      }, () => checkLoaded()),

      onSnapshot(DOCS.kegiatan, (snap) => {
        if (snap.exists() && snap.data().items) {
          setKegiatan(snap.data().items.map(k => ({ ...k, status: computeStatus(k) })));
        } else {
          setKegiatan([]);
          saveToFirestore('kegiatan', []);
        }
        checkLoaded();
      }, () => checkLoaded()),

      onSnapshot(DOCS.submissions, (snap) => {
        setSubmissions(snap.exists() && snap.data().items ? snap.data().items : []);
        if (!snap.exists()) saveToFirestore('submissions', []);
        checkLoaded();
      }, () => checkLoaded()),

      onSnapshot(DOCS.attendance, (snap) => {
        setAttendance(snap.exists() && snap.data().items ? snap.data().items : []);
        if (!snap.exists()) saveToFirestore('attendance', []);
        checkLoaded();
      }, () => checkLoaded()),

      onSnapshot(DOCS.forum, (snap) => {
        setForum(snap.exists() && snap.data().items ? snap.data().items : []);
        if (!snap.exists()) saveToFirestore('forum', []);
        checkLoaded();
      }, () => checkLoaded()),

      onSnapshot(DOCS.registrations, (snap) => {
        setRegistrations(snap.exists() && snap.data().items ? snap.data().items : []);
        if (!snap.exists()) saveToFirestore('registrations', []);
        checkLoaded();
      }, () => checkLoaded()),

      onSnapshot(DOCS.feedback, (snap) => {
        setFeedback(snap.exists() && snap.data().items ? snap.data().items : []);
        if (!snap.exists()) saveToFirestore('feedback', []);
        checkLoaded();
      }, () => checkLoaded()),

      onSnapshot(DOCS.regSettings, (snap) => {
        if (snap.exists() && snap.data().isOpen !== undefined) {
          setRegSettings(snap.data());
        } else {
          const defaults = { isOpen: true, waNumber: '6281234567890' };
          setRegSettings(defaults);
          setDoc(DOCS.regSettings, defaults).catch(() => {});
        }
        checkLoaded();
      }, () => checkLoaded()),
    ];

    // Safety timeout: if Firebase is slow, stop loading after 5s
    const timeout = setTimeout(() => setLoading(false), 5000);

    return () => {
      unsubs.forEach(u => u());
      clearTimeout(timeout);
    };
  }, []);

  // ===== USER FUNCTIONS =====
  const loginUser = useCallback((npm, password) => {
    const user = users.find(u => u.npm === npm && u.password === password);
    if (user) {
      const { password: _, ...safe } = user;
      return safe;
    }
    return null;
  }, [users]);

  const createUser = useCallback(async (data) => {
    if (users.find(u => u.npm === data.npm)) return { error: 'NPM sudah terdaftar' };
    const newUser = { id: `user-${Date.now()}`, ...data, createdAt: new Date().toISOString().split('T')[0] };
    const updated = [...users, newUser];
    await saveToFirestore('users', updated);
    return { success: true };
  }, [users]);

  const updateUser = useCallback(async (id, data) => {
    const dup = users.find(u => u.npm === data.npm && u.id !== id);
    if (dup) return { error: 'NPM sudah digunakan user lain' };
    const updated = users.map(u => u.id === id ? { ...u, ...data } : u);
    await saveToFirestore('users', updated);
    return { success: true };
  }, [users]);

  const deleteUser = useCallback(async (id) => {
    const updated = users.filter(u => u.id !== id);
    await saveToFirestore('users', updated);
  }, [users]);

  // ===== KEGIATAN FUNCTIONS =====
  const getKegiatanById = useCallback((id) => {
    const k = kegiatan.find(k => k.id === id);
    return k ? { ...k, status: computeStatus(k) } : null;
  }, [kegiatan]);

  const createKegiatan = useCallback(async (data) => {
    const item = { id: `keg-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0], ...data };
    const rawKegiatan = kegiatan.map(k => { const { status, ...rest } = k; return rest; });
    const updated = [...rawKegiatan, item];
    await saveToFirestore('kegiatan', updated);
    return item;
  }, [kegiatan]);

  const updateKegiatan = useCallback(async (id, data) => {
    const rawKegiatan = kegiatan.map(k => { const { status, ...rest } = k; return rest; });
    const updated = rawKegiatan.map(k => k.id === id ? { ...k, ...data } : k);
    await saveToFirestore('kegiatan', updated);
  }, [kegiatan]);

  const deleteKegiatan = useCallback(async (id) => {
    const rawKegiatan = kegiatan.map(k => { const { status, ...rest } = k; return rest; });
    const updated = rawKegiatan.filter(k => k.id !== id);
    await saveToFirestore('kegiatan', updated);
    // Also delete related submissions and attendance
    const updatedSubs = submissions.filter(s => s.kegiatanId !== id);
    await saveToFirestore('submissions', updatedSubs);
    const updatedAtts = attendance.filter(a => a.kegiatanId !== id);
    await saveToFirestore('attendance', updatedAtts);
  }, [kegiatan, submissions, attendance]);

  // ===== SUBMISSION FUNCTIONS =====
  const getSubmissionsByKegiatan = useCallback((kegiatanId) => {
    return submissions.filter(s => s.kegiatanId === kegiatanId);
  }, [submissions]);

  const getSubmissionsByUser = useCallback((userId) => {
    return submissions.filter(s => s.userId === userId);
  }, [submissions]);

  const getUserSubmission = useCallback((kegiatanId, userId) => {
    return submissions.find(s => s.kegiatanId === kegiatanId && s.userId === userId);
  }, [submissions]);

  const submitAnswer = useCallback(async (kegiatanId, userId, userName, answers, score) => {
    const submission = {
      id: `sub-${Date.now()}`,
      kegiatanId, userId, userName, answers, score,
      submittedAt: new Date().toISOString(),
    };
    const existing = submissions.findIndex(s => s.kegiatanId === kegiatanId && s.userId === userId);
    let updated;
    if (existing >= 0) {
      updated = [...submissions];
      updated[existing] = submission;
    } else {
      updated = [...submissions, submission];
    }
    await saveToFirestore('submissions', updated);
    return submission;
  }, [submissions]);

  // ===== ATTENDANCE FUNCTIONS =====
  const getAttendanceByKegiatan = useCallback((kegiatanId) => {
    return attendance.filter(a => a.kegiatanId === kegiatanId);
  }, [attendance]);

  const getUserAttendance = useCallback((kegiatanId, userId) => {
    return attendance.find(a => a.kegiatanId === kegiatanId && a.userId === userId);
  }, [attendance]);

  const recordAttendance = useCallback(async (kegiatanId, userId, userName, code) => {
    const user = users.find(u => u.id === userId);
    if (!user) return { error: 'User tidak ditemukan' };
    const expectedCode = generateAttendanceCode(userId, kegiatanId);
    if (code.toUpperCase() !== expectedCode) return { error: 'Kode absensi salah' };
    const exists = attendance.find(a => a.kegiatanId === kegiatanId && a.userId === userId);
    if (exists) return { error: 'Anda sudah absen untuk kegiatan ini' };
    const record = {
      id: `att-${Date.now()}`,
      kegiatanId, userId, userName,
      code: expectedCode,
      timestamp: new Date().toISOString(),
    };
    const updated = [...attendance, record];
    await saveToFirestore('attendance', updated);
    return { success: true };
  }, [users, attendance]);

  const getAllCodesForKegiatan = useCallback((kegiatanId) => {
    const members = users.filter(u => u.role !== 'admin');
    return members.map(u => ({
      userId: u.id,
      name: u.name,
      npm: u.npm,
      divisi: u.divisi || '-',
      code: generateAttendanceCode(u.id, kegiatanId),
    }));
  }, [users]);

  // ===== FORUM FUNCTIONS =====
  const getTopicById = useCallback((id) => {
    return forum.find(t => t.id === id);
  }, [forum]);

  const createTopic = useCallback(async (userId, userName, title, content, category) => {
    const topic = {
      id: `topic-${Date.now()}`,
      userId, userName, title, content, category,
      replies: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [topic, ...forum];
    await saveToFirestore('forum', updated);
    return topic;
  }, [forum]);

  const addReply = useCallback(async (topicId, userId, userName, content) => {
    const topicIndex = forum.findIndex(t => t.id === topicId);
    if (topicIndex < 0) return null;
    const reply = {
      id: `reply-${Date.now()}`,
      userId, userName, content,
      createdAt: new Date().toISOString(),
    };
    const updated = forum.map((t, i) => {
      if (i === topicIndex) return { ...t, replies: [...t.replies, reply] };
      return t;
    });
    await saveToFirestore('forum', updated);
    return reply;
  }, [forum]);

  const deleteTopic = useCallback(async (topicId) => {
    const updated = forum.filter(t => t.id !== topicId);
    await saveToFirestore('forum', updated);
  }, [forum]);

  // ===== REGISTRATION FUNCTIONS =====
  const submitRegistration = useCallback(async (data) => {
    const exists = registrations.find(r => r.npm === data.npm);
    if (exists) return { error: 'NPM ini sudah pernah mendaftar' };
    const reg = { id: `reg-${Date.now()}`, ...data, status: 'pending', submittedAt: new Date().toISOString() };
    const updated = [...registrations, reg];
    await saveToFirestore('registrations', updated);
    return { success: true, reg };
  }, [registrations]);

  const updateRegStatus = useCallback(async (id, status) => {
    const updated = registrations.map(r => r.id === id ? { ...r, status } : r);
    await saveToFirestore('registrations', updated);
  }, [registrations]);

  const deleteRegistration = useCallback(async (id) => {
    const updated = registrations.filter(r => r.id !== id);
    await saveToFirestore('registrations', updated);
  }, [registrations]);

  const toggleRegistration = useCallback(async () => {
    const updated = { ...regSettings, isOpen: !regSettings.isOpen };
    await setDoc(DOCS.regSettings, updated);
  }, [regSettings]);

  // ===== FEEDBACK FUNCTIONS =====
  const submitFeedback = useCallback(async (nama, jenis, pesan) => {
    const fb = { id: `fb-${Date.now()}`, nama, jenis, pesan, createdAt: new Date().toISOString() };
    const updated = [fb, ...feedback];
    await saveToFirestore('feedback', updated);
    return fb;
  }, [feedback]);

  const deleteFeedback = useCallback(async (id) => {
    const updated = feedback.filter(f => f.id !== id);
    await saveToFirestore('feedback', updated);
  }, [feedback]);

  const value = {
    // State
    users, kegiatan, submissions, attendance, forum, registrations, feedback, regSettings, loading,
    // User
    loginUser, createUser, updateUser, deleteUser,
    // Kegiatan
    getKegiatanById, createKegiatan, updateKegiatan, deleteKegiatan, computeStatus,
    // Submissions
    getSubmissionsByKegiatan, getSubmissionsByUser, getUserSubmission, submitAnswer,
    // Attendance
    getAttendanceByKegiatan, getUserAttendance, recordAttendance, getAllCodesForKegiatan, generateAttendanceCode,
    // Forum
    getTopicById, createTopic, addReply, deleteTopic,
    // Registrations
    submitRegistration, updateRegStatus, deleteRegistration, toggleRegistration,
    // Feedback
    submitFeedback, deleteFeedback,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
