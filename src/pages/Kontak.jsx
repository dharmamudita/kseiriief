const Kontak = () => (
  <div>
    <section className="bg-hijau pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Kontak <span className="text-kuning">Kami</span></h1>
        <p className="text-white/50 text-sm">Hubungi kami untuk informasi lebih lanjut</p>
      </div>
    </section>

    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Informasi <span className="text-hijau">Kontak</span></h2>
            <p className="text-gray-400 text-sm mb-6">Jangan ragu untuk menghubungi kami.</p>
            <div className="space-y-3">
              {[
                { emoji: '📍', title: 'Alamat', value: 'Kampus UIN Raden Intan Lampung, Jl. Letkol H. Endro Suratmin, Bandar Lampung' },
                { emoji: '📧', title: 'Email', value: 'kseiriief@radenintan.ac.id' },
                { emoji: '📱', title: 'Telepon', value: '+62 812-xxxx-xxxx' },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-lg">{c.emoji}</span>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{c.title}</div>
                    <div className="text-gray-500 text-sm">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-5">Kirim Pesan</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau text-sm" placeholder="Nama lengkap" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau text-sm" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
                <textarea rows={4} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau text-sm resize-none" placeholder="Tulis pesan..." />
              </div>
              <button type="submit" className="w-full py-2.5 bg-hijau text-white font-semibold rounded-xl hover:bg-hijau-tua transition-colors text-sm">Kirim Pesan</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Kontak;
