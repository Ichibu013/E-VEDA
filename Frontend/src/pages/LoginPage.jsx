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
          <button
            type="button"
            onClick={handleLogin}
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl border border-transparent bg-surface-container-lowest text-on-surface font-semibold transition-all duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-white hover:shadow-sm'}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
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
