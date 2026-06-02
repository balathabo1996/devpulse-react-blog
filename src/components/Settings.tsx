import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Save, Loader2, CheckCircle, Trash2, AlertTriangle } from "lucide-react";
import { updateProfile, deleteUser } from "firebase/auth";

export function Settings() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      await updateProfile(user, { displayName });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleteLoading(true);
    setError("");

    try {
      await deleteUser(user);
      window.location.reload(); // Refresh the app to clear all state
    } catch (err: any) {
      if (err.code === "auth/requires-recent-login") {
        setError("Security required: Please log out and log back in before deleting your account.");
      } else {
        setError(err.message || "Failed to delete account.");
      }
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2 className="hero-title" style={{ color: "var(--danger)" }}>Please log in</h2>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: "4rem 0", display: "flex", justifyContent: "center" }}>
      <div className="widget" style={{ width: "100%", maxWidth: "600px" }}>
        <h1 className="widget-title">
          <span className="text-gradient">Profile Settings</span>
        </h1>
        <p className="hero-subtitle" style={{ fontSize: "1rem", marginBottom: "2rem" }}>
          Manage your account details and display name.
        </p>
        
        {success && (
          <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "rgba(34, 197, 94, 0.1)", color: "#4ade80", borderRadius: "8px", border: "1px solid #4ade80", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle size={20} />
            Profile updated successfully!
          </div>
        )}
        
        {error && (
          <div className="form-error" style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", border: "1px solid var(--danger)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="form-group">
            <label className="form-label">Email Address (Cannot be changed)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <Mail size={18} />
              <span>{user.email}</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="displayName" className="form-label">Display Name</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <User size={18} />
              </div>
              <input
                type="text"
                id="displayName"
                className="form-input"
                style={{ paddingLeft: '3rem' }}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ alignSelf: "flex-start", marginTop: "1rem" }}>
            {loading ? (
              <><Loader2 size={18} className="spin icon-margin-right" /> Saving...</>
            ) : (
              <><Save size={18} className="icon-margin-right" /> Save Changes</>
            )}
          </button>
        </form>

        {user.email !== import.meta.env.VITE_ADMIN_EMAIL && (
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
            <h3 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <AlertTriangle size={18} /> Danger Zone
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Once you delete your account, there is no going back. Please be certain.
            </p>
            
            {showDeleteConfirm ? (
              <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid var(--danger)' }}>
                <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Are you absolutely sure?</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={handleDeleteAccount} 
                    disabled={deleteLoading}
                    style={{ background: 'var(--danger)', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    {deleteLoading ? <Loader2 size={16} className="spin" /> : <Trash2 size={16} />}
                    Yes, delete my account
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteLoading}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s ease' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Trash2 size={18} /> Delete Account
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
