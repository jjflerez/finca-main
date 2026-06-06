import { useCallback, useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiRefreshCw, FiEdit2, FiCheck, FiX, FiPrinter, FiCopy, FiZap } from 'react-icons/fi';
import { api } from '../services/api';

const RecibosView = () => {
  const [recibos, setRecibos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showInit, setShowInit] = useState(false);
  const [impresion, setImpresion] = useState(null);

  const initialFormState = {
    inmuebleId: '', inquilinoDni: '', renta: '', agua: '', luz: '',
    ipc: '', porteria: '', iva: '', otrosConceptos: '', descripcionOtros: '', fechaEmision: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  const [initData, setInitData] = useState({ concepto: 'renta', cantidad: '', mes: '', anio: '' });

  const fetchRecibos = useCallback(async () => {
    try {
      const data = await api.recibos.getAll();
      setRecibos(data);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchRecibos(); }, [fetchRecibos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...formData,
      renta: Number(formData.renta) || 0,
      agua: Number(formData.agua) || 0,
      luz: Number(formData.luz) || 0,
      ipc: Number(formData.ipc) || 0,
      porteria: Number(formData.porteria) || 0,
      iva: Number(formData.iva) || 0,
      otrosConceptos: Number(formData.otrosConceptos) || 0,
    };
    try {
      if (editingId) {
        await api.recibos.update(editingId, payload);
        setSuccess('Recibo actualizado correctamente.');
      } else {
        await api.recibos.create(payload);
        setSuccess('Recibo creado correctamente.');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(initialFormState);
      await fetchRecibos();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (recibo) => {
    setEditingId(recibo.id);
    setFormData({
      inmuebleId: recibo.inmuebleId || '',
      inquilinoDni: recibo.inquilinoDni || '',
      renta: recibo.renta || '',
      agua: recibo.agua || '',
      luz: recibo.luz || '',
      ipc: recibo.ipc || '',
      porteria: recibo.porteria || '',
      iva: recibo.iva || '',
      otrosConceptos: recibo.otrosConceptos || '',
      descripcionOtros: recibo.descripcionOtros || '',
      fechaEmision: recibo.fechaEmision || '',
    });
    setShowForm(true);
  };

  const handleCobrar = async (id, cobrado) => {
    try {
      await api.recibos.marcarCobrado(id, !cobrado);
      await fetchRecibos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este recibo?')) return;
    try {
      await api.recibos.delete(id);
      await fetchRecibos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGenerarMensuales = async () => {
    if (!window.confirm('¿Generar recibos mensuales para todos los pisos y locales alquilados?')) return;
    try {
      setLoading(true);
      const generados = await api.recibos.generarMensuales();
      setSuccess(`Se generaron ${generados.length} recibos mensuales.`);
      await fetchRecibos();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInicializarConcepto = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        concepto: initData.concepto,
        cantidad: Number(initData.cantidad),
        mes: initData.mes ? Number(initData.mes) : null,
        anio: initData.anio ? Number(initData.anio) : null,
      };
      const result = await api.recibos.inicializarConcepto(payload);
      setSuccess(`Concepto "${initData.concepto}" inicializado en ${result.length} recibos.`);
      setShowInit(false);
      await fetchRecibos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerImpresion = async (id) => {
    try {
      const data = await api.recibos.getImpresion(id);
      setImpresion(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">Gestion de Recibos</h1>
          <p className="page-description">Crea, edita, cobra e imprime recibos. Genera recibos mensuales masivamente.</p>
        </div>
        <div className="toolbar">
          <button type="button" className="btn-secondary" onClick={fetchRecibos}><FiRefreshCw /> Refrescar</button>
          <button type="button" className="btn-secondary" onClick={() => setShowInit(prev => !prev)}><FiZap /> Inicializar conceptos</button>
          <button type="button" className="btn-secondary" onClick={handleGenerarMensuales}><FiCopy /> Generar mensuales</button>
          <button type="button" className="btn-primary" onClick={() => { if (showForm) handleCancelForm(); else setShowForm(true); }}><FiPlus /> {showForm ? 'Cerrar' : 'Nuevo recibo'}</button>
        </div>
      </header>

      {error && <div className="state-box state-box--error">{error}</div>}
      {success && <div className="state-box state-box--success" style={{ background: 'var(--surface-glass)', borderLeft: '4px solid var(--accent)', color: 'var(--accent)' }}>{success} <button onClick={() => setSuccess('')} style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>✕</button></div>}

      {showInit && (
        <section className="card panel">
          <h2 className="panel-title">Inicializar concepto a una cantidad</h2>
          <p className="panel-subtitle">Aplica una cantidad a un concepto en todos los recibos del mes indicado (o pendientes si no se indica).</p>
          <form onSubmit={handleInicializarConcepto} className="field-grid field-grid--wide">
            <div className="form-group">
              <label className="form-label">Concepto</label>
              <select value={initData.concepto} onChange={e => setInitData(prev => ({ ...prev, concepto: e.target.value }))} className="form-input">
                <option value="renta">Renta</option>
                <option value="agua">Agua</option>
                <option value="luz">Luz</option>
                <option value="ipc">IPC</option>
                <option value="porteria">Portería</option>
                <option value="iva">IVA</option>
                <option value="otros">Otros</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Cantidad (€)</label>
              <input type="number" step="0.01" required value={initData.cantidad} onChange={e => setInitData(prev => ({ ...prev, cantidad: e.target.value }))} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Mes (opcional)</label>
              <input type="number" min="1" max="12" value={initData.mes} onChange={e => setInitData(prev => ({ ...prev, mes: e.target.value }))} className="form-input" placeholder="1-12" />
            </div>
            <div className="form-group">
              <label className="form-label">Año (opcional)</label>
              <input type="number" min="2020" max="2030" value={initData.anio} onChange={e => setInitData(prev => ({ ...prev, anio: e.target.value }))} className="form-input" placeholder="2026" />
            </div>
            <div className="form-group field-span-2">
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowInit(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Aplicar</button>
              </div>
            </div>
          </form>
        </section>
      )}

      {showForm && (
        <section className="card panel">
          <h2 className="panel-title">{editingId ? 'Editar recibo' : 'Nuevo recibo'}</h2>
          <form onSubmit={handleSubmit} className="field-grid field-grid--wide">
            <div className="form-group"><label className="form-label">ID Inmueble</label><input required name="inmuebleId" value={formData.inmuebleId} onChange={handleInputChange} className="form-input" disabled={!!editingId} /></div>
            <div className="form-group"><label className="form-label">DNI Inquilino</label><input name="inquilinoDni" value={formData.inquilinoDni} onChange={handleInputChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Fecha emisión</label><input type="date" name="fechaEmision" value={formData.fechaEmision} onChange={handleInputChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Renta (€) *</label><input type="number" step="0.01" name="renta" value={formData.renta} onChange={handleInputChange} className="form-input" required /></div>
            <div className="form-group"><label className="form-label">Agua (€)</label><input type="number" step="0.01" name="agua" value={formData.agua} onChange={handleInputChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Luz (€)</label><input type="number" step="0.01" name="luz" value={formData.luz} onChange={handleInputChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">IPC (€)</label><input type="number" step="0.01" name="ipc" value={formData.ipc} onChange={handleInputChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Portería (€)</label><input type="number" step="0.01" name="porteria" value={formData.porteria} onChange={handleInputChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">IVA (€)</label><input type="number" step="0.01" name="iva" value={formData.iva} onChange={handleInputChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Otros conceptos (€)</label><input type="number" step="0.01" name="otrosConceptos" value={formData.otrosConceptos} onChange={handleInputChange} className="form-input" /></div>
            <div className="form-group field-span-2"><label className="form-label">Descripción otros</label><input name="descripcionOtros" value={formData.descripcionOtros} onChange={handleInputChange} className="form-input" /></div>
            <div className="form-group field-span-2">
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCancelForm}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear recibo'}</button>
              </div>
            </div>
          </form>
        </section>
      )}

      {impresion && (
        <section className="card panel" id="recibo-impresion">
          <div className="flex-between">
            <h2 className="panel-title">Recibo para impresión</h2>
            <button type="button" className="btn-secondary" onClick={() => setImpresion(null)}>Cerrar</button>
          </div>
          <div style={{ padding: '1.5rem', border: '2px solid var(--border)', borderRadius: '12px', marginTop: '1rem', background: 'var(--surface-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div><strong>Nº Recibo:</strong> {impresion.numeroRecibo}</div>
              <div><strong>Fecha:</strong> {impresion.fechaEmision}</div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div><strong>Inmueble:</strong> {impresion.inmuebleId}</div>
              <div><strong>Inquilino:</strong> {impresion.inquilinoDni || 'N/A'}</div>
            </div>
            <table className="glass-table" style={{ marginBottom: '1rem' }}>
              <thead><tr><th>Concepto</th><th style={{ textAlign: 'right' }}>Importe (€)</th></tr></thead>
              <tbody>
                {impresion.conceptos && Object.entries(impresion.conceptos).map(([key, value]) => (
                  <tr key={key}><td>{key}</td><td style={{ textAlign: 'right' }}>{Number(value).toFixed(2)}</td></tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ fontWeight: 'bold' }}><td>TOTAL</td><td style={{ textAlign: 'right' }}>{Number(impresion.total).toFixed(2)} €</td></tr>
              </tfoot>
            </table>
            <div><strong>Estado:</strong> <span className={`badge ${impresion.cobrado ? 'badge--success' : 'badge--danger'}`}>{impresion.cobrado ? 'COBRADO' : 'PENDIENTE'}</span></div>
          </div>
          <div className="form-actions" style={{ marginTop: '1rem' }}>
            <button type="button" className="btn-primary" onClick={() => window.print()}><FiPrinter /> Imprimir</button>
          </div>
        </section>
      )}

      <section className="card panel">
        <div className="flex-between">
          <div>
            <h2 className="panel-title">Listado de recibos</h2>
            <p className="panel-subtitle">{recibos.length} recibos en total</p>
          </div>
        </div>

        {loading && <div className="state-box">Cargando recibos...</div>}
        {!loading && recibos.length === 0 && <div className="state-box state-box--empty">No hay recibos registrados.</div>}
        {!loading && recibos.length > 0 && (
          <div className="table-wrap">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Nº Recibo</th>
                  <th>Inmueble</th>
                  <th>Inquilino</th>
                  <th>Fecha</th>
                  <th>Renta</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recibos.map(r => (
                  <tr key={r.id}>
                    <td className="font-bold">{r.numeroRecibo}</td>
                    <td>{r.inmuebleId}</td>
                    <td>{r.inquilinoDni || '-'}</td>
                    <td>{r.fechaEmision}</td>
                    <td>{Number(r.renta).toFixed(2)} €</td>
                    <td className="font-bold">{Number(r.totalRecibo || (r.renta + r.agua + r.luz + r.ipc + r.porteria + r.iva + r.otrosConceptos)).toFixed(2)} €</td>
                    <td>
                      <span className={`badge ${r.cobrado ? 'badge--success' : 'badge--danger'}`}>
                        {r.cobrado ? 'COBRADO' : 'PENDIENTE'}
                      </span>
                    </td>
                    <td>
                      <div className="action-group">
                        <button type="button" onClick={() => handleVerImpresion(r.id)} className="action-btn text-info" title="Impresión"><FiPrinter /></button>
                        <button type="button" onClick={() => handleCobrar(r.id, r.cobrado)} className="action-btn" title={r.cobrado ? 'Marcar pendiente' : 'Marcar cobrado'} style={{ color: r.cobrado ? 'var(--danger)' : 'var(--accent)' }}>
                          {r.cobrado ? <FiX /> : <FiCheck />}
                        </button>
                        <button type="button" onClick={() => handleEdit(r)} className="action-btn text-warning" title="Editar"><FiEdit2 /></button>
                        <button type="button" onClick={() => handleDelete(r.id)} className="action-btn text-danger" title="Eliminar"><FiTrash2 /></button>
                      </div>
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
};

export default RecibosView;
