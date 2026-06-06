import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiFilter, FiPlus, FiTrash2, FiRefreshCw, FiEdit2 } from 'react-icons/fi';
import { api } from '../services/api';

const initialFormState = {
  id: '',
  direccion: '',
  numero: '',
  codigoPostal: '',
  ciudad: '',
  provincia: '',
  referenciaCatastral: '',
  superficieM2: '',
  edificioId: '',
  planta: '',
  puerta: '',
  habitaciones: '',
  banos: '',
  gestionadoPorEmpresa: false,
  rentaMensual: '',
  inquilinoId: '',
};

const PisoBadge = ({ estado }) => (
  <span className={`inline-badge ${estado === 'LIBRE' ? 'inline-badge--success' : 'inline-badge--warning'}`}>
    {estado}
  </span>
);

const PisosView = () => {
  const [pisos, setPisos] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterFree, setFilterFree] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  const edificiosById = useMemo(() => {
    return new Map(edificios.map((edificio) => [edificio.id, edificio]));
  }, [edificios]);

  const fetchData = useCallback(async () => {
    try {
      const [pisosData, edificiosData] = await Promise.all([
        filterFree ? api.pisos.getFree() : api.pisos.getAll(),
        api.edificios.getAll(),
      ]);

      setPisos(pisosData);
      setEdificios(edificiosData);
      setError('');
    } catch (requestError) {
      setError(requestError.message || 'No se pudieron cargar los pisos.');
    } finally {
      setLoading(false);
    }
  }, [filterFree]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchData]);

  const resetForm = () => { setFormData(initialFormState); setEditingId(null); };

  const handleEdit = (piso) => {
    setEditingId(piso.id);
    setFormData({
      id: piso.id,
      direccion: piso.direccion || '',
      numero: piso.numero || '',
      codigoPostal: piso.codigoPostal || '',
      ciudad: piso.ciudad || '',
      provincia: piso.provincia || '',
      referenciaCatastral: piso.referenciaCatastral || '',
      superficieM2: piso.superficieM2 || '',
      edificioId: piso.edificioId || '',
      planta: piso.planta || '',
      puerta: piso.puerta || '',
      habitaciones: piso.habitaciones || '',
      banos: piso.banos || '',
      gestionadoPorEmpresa: piso.gestionadoPorEmpresa || false,
      rentaMensual: piso.rentaMensual || '',
      inquilinoId: piso.inquilinoId || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar piso de forma logica?')) {
      return;
    }

    try {
      setLoading(true);
      await api.pisos.delete(id);
      await fetchData();
    } catch (requestError) {
      setError(requestError.message || 'No se pudo eliminar el piso.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...formData,
      superficieM2: Number(formData.superficieM2),
      planta: Number(formData.planta),
      habitaciones: Number(formData.habitaciones),
      banos: Number(formData.banos),
      rentaMensual: Number(formData.rentaMensual),
    };

    try {
      setLoading(true);
      if (editingId) {
        await api.pisos.update(editingId, payload);
      } else {
        await api.pisos.create(payload);
      }
      setShowForm(false);
      resetForm();
      await fetchData();
    } catch (requestError) {
      setError(requestError.message || 'Error guardando el piso.');
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  const getEdificioLabel = (edificioId) => {
    const edificio = edificiosById.get(edificioId);
    return edificio ? `${edificio.nombreEdificio} (${edificio.id})` : edificioId || 'Sin edificio';
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">Gestion de pisos</h1>
          <p className="page-description">
            Consulta solo pisos libres, registra nuevos inmuebles y elimina registros sin perder trazabilidad.
          </p>
        </div>

        <div className="toolbar">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setLoading(true);
              setFilterFree((previous) => !previous);
            }}
          >
            <FiFilter />
            {filterFree ? 'Ver todos' : 'Solo libres'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setLoading(true);
              void fetchData();
            }}
          >
            <FiRefreshCw />
            Refrescar
          </button>
          <button type="button" className="btn-primary" onClick={() => { if (showForm) { resetForm(); setShowForm(false); } else { setShowForm(true); } }}>
            <FiPlus />
            {showForm ? 'Cerrar formulario' : 'Nuevo piso'}
          </button>
        </div>
      </header>

      {error ? <div className="state-box state-box--error">{error}</div> : null}

      {showForm ? (
        <section className="card panel">
          <div>
            <h2 className="panel-title">{editingId ? 'Editar piso' : 'Registrar piso'}</h2>
            <p className="panel-subtitle">Usa el selector de edificios para asociarlo correctamente.</p>
          </div>

          <form onSubmit={handleSubmit} className="field-grid field-grid--wide">
            <div className="form-group">
              <label className="form-label">Edificio</label>
              <select required name="edificioId" value={formData.edificioId} onChange={handleInputChange} className="form-input">
                <option value="">Selecciona un edificio</option>
                {edificios.map((edificio) => (
                  <option key={edificio.id} value={edificio.id}>
                    {edificio.nombreEdificio} ({edificio.id})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">ID unico</label>
              <input required name="id" value={formData.id} onChange={handleInputChange} className="form-input" placeholder="Ej. PIS-001" disabled={!!editingId} />
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
              <label className="form-label">Planta</label>
              <input type="number" required name="planta" value={formData.planta} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Puerta</label>
              <input required name="puerta" value={formData.puerta} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Habitaciones</label>
              <input type="number" min="0" required name="habitaciones" value={formData.habitaciones} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Banos</label>
              <input type="number" min="0" required name="banos" value={formData.banos} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Renta mensual</label>
              <input type="number" step="0.01" min="0" required name="rentaMensual" value={formData.rentaMensual} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group field-span-2">
              <label className="form-label">DNI del inquilino (Dejar en blanco para estado LIBRE)</label>
              <input name="inquilinoId" value={formData.inquilinoId} onChange={handleInputChange} className="form-input" placeholder="Ej: 11111111A" />
            </div>
            <div className="form-group field-span-2">
              <label className="form-label">
                <input
                  type="checkbox"
                  name="gestionadoPorEmpresa"
                  checked={formData.gestionadoPorEmpresa}
                  onChange={handleInputChange}
                  style={{ marginRight: '0.5rem' }}
                />
                Gestionado por la empresa
              </label>
            </div>
            <div className="form-group field-span-2">
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Limpiar
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : editingId ? 'Actualizar piso' : 'Guardar piso'}
                </button>
              </div>
            </div>
          </form>
        </section>
      ) : null}

      <section className="card panel">
        <div className="flex-between">
          <div>
            <h2 className="panel-title">Listado de pisos</h2>
            <p className="panel-subtitle">
              {filterFree ? 'Mostrando solo pisos libres' : 'Mostrando todos los pisos activos'}
            </p>
          </div>
          <span className="inline-badge inline-badge--neutral">{pisos.length} registros</span>
        </div>

        {loading ? <div className="state-box">Cargando pisos...</div> : null}

        {!loading && pisos.length === 0 ? (
          <div className="state-box state-box--empty">No hay pisos para mostrar.</div>
        ) : null}

        {!loading && pisos.length > 0 ? (
          <div className="table-wrap">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Edificio</th>
                  <th>Ubicacion</th>
                  <th>Caracteristicas</th>
                  <th>Renta</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pisos.map((piso) => (
                  <tr key={piso.id}>
                    <td className="text-primary font-bold">{piso.id}</td>
                    <td>{getEdificioLabel(piso.edificioId)}</td>
                    <td>
                      {piso.direccion} {piso.numero}
                      <div className="page-note">
                        Planta {piso.planta}, puerta {piso.puerta}
                      </div>
                    </td>
                    <td>
                      {piso.habitaciones} hab. / {piso.banos} banos
                      <div className="page-note">
                        {piso.superficieM2} m2 {piso.gestionadoPorEmpresa ? ' - gestionado por empresa' : ''}
                      </div>
                    </td>
                    <td>{Number(piso.rentaMensual).toFixed(2)} EUR</td>
                    <td><PisoBadge estado={piso.estado} /></td>
                    <td>
                      <div className="action-group">
                        <button type="button" onClick={() => handleEdit(piso)} className="action-btn text-warning" aria-label="Editar" title="Editar"><FiEdit2 /></button>
                        <button type="button" onClick={() => handleDelete(piso.id)} className="action-btn text-danger" aria-label={`Eliminar piso ${piso.id}`}><FiTrash2 /></button>
                      </div>
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

export default PisosView;
