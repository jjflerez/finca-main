import { useCallback, useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiRefreshCw, FiEdit2, FiEye } from 'react-icons/fi';
import { api } from '../services/api';
import './EdificiosView.css';

const initialFormState = {
  id: '',
  direccion: '',
  numero: '',
  codigoPostal: '',
  ciudad: '',
  provincia: '',
  referenciaCatastral: '',
  superficieM2: '',
  nombreEdificio: '',
  totalPlantas: '',
};

const EdificiosView = () => {
  const [edificios, setEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [detalle, setDetalle] = useState(null); // { edificioId, pisos, locales }

  const fetchEdificios = useCallback(async () => {
    try {
      const data = await api.edificios.getAll();
      setEdificios(data);
      setError('');
    } catch (requestError) {
      setError(requestError.message || 'No se pudieron cargar los edificios.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchEdificios();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchEdificios]);

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar edificio de forma logica?')) {
      return;
    }

    try {
      setLoading(true);
      await api.edificios.delete(id);
      await fetchEdificios();
    } catch (requestError) {
      setError(requestError.message || 'No se pudo eliminar el edificio.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (edificio) => {
    setEditingId(edificio.id);
    setFormData({
      id: edificio.id,
      direccion: edificio.direccion || '',
      numero: edificio.numero || '',
      codigoPostal: edificio.codigoPostal || '',
      ciudad: edificio.ciudad || '',
      provincia: edificio.provincia || '',
      referenciaCatastral: edificio.referenciaCatastral || '',
      superficieM2: edificio.superficieM2 || '',
      nombreEdificio: edificio.nombreEdificio || '',
      totalPlantas: edificio.totalPlantas || '',
    });
    setShowForm(true);
  };

  const handleVerDetalle = async (edificioId) => {
    try {
      const [pisos, locales] = await Promise.all([
        api.edificios.getPisos(edificioId),
        api.edificios.getLocales(edificioId),
      ]);
      setDetalle({ edificioId, pisos, locales });
    } catch (requestError) {
      setError(requestError.message || 'No se pudo cargar el detalle.');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...formData,
      superficieM2: Number(formData.superficieM2),
      totalPlantas: Number(formData.totalPlantas),
    };

    try {
      setLoading(true);
      if (editingId) {
        await api.edificios.update(editingId, payload);
      } else {
        await api.edificios.create(payload);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(initialFormState);
      await fetchEdificios();
    } catch (requestError) {
      setError(requestError.message || 'Error guardando el edificio.');
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  return (
    <div className="page-shell edificios-view">
      <header className="page-header">
        <div>
          <h1 className="page-title">Gestion de Edificios</h1>
          <p className="page-description">
            Consulta, crea, edita y elimina edificios. Visualiza pisos y locales de cada edificio.
          </p>
        </div>

        <div className="toolbar">
          <button type="button" className="btn-secondary" onClick={fetchEdificios}>
            <FiRefreshCw />
            Refrescar
          </button>
          <button type="button" className="btn-primary" onClick={() => { if (showForm) handleCancelForm(); else setShowForm(true); }}>
            <FiPlus />
            {showForm ? 'Cerrar formulario' : 'Nuevo edificio'}
          </button>
        </div>
      </header>

      {error ? <div className="state-box state-box--error">{error}</div> : null}

      {showForm ? (
        <section className="card panel">
          <div>
            <h2 className="panel-title">{editingId ? 'Editar edificio' : 'Nuevo edificio'}</h2>
            <p className="panel-subtitle">Completa los datos basicos del edificio antes de guardar.</p>
          </div>

          <form onSubmit={handleSubmit} className="field-grid field-grid--wide">
            <div className="form-group">
              <label className="form-label">ID unico</label>
              <input required name="id" value={formData.id} onChange={handleInputChange} className="form-input" placeholder="Ej. EDF-001" disabled={!!editingId} />
            </div>
            <div className="form-group">
              <label className="form-label">Nombre del edificio</label>
              <input required name="nombreEdificio" value={formData.nombreEdificio} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Direccion</label>
              <input required name="direccion" value={formData.direccion} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Numero</label>
              <input required name="numero" value={formData.numero} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Codigo postal</label>
              <input required name="codigoPostal" value={formData.codigoPostal} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Ciudad</label>
              <input required name="ciudad" value={formData.ciudad} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Provincia</label>
              <input required name="provincia" value={formData.provincia} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Referencia catastral</label>
              <input required name="referenciaCatastral" value={formData.referenciaCatastral} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Superficie m2</label>
              <input type="number" step="0.01" min="0" required name="superficieM2" value={formData.superficieM2} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Total plantas</label>
              <input type="number" min="0" required name="totalPlantas" value={formData.totalPlantas} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group field-span-2">
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCancelForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : editingId ? 'Actualizar edificio' : 'Guardar edificio'}
                </button>
              </div>
            </div>
          </form>
        </section>
      ) : null}

      <section className="card panel">
        <div className="flex-between">
          <div>
            <h2 className="panel-title">Listado de edificios</h2>
            <p className="panel-subtitle">{edificios.length} edificios activos</p>
          </div>
        </div>

        {loading ? <div className="state-box">Cargando edificios...</div> : null}

        {!loading && edificios.length === 0 ? (
          <div className="state-box state-box--empty">No hay edificios registrados.</div>
        ) : null}

        {!loading && edificios.length > 0 ? (
          <div className="table-wrap">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Direccion</th>
                  <th>Ciudad</th>
                  <th>Plantas</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {edificios.map((edificio) => (
                  <tr key={edificio.id}>
                    <td className="text-primary font-bold">{edificio.id}</td>
                    <td>{edificio.nombreEdificio}</td>
                    <td>{edificio.direccion} {edificio.numero}</td>
                    <td>{edificio.ciudad}</td>
                    <td>{edificio.totalPlantas}</td>
                    <td>
                      <span className={`badge ${edificio.estado === 'ALQUILADO' ? 'badge--danger' : 'badge--success'}`}>
                        {edificio.estado || 'LIBRE'}
                      </span>
                    </td>
                    <td>
                      <div className="action-group">
                        <button type="button" onClick={() => handleVerDetalle(edificio.id)} className="action-btn text-info" aria-label="Ver detalle" title="Ver pisos y locales">
                          <FiEye />
                        </button>
                        <button type="button" onClick={() => handleEdit(edificio)} className="action-btn text-warning" aria-label="Editar" title="Editar">
                          <FiEdit2 />
                        </button>
                        <button type="button" onClick={() => handleDelete(edificio.id)} className="action-btn text-danger" aria-label="Eliminar" title="Eliminar">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      {detalle ? (
        <section className="card panel">
          <div className="flex-between">
            <div>
              <h2 className="panel-title">Detalle del edificio: {detalle.edificioId}</h2>
              <p className="panel-subtitle">Pisos y locales gestionados</p>
            </div>
            <button type="button" className="btn-secondary" onClick={() => setDetalle(null)}>Cerrar</button>
          </div>

          <h3 style={{ margin: '1rem 0 0.5rem' }}>Pisos ({detalle.pisos.length})</h3>
          {detalle.pisos.length > 0 ? (
            <div className="table-wrap">
              <table className="glass-table">
                <thead><tr><th>ID</th><th>Planta</th><th>Puerta</th><th>Superficie</th><th>Estado</th><th>Inquilino</th></tr></thead>
                <tbody>
                  {detalle.pisos.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td><td>{p.planta}</td><td>{p.puerta}</td><td>{p.superficieM2} m²</td>
                      <td><span className={`badge ${p.estado === 'ALQUILADO' ? 'badge--danger' : 'badge--success'}`}>{p.estado}</span></td>
                      <td>{p.inquilinoId || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p style={{ color: 'var(--text-muted)' }}>No hay pisos registrados.</p>}

          <h3 style={{ margin: '1rem 0 0.5rem' }}>Locales ({detalle.locales.length})</h3>
          {detalle.locales.length > 0 ? (
            <div className="table-wrap">
              <table className="glass-table">
                <thead><tr><th>ID</th><th>Nº Local</th><th>Uso</th><th>Superficie</th><th>Estado</th><th>Inquilino</th></tr></thead>
                <tbody>
                  {detalle.locales.map(l => (
                    <tr key={l.id}>
                      <td>{l.id}</td><td>{l.numeroLocal}</td><td>{l.usoLocal}</td><td>{l.superficieM2} m²</td>
                      <td><span className={`badge ${l.estado === 'ALQUILADO' ? 'badge--danger' : 'badge--success'}`}>{l.estado}</span></td>
                      <td>{l.inquilinoId || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p style={{ color: 'var(--text-muted)' }}>No hay locales registrados.</p>}
        </section>
      ) : null}
    </div>
  );
};

export default EdificiosView;
