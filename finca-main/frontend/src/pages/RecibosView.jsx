import { useCallback, useEffect, useState } from 'react';
import { FiPlus, FiRefreshCw, FiTrash2, FiEdit2, FiCheckCircle, FiCopy } from 'react-icons/fi';
import { api } from '../services/api';

const initialForm = {
  inmuebleId: '', inquilinoDni: '', fechaEmision: new Date().toISOString().slice(0,10),
  renta: '', agua: '', luz: '', ipc: '', porteria: '', iva: '', otrosConceptos: '', descripcionOtros: '',
};

export default function RecibosView() {
  const [recibos, setRecibos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const [form, setForm] = useState(initialForm);

  const fetchRecibos = useCallback(async () => {
    try {
      setLoading(true);
      const data = filtro === 'pendientes' ? await api.recibos.getPendientes() : await api.recibos.getAll();
      setRecibos(data);
      setError('');
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [filtro]);

  useEffect(() => { fetchRecibos(); }, [fetchRecibos]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const toNum = v => v === '' ? 0 : Number(v);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    const payload = { ...form, renta: toNum(form.renta), agua: toNum(form.agua), luz: toNum(form.luz), ipc: toNum(form.ipc), porteria: toNum(form.porteria), iva: toNum(form.iva), otrosConceptos: toNum(form.otrosConceptos) };
    try {
      if (editId) { await api.recibos.update(editId, payload); } else { await api.recibos.create(payload); }
      setShowForm(false); setEditId(null); setForm(initialForm); await fetchRecibos();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };

  const handleCobrar = async (id, cobrado) => {
    try { await api.recibos.marcarCobrado(id, !cobrado); await fetchRecibos(); } catch (e) { setError(e.message); }
  };

  const handleCopiar = async (inmuebleId) => {
    try { await api.recibos.copiarMesAnterior(inmuebleId); await fetchRecibos(); } catch (e) { setError(e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar recibo?')) return;
    try { await api.recibos.delete(id); await fetchRecibos(); } catch (e) { setError(e.message); }
  };

  const total = (r) => [r.renta,r.agua,r.luz,r.ipc,r.porteria,r.iva,r.otrosConceptos].reduce((a,b)=>a+(b||0),0);

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">Gestión de Recibos</h1>
          <p className="page-description">Emite, gestiona y controla el cobro de recibos mensuales.</p>
        </div>
        <div className="toolbar">
          <select className="form-input" style={{width:'auto'}} value={filtro} onChange={e => setFiltro(e.target.value)}>
            <option value="todos">Todos los recibos</option>
            <option value="pendientes">Pendientes de cobro</option>
          </select>
          <button className="btn-secondary" onClick={fetchRecibos}><FiRefreshCw /> Refrescar</button>
          <button className="btn-primary" onClick={() => { setShowForm(p=>!p); setEditId(null); setForm(initialForm); }}>
            <FiPlus /> {showForm ? 'Cerrar' : 'Nuevo recibo'}
          </button>
        </div>
      </header>

      {error && <div className="state-box state-box--error">{error}</div>}

      {showForm && (
        <section className="card panel">
          <h2 className="panel-title">{editId ? 'Editar recibo' : 'Nuevo recibo'}</h2>
          <form onSubmit={handleSubmit} className="field-grid field-grid--wide">
            <div className="form-group"><label className="form-label">ID Inmueble *</label>
              <input required name="inmuebleId" value={form.inmuebleId} onChange={handleChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">DNI Inquilino</label>
              <input name="inquilinoDni" value={form.inquilinoDni} onChange={handleChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Fecha emisión</label>
              <input type="date" name="fechaEmision" value={form.fechaEmision} onChange={handleChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Renta * (obligatorio)</label>
              <input type="number" step="0.01" required name="renta" value={form.renta} onChange={handleChange} className="form-input" /></div>
            {[['agua','Agua'],['luz','Luz'],['ipc','IPC anual'],['porteria','Portería'],['iva','IVA'],['otrosConceptos','Otros conceptos']].map(([k,l]) => (
              <div key={k} className="form-group"><label className="form-label">{l} (opcional)</label>
                <input type="number" step="0.01" name={k} value={form[k]} onChange={handleChange} className="form-input" /></div>
            ))}
            <div className="form-group"><label className="form-label">Descripción otros</label>
              <input name="descripcionOtros" value={form.descripcionOtros} onChange={handleChange} className="form-input" /></div>
            <div className="form-group field-span-2"><div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setForm(initialForm)}>Limpiar</button>
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Guardando...' : (editId ? 'Actualizar' : 'Crear recibo')}</button>
            </div></div>
          </form>
        </section>
      )}

      <section className="card panel">
        <h2 className="panel-title">Recibos ({recibos.length})</h2>
        {loading && <div className="state-box">Cargando...</div>}
        {!loading && recibos.length === 0 && <div className="state-box state-box--empty">No hay recibos.</div>}
        {!loading && recibos.length > 0 && (
          <div className="table-wrap">
            <table className="glass-table">
              <thead><tr><th>Nº</th><th>Inmueble</th><th>Inquilino</th><th>Fecha</th><th>Renta</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {recibos.map(r => (
                  <tr key={r.id}>
                    <td className="text-primary font-bold">#{r.numeroRecibo}</td>
                    <td>{r.inmuebleId}</td>
                    <td>{r.inquilinoDni || '-'}</td>
                    <td>{r.fechaEmision}</td>
                    <td>{r.renta?.toFixed(2)} €</td>
                    <td className="font-bold">{total(r).toFixed(2)} €</td>
                    <td><span style={{color: r.cobrado ? '#4ade80' : '#f87171', fontWeight:'bold'}}>{r.cobrado ? '✓ Cobrado' : '⏳ Pendiente'}</span></td>
                    <td style={{display:'flex',gap:'0.4rem'}}>
                      <button className="action-btn" title="Editar" onClick={() => { setEditId(r.id); setForm({...r}); setShowForm(true); }}><FiEdit2 /></button>
                      <button className="action-btn" title="Copiar mes anterior" onClick={() => handleCopiar(r.inmuebleId)}><FiCopy /></button>
                      <button className="action-btn" title={r.cobrado ? 'Marcar pendiente':'Marcar cobrado'} style={{color: r.cobrado?'#f87171':'#4ade80'}} onClick={() => handleCobrar(r.id,r.cobrado)}><FiCheckCircle /></button>
                      <button className="action-btn text-danger" title="Eliminar" onClick={() => handleDelete(r.id)}><FiTrash2 /></button>
                    </td>
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
