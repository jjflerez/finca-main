import { useCallback, useEffect, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { api } from '../services/api';

const InmueblesView = () => {
  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInmuebles = useCallback(async () => {
    try {
      const data = await api.inmuebles.getAll();
      setInmuebles(data);
      setError('');
    } catch (requestError) {
      setError(requestError.message || 'No se pudieron cargar los inmuebles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchInmuebles();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchInmuebles]);

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">Todos los inmuebles</h1>
          <p className="page-description">
            Vista unificada de edificios, pisos y locales activos para revisar el inventario completo.
          </p>
        </div>

        <div className="toolbar">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setLoading(true);
              void fetchInmuebles();
            }}
          >
            <FiRefreshCw />
            Refrescar
          </button>
        </div>
      </header>

      {error ? <div className="state-box state-box--error">{error}</div> : null}

      <section className="card panel">
        <div className="flex-between">
          <div>
            <h2 className="panel-title">Inventario activo</h2>
            <p className="panel-subtitle">{inmuebles.length} inmuebles activos</p>
          </div>
          <span className="inline-badge inline-badge--neutral">{inmuebles.length} registros</span>
        </div>

        {loading ? <div className="state-box">Cargando inmuebles...</div> : null}

        {!loading && inmuebles.length === 0 ? (
          <div className="state-box state-box--empty">No hay inmuebles registrados.</div>
        ) : null}

        {!loading && inmuebles.length > 0 ? (
          <div className="table-wrap">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Direccion completa</th>
                  <th>Edificio asociado</th>
                  <th>Estado</th>
                  <th>Superficie</th>
                </tr>
              </thead>
              <tbody>
                {inmuebles.map((inmueble) => (
                  <tr key={inmueble.id}>
                    <td className="text-primary font-bold">{inmueble.id}</td>
                    <td>{inmueble.tipo}</td>
                    <td>{inmueble.direccionCompleta}</td>
                    <td>{inmueble.edificioId || 'N/A'}</td>
                    <td>
                      <span
                        className={`inline-badge ${
                          inmueble.estado === 'LIBRE' ? 'inline-badge--success' : 'inline-badge--warning'
                        }`}
                      >
                        {inmueble.estado}
                      </span>
                    </td>
                    <td>{Number(inmueble.superficieM2).toFixed(2)} m2</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default InmueblesView;
