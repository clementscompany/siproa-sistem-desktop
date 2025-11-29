import { BrowserRouter, Route, Routes } from 'react-router-dom'
import WellCome from './pages/Login'
import "bootstrap-icons/font/bootstrap-icons.css";
import SettingsPage from './pages/Settings';
import { useEffect, useState } from 'react';
import Alert from './components/Alert/Alert';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<WellCome />} />
          <Route path='/settings' element={<SettingsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
