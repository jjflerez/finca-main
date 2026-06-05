import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EdificiosView from './pages/EdificiosView';
import InmueblesView from './pages/InmueblesView';
import PisosView from './pages/PisosView';
import LocalesView from './pages/LocalesView';
import InquilinosView from './pages/InquilinosView';
import RecibosView from './pages/RecibosView';
import MovimientosView from './pages/MovimientosView';
import './App.css';

function App() {
  return (
    <Router>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

