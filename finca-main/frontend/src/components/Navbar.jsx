import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiGrid, FiLayers, FiBox, FiList, FiChevronRight } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <FiHome /> },
    { path: '/inmuebles', label: 'Todos los inmuebles', icon: <FiList /> },
    { path: '/edificios', label: 'Edificios', icon: <FiGrid /> },
    { path: '/pisos', label: 'Pisos', icon: <FiLayers /> },
    { path: '/locales', label: 'Locales', icon: <FiBox /> },
  ];

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-brand">
        <span className="brand-icon" aria-hidden="true">
          <FiLayers />
        </span>
        <div className="brand-copy">
          <span className="brand-text">AgroTech Fincas</span>
          <span className="brand-subtitle">Gestión de inmuebles</span>
        </div>
      </div>

      <div className="navbar-menu">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="navbar-footer">
        <Link to="/" className="nav-link nav-link-cta">
          <FiChevronRight />
          <span>Volver al inicio</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
