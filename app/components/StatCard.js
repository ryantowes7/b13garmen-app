// components/StatCard.js
// Komponen sederhana untuk menampilkan kartu statistik di dashboard

export default function StatCard({ title, value, icon, colorClass }) {
  const Icon = icon; // Asumsi icon adalah komponen (cth: dari react-icons)

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      {/* Ikon */}
      {Icon && (
        <div className={`p-3 rounded-full mr-4 ${colorClass || 'bg-gray-100 text-gray-700'}`}>
          <Icon size={28} />
        </div>
      )}
      
      {/* Konten Teks */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-3xl font-bold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}