import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Register from "./pages/register/RegisterPage";
import Login from "./pages/login/LoginPage";
import { ToastContainer } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import HomePage from "./pages/home/Home";
import { useEffect } from "react";
import useAuthStore from "./store/useAuthStore";
function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');

    if (token) {
      localStorage.setItem('token', token);
      setToken(token);
      setUser({ email: email || '', name: name || '' });
      navigate('/');
    }
  }, [location.search, navigate, setToken, setUser]);
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
