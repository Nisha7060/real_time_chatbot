'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? '/api/login' : '/api/register';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log("<><><dataa><><>",data)
    if (res.ok) {
      toast.success(data.message || 'Success!', { autoClose: 2000 });

      if (isLogin) {
        Cookies.set('token', data.token, {expires: 1,secure: true,sameSite: 'Strict',});
        Cookies.set('user_id', data?.user?.id, {expires: 1,secure: true,sameSite: 'Strict',});
        Cookies.set('mobile', data?.user?.mobile, {expires: 1,secure: true,sameSite: 'Strict',});
        
        setTimeout(() => router.push('/web-chat'), 100);
      } else {
        setTimeout(() => setIsLogin(true), 250); // Redirect to Login tab
      }
    } else {
      toast.error(data.error || 'Something went wrong');
    }

    setLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4 w-100" style={{ maxWidth: '420px' }}>
        <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your name"
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Mobile</label>
            <input
              type="text"
              name="mobile"
              className="form-control"
              placeholder="Enter mobile number"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Confirm password"
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-success w-100 mb-3" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="text-center">
          <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
          <button onClick={() => setIsLogin(!isLogin)} className="btn btn-link">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="bottom-right" />
    </div>
  );
}
