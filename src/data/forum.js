// ===== DATABASE: FORUM DISKUSI =====
// Menyimpan dan mengelola data forum diskusi antar anggota

const STORAGE_KEY = 'ksei_forum';

// --- Read ---
export const getTopics = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
export const saveTopics = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
export const getTopicById = (id) => getTopics().find(t => t.id === id);

// --- Create Topic ---
export const createTopic = (userId, userName, title, content, category) => {
  const topics = getTopics();
  const topic = {
    id: `topic-${Date.now()}`,
    userId, userName, title, content, category,
    replies: [],
    createdAt: new Date().toISOString(),
  };
  topics.unshift(topic);
  saveTopics(topics);
  return topic;
};

// --- Reply ---
export const addReply = (topicId, userId, userName, content) => {
  const topics = getTopics();
  const topic = topics.find(t => t.id === topicId);
  if (!topic) return null;
  const reply = {
    id: `reply-${Date.now()}`,
    userId, userName, content,
    createdAt: new Date().toISOString(),
  };
  topic.replies.push(reply);
  saveTopics(topics);
  return reply;
};

// --- Delete Topic (admin only) ---
export const deleteTopic = (topicId) => {
  const filtered = getTopics().filter(t => t.id !== topicId);
  saveTopics(filtered);
};

// --- Initialize ---
export const initializeForum = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    saveTopics([
      {
        id: 'topic-default-1',
        userId: 'admin-001', userName: 'Admin RIIEF',
        title: 'Selamat Datang di Forum KSEI RIIEF! 👋',
        content: 'Forum ini adalah tempat diskusi antar anggota KSEI RIIEF. Silakan bertanya, berbagi ilmu, atau berdiskusi tentang ekonomi Islam dan kegiatan UKM kita. Mari jaga adab berdiskusi dan saling menghormati.',
        category: 'umum',
        replies: [
          { id: 'reply-1', userId: 'admin-001', userName: 'Admin RIIEF', content: 'Jangan lupa ikuti kegiatan-kegiatan terbaru kami ya!', createdAt: '2024-03-02T10:00:00Z' },
        ],
        createdAt: '2024-03-01T08:00:00Z',
      },
      {
        id: 'topic-default-2',
        userId: 'admin-001', userName: 'Admin RIIEF',
        title: 'Apa saja perbedaan bank syariah dan bank konvensional?',
        content: 'Teman-teman, yuk diskusi tentang perbedaan mendasar antara bank syariah dan bank konvensional. Apa yang membuat bank syariah lebih sesuai dengan prinsip Islam?',
        category: 'diskusi',
        replies: [],
        createdAt: '2024-03-05T09:00:00Z',
      },
    ]);
  }
};
