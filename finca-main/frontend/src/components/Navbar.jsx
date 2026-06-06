import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiGrid, FiLayers, FiBox, FiList, FiChevronRight, FiUsers, FiFileText, FiDollarSign, FiClipboard, FiBarChart2, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <FiHome /> },
    { path: '/inmuebles', label: 'Todos los inmuebles', icon: <FiList /> },
    { path: '/edificios', label: 'Edificios', icon: <FiGrid /> },
    { path: '/pisos', label: 'Pisos', icon: <FiLayers /> },
    { path: '/locales', label: 'Locales', icon: <FiBox /> },
    { path: '/inquilinos', label: 'Inquilinos', icon: <FiUsers /> },
    { path: '/recibos', label: 'Recibos', icon: <FiFileText /> },
    { path: '/movimientos', label: 'Movimientos', icon: <FiDollarSign /> },
    { path: '/listados', label: 'Listados', icon: <FiClipboard /> },
    { path: '/informes', label: 'Informes Fiscales', icon: <FiBarChart2 /> },
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

      <div className="navbar-footer" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', color: 'var(--color-text-muted)' }}>
          <FiUser />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{user?.username}</span>
            <span style={{ fontSize: '0.75rem' }}>{user?.rol}</span>
          </div>
        </div>
        <button 
          onClick={logout} 
          className="nav-link" 
          style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--color-danger)' }}
        >
          <FiLogOut />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
