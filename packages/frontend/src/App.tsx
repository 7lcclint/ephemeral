import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import RegisterPage  from './components/auth/register/Register';
import HomePage  from './components/home/HomePage';
import MainPage  from './components/main/MainPage';
import Navbar from './components/navbar/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;