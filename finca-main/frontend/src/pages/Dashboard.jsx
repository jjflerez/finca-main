import { useEffect, useState } from 'react';
import { FiHome, FiLayers, FiGrid, FiBox } from 'react-icons/fi';
import { api } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEdificios: 0,
    totalPisos: 0,
    pisosLibres: 0,
    totalLocales: 0,
    localesLibres: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');

      try {
        const [edificios, pisos, locales] = await Promise.all([
          api.edificios.getAll(),
          api.pisos.getAll(),
          api.locales.getAll(),
        ]);

        const pisosLibres = pisos.filter((piso) => piso.estado === 'LIBRE').length;
        const localesLibres = locales.filter((local) => local.estado === 'LIBRE').length;

        setStats({
          totalEdificios: edificios.length,
          totalPisos: pisos.length,
          pisosLibres,
          totalLocales: locales.length,
          localesLibres,
        });
      } catch (requestError) {
        setError(requestError.message || 'No se pudieron cargar las metricas.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="loading">Cargando metricas...</div>;

  return (
    <div className="page-shell dashboard">
      <header className="page-header">
        <div>
          <h1 className="page-title">Resumen general</h1>
          <p className="page-description">
            Vista rapida del inventario activo y su disponibilidad actual.
          </p>
        </div>
      </header>

      {error ? <div className="state-box state-box--error">{error}</div> : null}

      <div className="stats-grid">
        <article className="card stat-card">
          <div className="stat-icon stat-icon--primary">
            <FiGrid />
          </div>
          <h3 className="stat-label">Edificios</h3>
          <div className="stat-value">{stats.totalEdificios}</div>
        </article>

        <article className="card stat-card">
          <div className="stat-icon stat-icon--accent">
            <FiLayers />
          </div>
          <h3 className="stat-label">Pisos activos</h3>
          <div className="stat-value">{stats.totalPisos}</div>
          <p className="stat-detail">{stats.pisosLibres} libres</p>
        </article>

        <article className="card stat-card">
          <div className="stat-icon stat-icon--success">
            <FiBox />
          </div>
          <h3 className="stat-label">Locales activos</h3>
          <div className="stat-value">{stats.totalLocales}</div>
          <p className="stat-detail">{stats.localesLibres} libres</p>
        </article>

        <article className="card stat-card stat-card--wide">
          <div className="stat-icon stat-icon--neutral">
            <FiHome />
          </div>
          <h3 className="stat-label">Inventario disponible</h3>
          <div className="stat-value">{stats.pisosLibres + stats.localesLibres}</div>
          <p className="stat-detail">Unidades listas para asignacion o alquiler</p>
        </article>
      </div>
    </div>
  );
};

export default Dashboard;
