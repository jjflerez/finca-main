import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiFilter, FiPlus, FiTrash2, FiRefreshCw } from 'react-icons/fi';
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
  numeroLocal: '',
  usoLocal: 'COMERCIAL',
  rentaMensual: '',
  tieneIVA: true,
  gestionadoPorEmpresa: false,
};

const LocalBadge = ({ estado }) => (
  <span className={`inline-badge ${estado === 'LIBRE' ? 'inline-badge--success' : 'inline-badge--warning'}`}>
    {estado}
  </span>
);

const LocalesView = () => {
  const [locales, setLocales] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filterFree, setFilterFree] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  const edificiosById = useMemo(() => {
    return new Map(edificios.map((edificio) => [edificio.id, edificio]));
  }, [edificios]);

  const fetchData = useCallback(async () => {
    try {
      const [localesData, edificiosData] = await Promise.all([
        filterFree ? api.locales.getFree() : api.locales.getAll(),
        api.edificios.getAll(),
      ]);

      setLocales(localesData);
      setEdificios(edificiosData);
      setError('');
    } catch (requestError) {
      setError(requestError.message || 'No se pudieron cargar los locales.');
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

  const resetForm = () => setFormData(initialFormState);

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar local de forma logica?')) {
      return;
    }

    try {
      setLoading(true);
      await api.locales.delete(id);
      await fetchData();
    } catch (requestError) {
      setError(requestError.message || 'No se pudo eliminar el local.');
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
      numeroLocal: Number(formData.numeroLocal),
      rentaMensual: Number(formData.rentaMensual),
    };

    try {
      setLoading(true);
      await api.locales.create(payload);
      setShowForm(false);
      resetForm();
      await fetchData();
    } catch (requestError) {
      setError(requestError.message || 'Error guardando el local.');
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
          <h1 className="page-title">Gestion de locales</h1>
          <p className="page-description">
            Filtra locales libres, registra nuevos espacios y mantén una vista clara de su estado.
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
          <button type="button" className="btn-primary" onClick={() => setShowForm((previous) => !previous)}>
            <FiPlus />
            {showForm ? 'Cerrar formulario' : 'Nuevo local'}
          </button>
        </div>
      </header>

      {error ? <div className="state-box state-box--error">{error}</div> : null}

      {showForm ? (
        <section className="card panel">
          <div>
            <h2 className="panel-title">Registrar local</h2>
            <p className="panel-subtitle">Completa la informacion base y asocia el local con un edificio.</p>
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
              <input required name="id" value={formData.id} onChange={handleInputChange} className="form-input" placeholder="Ej. LOC-001" />
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
              <label className="form-label">Numero de local</label>
              <input type="number" required name="numeroLocal" value={formData.numeroLocal} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Uso del local</label>
              <select required name="usoLocal" value={formData.usoLocal} onChange={handleInputChange} className="form-input">
                <option value="COMERCIAL">COMERCIAL</option>
                <option value="OFICINA">OFICINA</option>
                <option value="ALMACEN">ALMACEN</option>
                <option value="HOSTELERIA">HOSTELERIA</option>
                <option value="OTRO">OTRO</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Renta mensual</label>
              <input type="number" step="0.01" min="0" required name="rentaMensual" value={formData.rentaMensual} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group field-span-2">
              <label className="form-label">
                <input
                  type="checkbox"
                  name="tieneIVA"
                  checked={formData.tieneIVA}
                  onChange={handleInputChange}
                  style={{ marginRight: '0.5rem' }}
                />
                Aplica IVA
              </label>
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
                  {saving ? 'Guardando...' : 'Guardar local'}
                </button>
              </div>
            </div>
          </form>
        </section>
      ) : null}

      <section className="card panel">
        <div className="flex-between">
          <div>
            <h2 className="panel-title">Listado de locales</h2>
            <p className="panel-subtitle">
              {filterFree ? 'Mostrando solo locales libres' : 'Mostrando todos los locales activos'}
            </p>
          </div>
          <span className="inline-badge inline-badge--neutral">{locales.length} registros</span>
        </div>

        {loading ? <div className="state-box">Cargando locales...</div> : null}

        {!loading && locales.length === 0 ? (
          <div className="state-box state-box--empty">No hay locales para mostrar.</div>
        ) : null}

        {!loading && locales.length > 0 ? (
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
                {locales.map((local) => (
                  <tr key={local.id}>
                    <td className="text-primary font-bold">{local.id}</td>
                    <td>{getEdificioLabel(local.edificioId)}</td>
                    <td>
                      {local.direccion} {local.numero}
                      <div className="page-note">
                        {local.numeroLocal} - {local.usoLocal}
                      </div>
                    </td>
                    <td>
                      {local.superficieM2} m2
                      <div className="page-note">
                        {local.gestionadoPorEmpresa ? 'Gestionado por empresa' : 'Gestionado por propietario'}
                        {' '}| {local.tieneIVA ? 'Con IVA' : 'Sin IVA'}
                      </div>
                    </td>
                    <td>{Number(local.rentaMensual).toFixed(2)} EUR</td>
                    <td><LocalBadge estado={local.estado} /></td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDelete(local.id)}
                        className="action-btn text-danger"
                        aria-label={`Eliminar local ${local.id}`}
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

export default LocalesView;
