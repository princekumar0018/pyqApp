import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Previous from './pages/previous';
import Upload from './pages/upload';
import AdminLogin from './pages/adminLogin';
import AdminRegister from './pages/adminRegister';
import SuperAdminContent from './components/superAdminContent';

function App() {

  return (
    // <style></style>
    <div id='App'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/previous" element={<Previous /> } />
          <Route path="/upload" element={<Upload /> } />
          <Route path="/admin/login" element={<AdminLogin /> } />
          <Route path="/admin/register" element={<AdminRegister /> } />
          <Route path="/superadmin" element={<SuperAdminContent /> } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
