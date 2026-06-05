import { useCallback, useEffect, useState } from 'react';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import { api } from '../services/api';

const initialForm = { tipo: 'INGRESO', importe: '', concepto: '', descripcion: '', inmuebleId: '', cuentaBancariaId: '' };

export default function MovimientosView() {
  const [movimientos, setMovimientos] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showBancoForm, setShowBancoForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [bancoForm, setBancoForm] = useState({ nombre: '', codigo: '' });
  const [anio, setAnio] = useState(new Date().getFullYear());

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [movs, bcos, res] = await Promise.all([
        api.movimientos.getAll(),
        api.bancos.getAll(),
        api.movimientos.getResumenAnual(anio),
      ]);
      setMovimientos(movs);
      setBancos(bcos);
      setResumen(res);
      setError('');
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [anio]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    const payload = {
      ...form, importe: Number(form.importe),
      cuentaBancaria: form.cuentaBancariaId ? { id: Number(form.cuentaBancariaId) } : null,
    };
    try {
      await api.movimientos.create(payload);
      setShowForm(false); setForm(initialForm); await fetchAll();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };

  const handleCrearBanco = async (e) => {
    e.preventDefault();
    try { await api.bancos.create(bancoForm); setShowBancoForm(false); setBancoForm({nombre:'',codigo:''}); await fetchAll(); }
    catch (e) { setError(e.message); }
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">Movimientos Bancarios</h1>
          <p className="page-description">Gestión económica: gastos, ingresos y declaración de la renta.</p>
        </div>
        <div className="toolbar">
          <button className="btn-secondary" onClick={() => setShowBancoForm(p=>!p)}><FiPlus /> Banco</button>
          <button className="btn-secondary" onClick={fetchAll}><FiRefreshCw /> Refrescar</button>
          <button className="btn-primary" onClick={() => setShowForm(p=>!p)}><FiPlus /> Nuevo movimiento</button>
        </div>
      </header>

      {error && <div className="state-box state-box--error">{error}</div>}

      {/* Resumen económico */}
      {resumen && (
        <section style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',marginBottom:'1.5rem'}}>
          {[
            {label:'Total Ingresos '+anio, valor: resumen.totalIngresos, color:'#4ade80'},
            {label:'Total Gastos '+anio, valor: resumen.totalGastos, color:'#f87171'},
            {label:'Balance '+anio, valor: resumen.balance, color: resumen.balance >= 0 ? '#4ade80' : '#f87171'},
          ].map(({label, valor, color}) => (
            <div key={label} className="card" style={{padding:'1.5rem',textAlign:'center'}}>
              <p style={{color:'#a0b0a0',fontSize:'0.85rem',marginBottom:'0.5rem'}}>{label}</p>
              <p style={{color, fontSize:'1.8rem', fontWeight:'bold'}}>{valor?.toFixed(2)} €</p>
            </div>
          ))}
          <div style={{gridColumn:'1/-1',display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <label style={{color:'#a0b0a0'}}>Año para el informe:</label>
            <input type="number" value={anio} onChange={e=>setAnio(Number(e.target.value))} className="form-input" style={{width:'100px'}} />
          </div>
        </section>
      )}

      {/* Formulario banco */}
      {showBancoForm && (
        <section className="card panel">
          <h2 className="panel-title">Nuevo banco</h2>
          <form onSubmit={handleCrearBanco} className="field-grid">
            <div className="form-group"><label className="form-label">Nombre del banco</label>
              <input required name="nombre" value={bancoForm.nombre} onChange={e=>setBancoForm(p=>({...p,nombre:e.target.value}))} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Código</label>
              <input name="codigo" value={bancoForm.codigo} onChange={e=>setBancoForm(p=>({...p,codigo:e.target.value}))} className="form-input" /></div>
            <div className="form-group field-span-2"><button type="submit" className="btn-primary">Crear banco</button></div>
          </form>
        </section>
      )}

      {/* Bancos registrados */}
      {bancos.length > 0 && (
        <section className="card panel" style={{marginBottom:'1rem'}}>
          <h2 className="panel-title">Bancos ({bancos.length})</h2>
          <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
            {bancos.map(b => (
              <div key={b.id} className="card" style={{padding:'0.75rem 1.25rem',minWidth:'150px'}}>
                <p style={{fontWeight:'bold',color:'#4ade80'}}>{b.nombre}</p>
                <p style={{color:'#a0b0a0',fontSize:'0.8rem'}}>Código: {b.codigo || '-'}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Formulario movimiento */}
      {showForm && (
        <section className="card panel">
          <h2 className="panel-title">Registrar movimiento</h2>
          <form onSubmit={handleSubmit} className="field-grid field-grid--wide">
            <div className="form-group"><label className="form-label">Tipo</label>
              <select name="tipo" value={form.tipo} onChange={handleChange} className="form-input">
                <option value="INGRESO">Ingreso</option>
                <option value="GASTO">Gasto</option>
              </select></div>
            <div className="form-group"><label className="form-label">Importe (€) *</label>
              <input type="number" step="0.01" required name="importe" value={form.importe} onChange={handleChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Concepto</label>
              <input name="concepto" value={form.concepto} onChange={handleChange} className="form-input" placeholder="Ej: Cobro recibo, Reparación ascensor" /></div>
            <div className="form-group"><label className="form-label">ID Inmueble</label>
              <input name="inmuebleId" value={form.inmuebleId} onChange={handleChange} className="form-input" /></div>
            <div className="form-group field-span-2"><label className="form-label">Descripción</label>
              <input name="descripcion" value={form.descripcion} onChange={handleChange} className="form-input" /></div>
            <div className="form-group field-span-2"><div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setForm(initialForm)}>Limpiar</button>
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Registrar movimiento'}</button>
            </div></div>
          </form>
        </section>
      )}

      {/* Listado movimientos */}
      <section className="card panel">
        <h2 className="panel-title">Historial de movimientos ({movimientos.length})</h2>
        {loading && <div className="state-box">Cargando...</div>}
        {!loading && movimientos.length === 0 && <div className="state-box state-box--empty">No hay movimientos registrados.</div>}
        {!loading && movimientos.length > 0 && (
          <div className="table-wrap">
            <table className="glass-table">
              <thead><tr><th>Fecha</th><th>Tipo</th><th>Concepto</th><th>Inmueble</th><th>Importe</th><th>Descripción</th></tr></thead>
              <tbody>
                {movimientos.map(m => (
                  <tr key={m.id}>
                    <td>{m.fecha}</td>
                    <td><span style={{color: m.tipo==='INGRESO'?'#4ade80':'#f87171', fontWeight:'bold'}}>{m.tipo}</span></td>
                    <td>{m.concepto}</td>
                    <td>{m.inmuebleId || '-'}</td>
                    <td className="font-bold" style={{color: m.tipo==='INGRESO'?'#4ade80':'#f87171'}}>
                      {m.tipo==='INGRESO'?'+':'-'}{m.importe?.toFixed(2)} €
                    </td>
                    <td>{m.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
