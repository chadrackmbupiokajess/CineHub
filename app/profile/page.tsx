import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Mon Profil</h1>

      {/* Quick Menu Links */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <Link
          href="/favorites"
          className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors font-medium"
        >
          ⭐ Mes favoris
        </Link>
        <Link
          href="/profile"
          className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium"
        >
          👤 Mon profil
        </Link>
        <Link
          href="/about"
          className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors font-medium"
        >
          ℹ️ À propos
        </Link>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-4xl">👤</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Profil utilisateur - Authentification à venir
        </p>
      </div>
    </div>
  );
}
