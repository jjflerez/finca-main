import { useState } from 'react';
import { FiBarChart2, FiSearch } from 'react-icons/fi';
import { api } from '../services/api';

const InformesView = () => {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [informe, setInforme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const buscarInforme = async () => {
    setLoading(true); setError('');
    try {
      const data = await api.movimientos.getDeclaracionRenta(anio);
      setInforme(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">Informes Fiscales</h1>
          <p className="page-description">Informe detallado para la declaración de la renta con desglose por inmueble y tipo de concepto.</p>
        </div>
      </header>

      {error && <div className="state-box state-box--error">{error}</div>}

      <section className="card panel">
        <h2 className="panel-title">Declaración de la Renta</h2>
        <div className="field-grid" style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Año fiscal</label>
            <input type="number" min="2020" max="2030" value={anio} onChange={e => setAnio(Number(e.target.value))} className="form-input" />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="button" className="btn-primary" onClick={buscarInforme} disabled={loading}>
              <FiSearch /> {loading ? 'Generando...' : 'Generar informe'}
            </button>
          </div>
        </div>

        {informe && (
          <>
            {/* Resumen general */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Ingresos</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent)' }}>{Number(informe.totalIngresos).toFixed(2)} €</div>
              </div>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Gastos</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--danger, #ef4444)' }}>{Number(informe.totalGastos).toFixed(2)} €</div>
              </div>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Balance Neto</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: informe.balanceNeto >= 0 ? 'var(--accent)' : 'var(--danger, #ef4444)' }}>{Number(informe.balanceNeto).toFixed(2)} €</div>
              </div>
            </div>

            {/* Desglose por inmueble */}
            {informe.desglosePorInmueble && informe.desglosePorInmueble.length > 0 && (
              <>
                <h3 style={{ marginBottom: '0.75rem' }}><FiBarChart2 style={{ marginRight: 6 }} />Desglose por Inmueble</h3>
                <div className="table-wrap" style={{ marginBottom: '2rem' }}>
                  <table className="glass-table">
                    <thead><tr><th>Inmueble</th><th style={{ textAlign: 'right' }}>Ingresos</th><th style={{ textAlign: 'right' }}>Gastos</th><th style={{ textAlign: 'right' }}>Neto</th></tr></thead>
                    <tbody>
                      {informe.desglosePorInmueble.map(d => (
                        <tr key={d.inmuebleId}>
                          <td className="font-bold">{d.inmuebleId}</td>
                          <td style={{ textAlign: 'right' }}>{Number(d.ingresos).toFixed(2)} €</td>
                          <td style={{ textAlign: 'right' }}>{Number(d.gastos).toFixed(2)} €</td>
                          <td style={{ textAlign: 'right', fontWeight: 'bold', color: d.neto >= 0 ? 'var(--accent)' : 'var(--danger, #ef4444)' }}>{Number(d.neto).toFixed(2)} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Desglose por tipo de gasto */}
            {informe.desglosePorTipoGasto && informe.desglosePorTipoGasto.length > 0 && (
              <>
                <h3 style={{ marginBottom: '0.75rem' }}>Desglose por Tipo de Gasto</h3>
                <div className="table-wrap" style={{ marginBottom: '2rem' }}>
                  <table className="glass-table">
                    <thead><tr><th>Tipo de Gasto</th><th style={{ textAlign: 'right' }}>Total</th></tr></thead>
                    <tbody>
                      {informe.desglosePorTipoGasto.map(d => (
                        <tr key={d.concepto}><td>{d.concepto}</td><td style={{ textAlign: 'right' }}>{Number(d.total).toFixed(2)} €</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Desglose por tipo de ingreso */}
            {informe.desglosePorTipoIngreso && informe.desglosePorTipoIngreso.length > 0 && (
              <>
                <h3 style={{ marginBottom: '0.75rem' }}>Desglose por Tipo de Ingreso</h3>
                <div className="table-wrap">
                  <table className="glass-table">
                    <thead><tr><th>Tipo de Ingreso</th><th style={{ textAlign: 'right' }}>Total</th></tr></thead>
                    <tbody>
                      {informe.desglosePorTipoIngreso.map(d => (
                        <tr key={d.concepto}><td>{d.concepto}</td><td style={{ textAlign: 'right' }}>{Number(d.total).toFixed(2)} €</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {informe.desglosePorInmueble?.length === 0 && informe.desglosePorTipoGasto?.length === 0 && (
              <div className="state-box state-box--empty">No hay movimientos registrados para el año {anio}.</div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default InformesView;
