import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../api/auth';

export default function SignupPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitting) return;

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const signupPromise = authService.signup(name, email, password);
      
      toast.promise(signupPromise, {
        loading: 'Creating account...',
        success: 'Account created successfully!',
        error: (err) => err.message || 'Failed to create account',
      });

      await signupPromise;
      navigate('/login');
    } catch (error) {
      // toast.promise handles the error UI
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
            Let's Create Account
          </h1>
          <p className="text-sm xl:text-base text-on-surface-variant">
            Start your journey into empathetic clinical data.
          </p>
        </header>
        <form className="space-y-4 xl:space-y-5" onSubmit={handleSignup}>
          {/* Username Field */}
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-on-surface-variant ml-1"
              htmlFor="username"
            >
              Username
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
                placeholder="clinician_alex"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          {/* Email Field */}
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-on-surface-variant ml-1"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-[20px]">
                  mail
                </span>
              </div>
              <input
                className="block w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200 placeholder:text-outline-variant text-on-surface shadow-sm shadow-black/5"
                id="email"
                name="email"
                placeholder="name@e-veda.health"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          {/* Password Field */}
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-on-surface-variant ml-1"
              htmlFor="password"
            >
              Password
            </label>
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
          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-on-surface-variant ml-1"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-[20px]">
                  verified_user
                </span>
              </div>
              <input
                className="block w-full pl-11 pr-12 py-3.5 bg-surface-container-lowest border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200 placeholder:text-outline-variant text-on-surface shadow-sm shadow-black/5"
                id="confirm-password"
                name="confirm-password"
                placeholder="••••••••"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors ${showConfirmPassword ? 'text-primary' : 'text-outline-variant hover:text-outline'}`}
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
          {/* Terms and Conditions */}
          <div className="flex items-start space-x-3 px-1 pt-1">
            <div className="flex items-center h-5">
              <input
                className="h-5 w-5 rounded border-surface-variant text-primary focus:ring-primary transition-all cursor-pointer"
                id="terms"
                required=""
                type="checkbox"
              />
            </div>
            <label
              className="text-xs leading-relaxed text-on-surface-variant cursor-pointer select-none"
              htmlFor="terms"
            >
              I agree to the{" "}
              <a className="text-primary font-bold hover:underline" href="#">
                Terms of Service
              </a>{" "}
              and{" "}
              <a className="text-primary font-bold hover:underline" href="#">
                Privacy Policy
              </a>{" "}
              regarding clinical data processing.
            </label>
          </div>
          {/* Submit Button */}
          <button
            className={`w-full flex justify-center items-center py-4 px-6 rounded-xl text-white font-bold bg-gradient-to-r from-primary to-primary-container shadow-xl shadow-primary/25 transition-all duration-200 mt-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-primary/40 active:scale-[0.98]'}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                Creating Account...
              </span>
            ) : 'Create Account'}
          </button>
        </form>
        {/* Secondary Actions */}
        <div className="space-y-6">
          <p className="text-center text-on-surface-variant text-sm">
            Already have an account?
            <Link className="text-primary font-bold hover:underline ml-1" to="/login">
              Back to Login
            </Link>
          </p>
        </div>
        {/* Footer Links */}
        <footer className="pt-12 flex flex-col items-center gap-6">
          <div className="flex justify-center gap-8 text-[11px] font-bold text-outline-variant tracking-wider uppercase">
            <a className="hover:text-on-surface transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-on-surface transition-colors" href="#">
              Terms of Service
            </a>
            <a className="hover:text-on-surface transition-colors" href="#">
              Support
            </a>
          </div>
          <span className="text-[10px] font-bold text-outline-variant/60 tracking-widest uppercase">
            © 2024 E-VEDA CLINICAL
          </span>
        </footer>
      </div>
  );
}
