import { LogIn, Terminal, Mail, Lock, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface LoginProps {
  onNavigate: (view: "home" | "posts" | "about" | "contact" | "login" | "admin" | "settings") => void;
}

export function Login({ onNavigate }: LoginProps) {
  const { user, signInWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      onNavigate("home");
    }
  }, [user, onNavigate]);

  const handleEmailAuth = async (e: React.FormEvent, isRegisterForm: boolean) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setError("");
    setLoading(true);
    
    try {
      if (isRegisterForm) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      // Map common Firebase errors to user-friendly messages
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please use at least 6 characters.");
      } else {
        setError(err.message || "Failed to authenticate.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      await signInWithGoogle();
    } catch (err: any) {
      setError("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ghost-auth-wrapper animate-fade-in">
      <div className={`ghost-auth-container ${isRegistering ? "right-panel-active" : ""}`}>
        
        {/* SIGN UP FORM (Left initially, moves Right) */}
        <div className="ghost-form-container ghost-sign-up-container">
          <form onSubmit={(e) => handleEmailAuth(e, true)} style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "100%", justifyContent: "center" }}>
            <h2 className="ghost-title text-gradient" style={{ textAlign: "center" }}>Create Account</h2>
            
            {error && isRegistering && <div className="form-error" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid var(--danger)', fontSize: '0.9rem' }}>{error}</div>}

            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  className="form-input floating-input"
                  style={{ paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  required
                />
                <label className="floating-label">Email address</label>
              </div>
            </div>
            
            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  className="form-input floating-input"
                  style={{ paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  required
                  minLength={6}
                />
                <label className="floating-label">Password</label>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0.5rem' }}
            >
              <UserPlus size={18} className="icon-margin-right" /> {loading ? "Creating..." : "Sign Up"}
            </button>
            
            <div className="auth-divider" style={{ display: 'flex', alignItems: 'center', textAlign: 'center', margin: '1rem 0', color: 'var(--text-muted)' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              <span style={{ padding: '0 1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin} 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                fontSize: '1rem', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                gap: '0.75rem',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Google
            </button>
          </form>
        </div>

        {/* SIGN IN FORM (Left initially, moves Right but is covered by Overlay) */}
        <div className="ghost-form-container ghost-sign-in-container">
          <form onSubmit={(e) => handleEmailAuth(e, false)} style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "100%", justifyContent: "center" }}>
            <h2 className="ghost-title text-gradient" style={{ textAlign: "center" }}>Sign In</h2>
            
            {error && !isRegistering && <div className="form-error" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid var(--danger)', fontSize: '0.9rem' }}>{error}</div>}

            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  className="form-input floating-input"
                  style={{ paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  required
                />
                <label className="floating-label">Email address</label>
              </div>
            </div>
            
            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  className="form-input floating-input"
                  style={{ paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  required
                  minLength={6}
                />
                <label className="floating-label">Password</label>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0.5rem' }}
            >
              <LogIn size={18} className="icon-margin-right" /> {loading ? "Signing in..." : "Sign In"}
            </button>
            
            <div className="auth-divider" style={{ display: 'flex', alignItems: 'center', textAlign: 'center', margin: '1rem 0', color: 'var(--text-muted)' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              <span style={{ padding: '0 1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin} 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                fontSize: '1rem', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                gap: '0.75rem',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Google
            </button>
          </form>
        </div>

        {/* SLIDING OVERLAY */}
        <div className="ghost-overlay-container">
          <div className="ghost-overlay">
            
            {/* OVERLAY LEFT PANEL (Visible when Registering is TRUE) */}
            <div className="ghost-overlay-panel ghost-overlay-left">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.15)', 
                  padding: '0.75rem', 
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(12px)',
                  transform: 'rotate(-5deg)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                }}>
                  <Terminal size={36} color="white" strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', letterSpacing: '-1px', textShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                  DevPulse
                </span>
              </div>
              <h1 className="ghost-title">Welcome Back!</h1>
              <p className="ghost-subtitle">To keep connected with us please login with your personal info</p>
              <button 
                className="ghost-btn-ghost" 
                onClick={() => { setIsRegistering(false); setError(""); }}
              >
                Sign In
              </button>
            </div>
            
            {/* OVERLAY RIGHT PANEL (Visible when Registering is FALSE) */}
            <div className="ghost-overlay-panel ghost-overlay-right">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.15)', 
                  padding: '0.75rem', 
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(12px)',
                  transform: 'rotate(-5deg)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                }}>
                  <Terminal size={36} color="white" strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', letterSpacing: '-1px', textShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                  DevPulse
                </span>
              </div>
              <h1 className="ghost-title">Hello, Friend!</h1>
              <p className="ghost-subtitle">Enter your personal details and start your journey with us</p>
              <button 
                className="ghost-btn-ghost" 
                onClick={() => { setIsRegistering(true); setError(""); }}
              >
                Sign Up
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
