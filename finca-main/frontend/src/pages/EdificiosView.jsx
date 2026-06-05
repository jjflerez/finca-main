import { useCallback, useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiRefreshCw } from 'react-icons/fi';
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
  const [formData, setFormData] = useState(initialFormState);

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
      await api.edificios.create(payload);
      setShowForm(false);
      setFormData(initialFormState);
      await fetchEdificios();
    } catch (requestError) {
      setError(requestError.message || 'Error guardando el edificio.');
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  return (
    <div className="page-shell edificios-view">
      <header className="page-header">
        <div>
          <h1 className="page-title">Gestion de Edificios</h1>
          <p className="page-description">
            Consulta, crea y elimina edificios desde una misma pantalla con una experiencia limpia y consistente.
          </p>
        </div>

        <div className="toolbar">
          <button type="button" className="btn-secondary" onClick={fetchEdificios}>
            <FiRefreshCw />
            Refrescar
          </button>
          <button type="button" className="btn-primary" onClick={() => setShowForm((previous) => !previous)}>
            <FiPlus />
            {showForm ? 'Cerrar formulario' : 'Nuevo edificio'}
          </button>
        </div>
      </header>

      {error ? <div className="state-box state-box--error">{error}</div> : null}

      {showForm ? (
        <section className="card panel">
          <div>
            <h2 className="panel-title">Nuevo edificio</h2>
            <p className="panel-subtitle">Completa los datos basicos del edificio antes de guardar.</p>
          </div>

          <form onSubmit={handleSubmit} className="field-grid field-grid--wide">
            <div className="form-group">
              <label className="form-label">ID unico</label>
              <input required name="id" value={formData.id} onChange={handleInputChange} className="form-input" placeholder="Ej. EDF-001" />
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
                <button type="button" className="btn-secondary" onClick={() => setFormData(initialFormState)}>
                  Limpiar
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar edificio'}
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
                      <button
                        type="button"
                        onClick={() => handleDelete(edificio.id)}
                        className="action-btn text-danger"
                        aria-label={`Eliminar edificio ${edificio.nombreEdificio}`}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
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

export default EdificiosView;
