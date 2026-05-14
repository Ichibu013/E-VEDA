import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../api/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitting) return;
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const loginPromise = authService.login(email, password);
      
      toast.promise(loginPromise, {
        loading: 'Authenticating...',
        success: 'Successfully logged in!',
        error: (err) => err.message || 'Failed to login',
      });

      await loginPromise;
      navigate('/dashboard');
    } catch (error) {
      // toast.promise already handles the error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="w-full max-w-md space-y-6 xl:space-y-8 py-6 xl:py-10">
        {/* Branding for Mobile */}
        <div className="lg:hidden flex items-center justify-center gap-2 mb-8 xl:mb-12">
          <span className="material-symbols-outlined text-primary text-3xl">
            health_metrics
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-on-surface">
            E-VEDA
          </span>
        </div>
        <header>
          <h1 className="text-2xl xl:text-3xl font-extrabold text-on-surface mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm xl:text-base text-on-surface-variant">
            Access your clinical dashboard to continue tracking.
          </p>
        </header>
        <form className="space-y-4 xl:space-y-6" onSubmit={handleLogin}>
          {/* Username Field */}
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-on-surface-variant ml-1"
              htmlFor="username"
            >
              Username or Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-[20px]">
                  person
                </span>
              </div>
              <input
                className="block w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200 placeholder:text-outline-variant text-on-surface shadow-sm shadow-black/5"
                id="username"
                name="username"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label
                className="text-sm font-semibold text-on-surface-variant"
                htmlFor="password"
              >
                Password
              </label>
              <a
                className="text-xs font-bold text-primary hover:text-primary-dim transition-colors"
                href="#"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-[20px]">
                  lock
                </span>
              </div>
              <input
                className="block w-full pl-11 pr-12 py-3.5 bg-surface-container-lowest border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200 placeholder:text-outline-variant text-on-surface shadow-sm shadow-black/5"
                id="password"
                name="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors ${showPassword ? 'text-primary' : 'text-outline-variant hover:text-outline'}`}
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
          {/* Remember Me */}
          <div className="flex items-center space-x-3 px-1">
            <div className="flex items-center h-5">
              <input
                className="h-5 w-5 rounded border-surface-variant text-primary focus:ring-primary transition-all cursor-pointer"
                id="remember"
                type="checkbox"
              />
            </div>
            <label
              className="text-sm text-on-surface-variant cursor-pointer select-none"
              htmlFor="remember"
            >
              Keep me signed in for 30 days
            </label>
          </div>
          {/* Submit Button */}
          <button
            className={`w-full flex justify-center items-center py-4 px-6 rounded-xl text-white font-bold bg-gradient-to-r from-primary to-primary-container shadow-xl shadow-primary/25 transition-all duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-primary/40 active:scale-[0.98]'}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                Authenticating...
              </span>
            ) : 'Login to Dashboard'}
          </button>
        </form>
        {/* Separator */}
        <div className="relative py-4">
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center"
          >
            <div className="w-full border-t border-surface-container-highest" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-surface px-4 text-xs font-bold text-outline-variant tracking-widest uppercase">
              OR
            </span>
          </div>
        </div>
        {/* Secondary Actions */}
        <div className="space-y-4">
          <p className="text-center text-on-surface-variant text-sm">
            New to E-VEDA?
            <Link className="text-primary font-bold hover:underline ml-1" to="/signup">
              Create Account
            </Link>
          </p>
        </div>
        {/* Footer Links */}
        <footer className="pt-8 flex justify-center gap-8 text-[11px] font-bold text-outline-variant tracking-wider uppercase">
          <a className="hover:text-on-surface transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-on-surface transition-colors" href="#">
            Terms of Service
          </a>
          <a className="hover:text-on-surface transition-colors" href="#">
            Support
          </a>
        </footer>
      </div>
  );
}
