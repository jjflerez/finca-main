import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiUser, FiArrowRight } from 'react-icons/fi';

const LoginView = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    if (!result.success) {
      setError(result.message);
      setLoading(false);
    }
    // Si es success, el componente AuthContext actualizará el estado y App.jsx redirigirá automáticamente
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
            color: 'var(--color-primary)', fontSize: '1.5rem'
          }}>
            <FiLock />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>AgroTech Fincas</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: '0.5rem 0 0' }}>Acceso al sistema de gestión</p>
        </div>

        {error && <div className="state-box state-box--error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label className="form-label">Usuario</label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="ej: admin"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%' }} disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Entrar'} <FiArrowRight />
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Usuarios de prueba:<br/>
          <strong>admin</strong> / admin123<br/>
          <strong>secretario</strong> / fincas2026
        </div>
      </div>
    </div>
  );
};

export default LoginView;
