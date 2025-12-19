import { BrowserRouter, Route, Routes } from 'react-router-dom'
import WellCome from './pages/Login'
import "bootstrap-icons/font/bootstrap-icons.css";
import SettingsPage from './pages/Settings';
import { useEffect, useState } from 'react';
import Alert from './components/Alert/Alert';
import HomePage from './pages/home/Index';
import Layout from './layout/LayoutBase';
import CRF from './pages/crf/CRF';
import NovaRequisicao from './pages/crf/NovaRequisicao';
import ClientsPage from './pages/clients/Clients';
import ImportadoresPage from './pages/importadores/Importadores';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<WellCome />} />
          <Route path='/settings' element={<SettingsPage />} />
          <Route path='/home' element={<Layout children={<HomePage />} path={"/home"} />} />
          <Route path='/crf' element={<Layout children={<CRF />} path={"/crf"} />} />
          <Route path='/crf/nova' element={<Layout children={<NovaRequisicao />} path={"/crf/nova"} />} />
          <Route path='/nova-requisicao' element={<Layout children={<NovaRequisicao />} path={"/nova-requisicao"} />} />
          <Route path='/clientes' element={<Layout children={<ClientsPage />} path={"/clientes"} />} />
          <Route path='/importadores' element={<Layout children={<ImportadoresPage />} path={"/importadores"} />} />
          <Route path='/importadores/cadastrar' element={<Layout children={<ImportadoresPage />} path={"/importadores"} />} />
          <Route path='*' element={<Layout children={<HomePage />} path={"/home"} />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
