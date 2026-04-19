import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400">
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo.jpeg" alt="KSEI RIIEF" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-white font-bold text-sm">KSEI RIIEF</span>
          </div>
          <p className="text-sm leading-relaxed">Forum mahasiswa ekonomi Islam dan kewirausahaan UIN Raden Intan Lampung.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Navigasi</h4>
          <ul className="space-y-2 text-sm">
            {[['Beranda','/'],['Tentang','/tentang'],['Struktur','/struktur'],['Kegiatan','/kegiatan'],['Galeri','/galeri'],['Kontak','/kontak']].map(([n,p]) => (
              <li key={p}><Link to={p} className="hover:text-kuning transition-colors">{n}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Divisi</h4>
          <ul className="space-y-2 text-sm">
            {['Kaderisasi','Research & Dev','Public Relation','Entrepreneurship','Kesekretariatan','Kemuslimahan','Media & Komunikasi'].map(d => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Kontak</h4>
          <ul className="space-y-2 text-sm">
            <li>📍 Kampus UIN Raden Intan Lampung</li>
            <li>📧 kseiriief@radenintan.ac.id</li>
            <li>📱 +62 812-xxxx-xxxx</li>
          </ul>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} UKM KSEI RIIEF UIN Raden Intan Lampung
      </div>
    </div>
  </footer>
);

export default Footer;
