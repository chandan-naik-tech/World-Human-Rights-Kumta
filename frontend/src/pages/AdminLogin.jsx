import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, token } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    const res = await login(username, password);
    setLoading(false);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-royal dark:bg-navy-dark px-4 py-12 relative overflow-hidden">
      {/* Background visual elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md space-y-8 z-10">
        
        {/* Header logo / branding */}
        <div className="text-center">
          <span className="text-6xl animate-pulse">⚖️</span>
          <h2 className="mt-6 text-3xl font-extrabold text-white tracking-wider font-serif uppercase">
            ADMIN PORTAL
          </h2>
          <p className="mt-2 text-xs text-slate-300 tracking-wider uppercase font-semibold">
            WHR RK Foundations Kumta
          </p>
        </div>

        {/* Login form card */}
        <div className="glass-effect p-8 md:p-10 rounded-3xl shadow-2xl border border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-200 rounded-xl text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase mb-2">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                  />
                  <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase mb-2">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                  />
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gold hover:bg-gold-dark text-navy-dark hover:text-white font-bold transition duration-300 shadow-lg text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-400 hover:text-white transition font-medium"
          >
            &larr; Back to homepage
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
