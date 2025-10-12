import './App.css'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Previous from './pages/previous';
import Upload from './pages/upload';
import AdminLogin from './pages/adminLogin';
import AdminRegister from './pages/adminRegister';
import SuperAdminContent from './components/superAdminContent';
import EvaluateSolution from './pages/evaluateSolution';
import Meet from './pages/meet';

function App() {

  return (
    // <style></style>
    <div id='App'>
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/previous" element={<Previous />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/superadmin" element={<SuperAdminContent />} />
          <Route path="/evaluate" element={<EvaluateSolution />} />
          <Route path="/meet" element={<Meet />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
