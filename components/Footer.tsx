const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white p-4 mt-8 shadow-inner">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} CineHub. Tous droits réservés.</p>
        <p className="mt-1">
          Données fournies par <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">TMDb</a>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
