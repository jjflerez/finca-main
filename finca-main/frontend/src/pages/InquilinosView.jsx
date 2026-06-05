import { useCallback, useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiRefreshCw, FiEdit2, FiCheckCircle } from 'react-icons/fi';
import { api } from '../services/api';

const sexoOpciones = ['HOMBRE', 'MUJER', 'OTRO'];

const initialForm = {
  dni: '', nombre: '', apellidos: '', edad: '', sexo: 'HOMBRE',
  telefono: '', email: '', fotografia: '',
  tieneNomina: false, tieneAvalBancario: false, tieneContratoTrabajo: false, avalistaDni: '',
};

export default function InquilinosView() {
  const [inquilinos, setInquilinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialForm);

  const fetchInquilinos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.inquilinos.getAll();
      setInquilinos(data);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInquilinos(); }, [fetchInquilinos]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, edad: Number(form.edad) };
    try {
      if (editMode) {
        await api.inquilinos.update(form.dni, payload);
      } else {
        await api.inquilinos.create(payload);
      }
      setShowForm(false);
      setEditMode(false);
      setForm(initialForm);
      await fetchInquilinos();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (i) => {
    setForm({ ...i, edad: String(i.edad), avalistaDni: i.avalistaDni || '' });
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (dni) => {
    if (!window.confirm('¿Dar de baja al inquilino?')) return;
    try {
      await api.inquilinos.delete(dni);
      await fetchInquilinos();
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">Gestión de Inquilinos</h1>
          <p className="page-description">Alta, modificación, baja y consulta de inquilinos.</p>
        </div>
        <div className="toolbar">
          <button className="btn-secondary" onClick={fetchInquilinos}><FiRefreshCw /> Refrescar</button>
          <button className="btn-primary" onClick={() => { setShowForm(p => !p); setEditMode(false); setForm(initialForm); }}>
            <FiPlus /> {showForm ? 'Cerrar' : 'Nuevo inquilino'}
          </button>
        </div>
      </header>

      {error && <div className="state-box state-box--error">{error}</div>}

      {showForm && (
        <section className="card panel">
          <h2 className="panel-title">{editMode ? 'Editar inquilino' : 'Nuevo inquilino'}</h2>
          <form onSubmit={handleSubmit} className="field-grid field-grid--wide">
            <div className="form-group"><label className="form-label">DNI *</label>
              <input required name="dni" value={form.dni} onChange={handleChange} className="form-input" disabled={editMode} /></div>
            <div className="form-group"><label className="form-label">Nombre *</label>
              <input required name="nombre" value={form.nombre} onChange={handleChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Apellidos *</label>
              <input required name="apellidos" value={form.apellidos} onChange={handleChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Edad</label>
              <input type="number" name="edad" value={form.edad} onChange={handleChange} className="form-input" min="18" /></div>
            <div className="form-group"><label className="form-label">Sexo</label>
              <select name="sexo" value={form.sexo} onChange={handleChange} className="form-input">
                {sexoOpciones.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Teléfono</label>
              <input name="telefono" value={form.telefono} onChange={handleChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Fotografía (URL)</label>
              <input name="fotografia" value={form.fotografia} onChange={handleChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">DNI Avalista</label>
              <input name="avalistaDni" value={form.avalistaDni} onChange={handleChange} className="form-input" /></div>

            <div className="form-group field-span-2">
              <p className="form-label" style={{marginBottom:'0.5rem'}}>Requisitos para alquilar (al menos uno):</p>
              <div style={{display:'flex',gap:'1.5rem',flexWrap:'wrap'}}>
                {[['tieneNomina','Tiene nómina'],['tieneAvalBancario','Aval bancario'],['tieneContratoTrabajo','Contrato de trabajo']].map(([key, label]) => (
                  <label key={key} style={{display:'flex',alignItems:'center',gap:'0.4rem',color:'#a0b0a0',cursor:'pointer'}}>
                    <input type="checkbox" name={key} checked={form[key]} onChange={handleChange} /> {label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group field-span-2">
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setForm(initialForm)}>Limpiar</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Guardando...' : (editMode ? 'Actualizar' : 'Crear inquilino')}</button>
              </div>
            </div>
          </form>
        </section>
      )}

      <section className="card panel">
        <h2 className="panel-title">Listado de inquilinos ({inquilinos.length})</h2>
        {loading && <div className="state-box">Cargando...</div>}
        {!loading && inquilinos.length === 0 && <div className="state-box state-box--empty">No hay inquilinos registrados.</div>}
        {!loading && inquilinos.length > 0 && (
          <div className="table-wrap">
            <table className="glass-table">
              <thead><tr>
                <th>DNI</th><th>Nombre</th><th>Edad</th><th>Teléfono</th><th>Email</th><th>Requisitos</th><th>Alta</th><th>Acciones</th>
              </tr></thead>
              <tbody>
                {inquilinos.map(i => (
                  <tr key={i.dni}>
                    <td className="text-primary font-bold">{i.dni}</td>
                    <td>{i.nombre} {i.apellidos}</td>
                    <td>{i.edad}</td>
                    <td>{i.telefono}</td>
                    <td>{i.email}</td>
                    <td>
                      {i.tieneNomina && <span style={{color:'#4ade80',marginRight:'4px'}}>Nómina</span>}
                      {i.tieneAvalBancario && <span style={{color:'#4ade80',marginRight:'4px'}}>Aval</span>}
                      {i.tieneContratoTrabajo && <span style={{color:'#4ade80',marginRight:'4px'}}>Contrato</span>}
                      {i.avalistaDni && <span style={{color:'#60a5fa'}}>Avalista: {i.avalistaDni}</span>}
                    </td>
                    <td>{i.fechaAlta}</td>
                    <td style={{display:'flex',gap:'0.5rem'}}>
                      <button className="action-btn" onClick={() => handleEdit(i)} title="Editar"><FiEdit2 /></button>
                      <button className="action-btn text-danger" onClick={() => handleDelete(i.dni)} title="Dar de baja"><FiTrash2 /></button>
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
