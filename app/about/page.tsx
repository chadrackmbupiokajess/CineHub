import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">À Propos de CineHub</h1>

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
          className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors font-medium"
        >
          👤 Mon profil
        </Link>
        <Link
          href="/about"
          className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium"
        >
          ℹ️ À propos
        </Link>
      </div>
      
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">À propos</h2>
          <p className="text-gray-700 dark:text-gray-300">
            CineHub est une plateforme de découverte de films et de séries TV, 
            propulsée par l'API TMDb (The Movie Database). Notre objectif est de vous 
            offrir une expérience fluide et intuitive pour explorer le monde du cinéma.
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Fonctionnalités</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Découvrez les films populaires et tendances</li>
            <li>Recherchez vos films et séries préférés</li>
            <li>Filtrez par catégorie (Films, Séries, Nouveautés, Documentaires)</li>
            <li>Consultez les détails complets avec trailers</li>
            <li>Ajouter à vos favoris</li>
          </ul>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Données</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Toutes les données sur les films et séries TV proviennent de 
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 ml-1">
              TMDb
            </a>
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Version</h2>
          <p className="text-gray-700 dark:text-gray-300">
            CineHub v1.0 - 2025
          </p>
        </div>
      </div>
    </div>
  );
}
