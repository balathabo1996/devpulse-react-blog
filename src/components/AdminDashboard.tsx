import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useAuth } from "../context/AuthContext";
import { Loader2, PlusCircle, CheckCircle, Users, FileText, Trash2 } from "lucide-react";

interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  creationTime: string;
  lastSignInTime: string;
}

interface AdminDashboardProps {
  onNavigate: (view: "home" | "posts" | "about" | "contact" | "login" | "settings") => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<"posts" | "users">("posts");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "",
    imageUrl: "",
    content: "",
  });

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  if (user?.email !== adminEmail) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "4rem 0" }}>
        <h2 className="hero-title" style={{ color: "var(--danger)" }}>Access Denied</h2>
        <p className="hero-subtitle">You do not have permission to view the admin dashboard.</p>
        <button onClick={() => onNavigate("home")} className="btn btn-primary" style={{ marginTop: "2rem" }}>
          Return Home
        </button>
      </div>
    );
  }

  useEffect(() => {
    if (activeTab === "users" && token) {
      fetchUsers();
    }
  }, [activeTab, token]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch users");
      }
      const data = await response.json();
      setUsersList(data);
    } catch (err: any) {
      setErrorUsers(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!token || !window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    setDeletingUserId(uid);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${uid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }
      // Remove user from state
      setUsersList(prev => prev.filter(u => u.uid !== uid));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuillChange = (content: string) => {
    setFormData({ ...formData, content });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      setSuccess(true);
      setFormData({
        title: "",
        excerpt: "",
        category: "",
        imageUrl: "",
        content: "",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "code-block"],
      ["clean"],
    ],
  };

  return (
    <div className="container" style={{ padding: "4rem 0" }}>
      <div className="widget" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 className="widget-title">
          <span className="text-gradient">Admin Dashboard</span>
        </h1>
        
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
          <button 
            onClick={() => setActiveTab("posts")}
            style={{ 
              background: "transparent", 
              border: "none", 
              color: activeTab === "posts" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: activeTab === "posts" ? "bold" : "normal",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem"
            }}
          >
            <FileText size={18} /> Create Post
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            style={{ 
              background: "transparent", 
              border: "none", 
              color: activeTab === "users" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: activeTab === "users" ? "bold" : "normal",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem"
            }}
          >
            <Users size={18} /> Manage Users
          </button>
        </div>

        {activeTab === "posts" && (
          <div className="animate-fade-in">
            <p className="hero-subtitle" style={{ fontSize: "1rem", marginBottom: "2rem" }}>
              Create a new blog post.
            </p>

        {error && (
          <div className="form-error" style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", border: "1px solid var(--danger)" }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "rgba(34, 197, 94, 0.1)", color: "#4ade80", borderRadius: "8px", border: "1px solid #4ade80", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle size={20} />
            Post created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Post Title <span className="form-required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Mastering React Hooks"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category <span className="form-required">*</span>
            </label>
            <input
              type="text"
              id="category"
              name="category"
              className="form-input"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder="e.g. Engineering, AI, Career"
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl" className="form-label">
              Cover Image URL <span className="form-required">*</span>
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              className="form-input"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt" className="form-label">
              Excerpt (Short Summary) <span className="form-required">*</span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              className="form-input"
              value={formData.excerpt}
              onChange={handleChange}
              required
              placeholder="A brief overview of the post..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Post Content <span className="form-required">*</span>
            </label>
            <div className="quill-wrapper">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleQuillChange}
                modules={modules}
                style={{ height: "400px", marginBottom: "50px" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ alignSelf: "flex-start", marginTop: "1rem" }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" style={{ marginRight: "0.5rem" }} />
                Publishing...
              </>
            ) : (
              <>
                <PlusCircle size={18} style={{ marginRight: "0.5rem" }} />
                Publish Post
              </>
            )}
            </button>
          </form>
        </div>
        )}

        {activeTab === "users" && (
          <div className="animate-fade-in">
            <p className="hero-subtitle" style={{ fontSize: "1rem", marginBottom: "2rem" }}>
              Manage registered users.
            </p>
            
            {errorUsers ? (
              <div className="form-error" style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", border: "1px solid var(--danger)" }}>
                {errorUsers}
              </div>
            ) : loadingUsers ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                <Loader2 size={32} className="spin" style={{ color: "var(--primary)" }} />
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
                      <th style={{ padding: "1rem" }}>User</th>
                      <th style={{ padding: "1rem" }}>Email</th>
                      <th style={{ padding: "1rem" }}>Joined</th>
                      <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u.uid} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--surface-light)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            {u.photoURL ? (
                              <img src={u.photoURL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <span style={{ fontSize: "0.9rem", fontWeight: "bold", background: "linear-gradient(135deg, var(--primary), var(--secondary))", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                                {(u.displayName || u.email || 'U').charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span>{u.displayName || "No Name"}</span>
                        </td>
                        <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{u.email}</td>
                        <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{new Date(u.creationTime).toLocaleDateString()}</td>
                        <td style={{ padding: "1rem", textAlign: "right" }}>
                          <button 
                            onClick={() => handleDeleteUser(u.uid)}
                            disabled={deletingUserId === u.uid || u.email === adminEmail}
                            title={u.email === adminEmail ? "Admin account cannot be deleted" : "Delete user"}
                            style={{ 
                              background: "transparent", 
                              color: u.email === adminEmail ? "var(--text-muted)" : "var(--danger)", 
                              border: `1px solid ${u.email === adminEmail ? "var(--border)" : "var(--danger)"}`, 
                              padding: "0.4rem 0.75rem", 
                              borderRadius: "6px", 
                              cursor: u.email === adminEmail ? "not-allowed" : "pointer", 
                              display: "inline-flex", 
                              alignItems: "center", 
                              gap: "0.5rem",
                              opacity: u.email === adminEmail ? 0.5 : 1
                            }}
                          >
                            {deletingUserId === u.uid ? <Loader2 size={16} className="spin" /> : <Trash2 size={16} />}
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
