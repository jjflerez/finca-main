import { HashRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EdificiosView from './pages/EdificiosView';
import InmueblesView from './pages/InmueblesView';
import PisosView from './pages/PisosView';
import LocalesView from './pages/LocalesView';
import InquilinosView from './pages/InquilinosView';
import RecibosView from './pages/RecibosView';
import MovimientosView from './pages/MovimientosView';
import ListadosView from './pages/ListadosView';
import InformesView from './pages/InformesView';
import LoginView from './pages/LoginView';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginView /></PublicRoute>} />
          
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/edificios" element={<EdificiosView />} />
                  <Route path="/inmuebles" element={<InmueblesView />} />
                  <Route path="/pisos" element={<PisosView />} />
                  <Route path="/locales" element={<LocalesView />} />
                  <Route path="/inquilinos" element={<InquilinosView />} />
                  <Route path="/recibos" element={<RecibosView />} />
                  <Route path="/movimientos" element={<MovimientosView />} />
                  <Route path="/listados" element={<ListadosView />} />
                  <Route path="/informes" element={<InformesView />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
