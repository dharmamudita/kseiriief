const Tentang = () => (
  <div>
    {/* Hero */}
    <section className="bg-hijau pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Tentang <span className="text-kuning">KSEI RIIEF</span></h1>
        <p className="text-white/50 text-sm">Mengenal lebih dekat UKM KSEI RIIEF UIN Raden Intan Lampung</p>
      </div>
    </section>

    {/* Content */}
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-hijau/10 text-hijau text-xs font-semibold mb-3">Profil Organisasi</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Raden Intan Islamic <span className="text-hijau">Entrepreneur Forum</span></h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">
              UKM KSEI RIIEF adalah Unit Kegiatan Mahasiswa di UIN Raden Intan Lampung yang bergerak dalam bidang kajian ekonomi Islam dan kewirausahaan.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Berawal dari UKM-Fakultas Syariah bernama KSEI RISEF pada tahun 2008. Pada 22 Januari 2024, resmi menjadi UKM tingkat Universitas.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-xs text-gray-400">Berdiri</div>
                <div className="text-sm font-bold text-gray-900">Mei 2008</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-xs text-gray-400">Tingkat</div>
                <div className="text-sm font-bold text-gray-900">Universitas</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3">Visi</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">Menjadi forum mahasiswa dalam ekonomi Islam dan kewirausahaan yang unggul, objektif, komunikatif dan edukatif.</p>
            <h3 className="font-bold text-gray-900 mb-3">Misi</h3>
            <ul className="space-y-2.5">
              {['Memberdayakan sistem ekonomi Islam.','Mengembangkan kewirausahaan berbasis ekonomi Islam.','Menjalin ukhuwah antar KSEI.','Membangun budaya Islamiah & professional.','Kontribusi penerapan ekonomi Islam di masyarakat.'].map((m,i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-500">
                  <span className="w-5 h-5 rounded bg-hijau/10 text-hijau text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Perjalanan <span className="text-hijau">Sejarah</span></h2>
        <p className="text-gray-400 text-sm text-center mb-10">Jejak langkah KSEI RIIEF dari awal hingga sekarang</p>
        <div className="space-y-4">
          {[
            { year: '2008', title: 'Berdiri sebagai UKM-F KSEI RISEF', desc: 'Awalnya bernama UKM-Fakultas KSEI RISEF di Fakultas Syariah.' },
            { year: '2010+', title: 'Pindah ke FEBI', desc: 'Berpindah menjadi UKM Fakultas di Fakultas Ekonomi Bisnis Islam.' },
            { year: '2024', title: 'Resmi Menjadi UKM-U RIIEF', desc: 'Pada 22 Januari 2024, resmi menjadi UKM tingkat Universitas.' },
          ].map((t, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-14 h-14 rounded-xl bg-hijau text-white flex items-center justify-center font-bold text-xs shrink-0">{t.year}</div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 flex-1">
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{t.title}</h3>
                <p className="text-gray-500 text-sm">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Tentang;
