import { useState } from 'react';
import { FiSearch, FiUsers, FiFileText, FiDollarSign } from 'react-icons/fi';
import { api } from '../services/api';

const ListadosView = () => {
  const [activeTab, setActiveTab] = useState('inquilinos');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [pagado, setPagado] = useState(true);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const buscarInquilinosPago = async () => {
    if (!desde || !hasta) { setError('Debe indicar fechas desde y hasta.'); return; }
    setLoading(true); setError(''); setSearched(true);
    try {
      const data = await api.listados.inquilinosPagos(desde, hasta, pagado);
      setResults(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const buscarRecibosCobrados = async () => {
    if (!desde || !hasta) { setError('Debe indicar fechas desde y hasta.'); return; }
    setLoading(true); setError(''); setSearched(true);
    try {
      const data = await api.listados.recibosCobrados(desde, hasta);
      setResults(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const buscarRecibosPendientes = async () => {
    if (!desde || !hasta) { setError('Debe indicar fechas desde y hasta.'); return; }
    setLoading(true); setError(''); setSearched(true);
    try {
      const data = await api.recibos.getPendientesRango(desde, hasta);
      setResults(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleSearch = () => {
    if (activeTab === 'inquilinos') buscarInquilinosPago();
    else if (activeTab === 'cobrados') buscarRecibosCobrados();
    else if (activeTab === 'pendientes') buscarRecibosPendientes();
  };

  const tabs = [
    { id: 'inquilinos', label: 'Inquilinos por pago', icon: <FiUsers /> },
    { id: 'cobrados', label: 'Recibos cobrados', icon: <FiDollarSign /> },
    { id: 'pendientes', label: 'Recibos pendientes', icon: <FiFileText /> },
  ];

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">Listados del Secretario</h1>
          <p className="page-description">Genera los listados requeridos por la gestión de la empresa.</p>
        </div>
      </header>

      {error && <div className="state-box state-box--error">{error}</div>}

      <section className="card panel">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button key={tab.id} type="button" className={activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}
              onClick={() => { setActiveTab(tab.id); setResults([]); setSearched(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="field-grid field-grid--wide" style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Desde</label>
            <input type="date" value={desde} onChange={e => setDesde(e.target.value)} className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Hasta</label>
            <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className="form-input" />
          </div>
          {activeTab === 'inquilinos' && (
            <div className="form-group">
              <label className="form-label">Estado de pago</label>
              <select value={pagado} onChange={e => setPagado(e.target.value === 'true')} className="form-input">
                <option value="true">Han pagado</option>
                <option value="false">NO han pagado</option>
              </select>
            </div>
          )}
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="button" className="btn-primary" onClick={handleSearch} disabled={loading}>
              <FiSearch /> {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {searched && !loading && results.length === 0 && (
          <div className="state-box state-box--empty">No se encontraron resultados para los filtros seleccionados.</div>
        )}

        {results.length > 0 && activeTab === 'inquilinos' && (
          <div className="table-wrap">
            <p className="panel-subtitle" style={{ marginBottom: '0.5rem' }}>{results.length} inquilinos encontrados</p>
            <table className="glass-table">
              <thead><tr><th>DNI</th><th>Nombre</th><th>Apellidos</th><th>Teléfono</th><th>Email</th><th>Fecha Alta</th></tr></thead>
              <tbody>
                {results.map(i => (
                  <tr key={i.dni}><td className="font-bold">{i.dni}</td><td>{i.nombre}</td><td>{i.apellidos}</td><td>{i.telefono || '-'}</td><td>{i.email || '-'}</td><td>{i.fechaAlta}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {results.length > 0 && (activeTab === 'cobrados' || activeTab === 'pendientes') && (
          <div className="table-wrap">
            <p className="panel-subtitle" style={{ marginBottom: '0.5rem' }}>{results.length} recibos encontrados</p>
            <table className="glass-table">
              <thead><tr><th>Nº Recibo</th><th>Inmueble</th><th>Inquilino</th><th>Fecha</th><th>Renta</th><th>Estado</th></tr></thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.id}>
                    <td className="font-bold">{r.numeroRecibo}</td><td>{r.inmuebleId}</td><td>{r.inquilinoDni || '-'}</td><td>{r.fechaEmision}</td>
                    <td>{Number(r.renta).toFixed(2)} €</td>
                    <td><span className={`badge ${r.cobrado ? 'badge--success' : 'badge--danger'}`}>{r.cobrado ? 'COBRADO' : 'PENDIENTE'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default ListadosView;
