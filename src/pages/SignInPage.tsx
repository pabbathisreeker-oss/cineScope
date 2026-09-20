import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Loader2, Sparkles, Check } from 'lucide-react';
import { CineScopeLogo } from '@/components/ui/CineScopeLogo';
import { authService } from '@/services/authService';
import useAuthStore from '@/store/useAuthStore';
import PATHS from '@/routes/paths';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Validation & Submission States
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  // Background image loaded state
  const [bgLoaded, setBgLoaded] = useState(false);

  // Background artwork: high-resolution cinematic backdrop
  const backdropUrl = 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5200bm.jpg';
  const fallbackBackdrop = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1920&auto=format&fit=crop';

  // Email format validator
  const validateEmail = (val: string) => {
    if (!val.trim()) return 'Email address is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) return 'Please enter a valid email address.';
    return '';
  };

  // Password validator
  const validatePassword = (val: string) => {
    if (!val) return 'Password is required.';
    if (val.length < 6) return 'Password must be at least 6 characters.';
    return '';
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email') {
      const err = validateEmail(email);
      setErrors((prev) => ({ ...prev, email: err || undefined }));
    }
    if (field === 'password') {
      const err = validatePassword(password);
      setErrors((prev) => ({ ...prev, password: err || undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    if (emailErr || passwordErr) {
      setErrors({
        email: emailErr || undefined,
        password: passwordErr || undefined,
      });
      setTouched({ email: true, password: true });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Execute authentication service (ready for Supabase plug-in)
      const result = await authService.signIn({
        email: email.trim(),
        password,
        rememberMe,
      });

      // Strict Validation: Only proceed if Supabase returns both an authenticated user and an active session with no error
      if (result.error || !result.user || !result.session) {
        setErrors({
          general: result.error || 'Invalid email or password. Please try again.',
        });
        setIsLoading(false);
        return; // DO NOT NAVIGATE
      }

      // Update global auth store with authenticated user
      login(result.user);

      // Only navigate after confirming valid authenticated session
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || PATHS.HOME;
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Sign In Error:', err);
      setErrors({
        general: 'An unexpected connection error occurred. Please try again later.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030B1B] flex flex-col justify-between select-none">
      {/* ------------------------------------------------------------- */}
      {/* 1. CINEMATIC FULL-SCREEN BACKGROUND ARTWORK                   */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={backdropUrl}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallbackBackdrop;
          }}
          onLoad={() => setBgLoaded(true)}
          alt="Cinematic Movie Backdrop"
          className={`w-full h-full object-cover object-center scale-105 transition-all duration-1000 ease-out filter blur-[2px] brightness-50 ${
            bgLoaded ? 'opacity-55' : 'opacity-0'
          }`}
        />

        {/* Deep cinematic gradient overlays to heavily blend artwork into background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030B1B] via-[#030B1B]/75 to-[#030B1B]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030B1B] via-transparent to-[#030B1B]" />
        
        {/* Cinematic Vignette */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(3, 11, 27, 0.85) 75%, #030B1B 100%)'
          }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. TOP MINIMAL NAVIGATION BAR                                 */}
      {/* ------------------------------------------------------------- */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex items-center justify-between">
        <Link
          to={PATHS.LANDING}
          className="group inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-white/5"
          aria-label="Back to Landing Page"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to CineScope</span>
        </Link>

        <Link to={PATHS.LANDING} className="flex items-center">
          <CineScopeLogo size="sm" variant="full" />
        </Link>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 3. CENTERED CINEMATIC AUTHENTICATION CARD                     */}
      {/* ------------------------------------------------------------- */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px] rounded-3xl p-6 sm:p-9 bg-[#0B132B]/85 backdrop-blur-2xl border border-white/10 shadow-[0_24px_50px_rgba(0,0,0,0.85)] flex flex-col"
        >
          {/* Card Header & Brand Identity */}
          <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
            <div className="mb-4 p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(212,161,90,0.15)] text-primary">
              <Sparkles className="h-6 w-6" />
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Welcome back
            </h1>
            <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
              Sign in to continue your movie journey.
            </p>
          </div>

          {/* Clean CineScope Error Banner */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs leading-relaxed">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{errors.general}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label 
                htmlFor="signin-email" 
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1"
              >
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-muted-foreground pointer-events-none">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  onBlur={() => handleBlur('email')}
                  placeholder="name@example.com"
                  autoComplete="email"
                  disabled={isLoading}
                  className={`w-full bg-[#030B1B]/70 border rounded-2xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 disabled:opacity-50 ${
                    touched.email && errors.email
                      ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                      : 'border-white/10 hover:border-white/20 focus:border-primary focus:ring-primary/20'
                  }`}
                />
              </div>
              {touched.email && errors.email && (
                <p className="text-[11px] font-medium text-destructive pl-1 animate-fade-in">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between pl-1">
                <label 
                  htmlFor="signin-password" 
                  className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-primary/80 hover:text-primary transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative flex items-center">
                <span className="absolute left-4 text-muted-foreground pointer-events-none">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                  className={`w-full bg-[#030B1B]/70 border rounded-2xl pl-11 pr-11 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 disabled:opacity-50 ${
                    touched.password && errors.password
                      ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                      : 'border-white/10 hover:border-white/20 focus:border-primary focus:ring-primary/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-[11px] font-medium text-destructive pl-1 animate-fade-in">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2 pt-1 pl-1">
              <button
                type="button"
                role="checkbox"
                aria-checked={rememberMe}
                onClick={() => setRememberMe(!rememberMe)}
                className={`h-4 w-4 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                  rememberMe
                    ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_10px_rgba(212,161,90,0.3)]'
                    : 'border-white/20 bg-black/40 hover:border-white/40'
                }`}
              >
                {rememberMe && <Check className="h-3 w-3 stroke-[3]" />}
              </button>
              <label
                onClick={() => setRememberMe(!rememberMe)}
                className="text-xs text-muted-foreground font-medium cursor-pointer select-none hover:text-foreground transition-colors"
              >
                Remember this device
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group inline-flex items-center justify-center space-x-2 rounded-2xl bg-primary px-6 py-3.5 font-body font-bold text-sm text-primary-foreground transition-all duration-300 hover:bg-primary-hover hover:shadow-[0_0_25px_rgba(212,161,90,0.45)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="mt-6 sm:mt-8 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-muted-foreground">
              Don't have an account?{' '}
              <span className="font-semibold text-primary/80 hover:text-primary transition-colors cursor-pointer">
                Sign Up
              </span>
            </p>
          </div>
        </motion.div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* 4. MINIMAL FOOTER                                             */}
      {/* ------------------------------------------------------------- */}
      <footer className="relative z-20 w-full py-4 text-center text-[11px] text-muted-foreground/60 px-4">
        <p>© {new Date().getFullYear()} CineScope. All rights reserved. Powered by TMDB & Supabase Ready.</p>
      </footer>
    </div>
  );
};

export default SignInPage;
