import { HashRouter, Route, Routes } from 'react-router-dom'
import WellCome from './pages/Login'
import "bootstrap-icons/font/bootstrap-icons.css";
import SettingsPage from './pages/Settings';
import HomePage from './pages/home/Index';
import Layout from './layout/LayoutBase';
import CRF from './pages/crf/CRF';
import NovaRequisicao from './pages/crf/NovaRequisicao';
import EditarCrf from './pages/crf/EditarCrf';
import ClientesPage from './pages/importadores/Importadores';
import ARQUIVOS from './pages/arquivos/ARQUIVOS';
import Processos from './pages/processos/Processos';

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path='/' element={<WellCome />} />
          <Route path='/settings' element={<SettingsPage />} />

          <Route path='/home' element={<Layout><HomePage /></Layout>} />
          <Route path='/crf' element={<Layout><CRF /></Layout>} />
          <Route path='/crf/nova' element={<Layout><NovaRequisicao /></Layout>} />
          <Route path='/crf/:id/editar' element={<Layout><EditarCrf /></Layout>} />
          <Route path='/nova-requisicao' element={<Layout><NovaRequisicao /></Layout>} />
          <Route path='/clientes' element={<Layout><ClientesPage /></Layout>} />
          <Route path='/clientes/cadastrar' element={<Layout><ClientesPage /></Layout>} />
          <Route path='/importadores' element={<Layout><ClientesPage /></Layout>} />
          <Route path='/importadores/cadastrar' element={<Layout><ClientesPage /></Layout>} />
          <Route path='/arquivos' element={<Layout><ARQUIVOS /></Layout>} />
          <Route path='/processos' element={<Layout><Processos /></Layout>} />

          <Route path='*' element={<Layout><HomePage /></Layout>} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
