import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useAuth } from "../context/AuthContext";
import { TableSkeleton } from "./SkeletonLoader";
import { Loader2, PlusCircle, CheckCircle, Users, FileText, Trash2, Edit, List, BarChart2, TrendingUp, MessageSquare, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

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
  const [activeTab, setActiveTab] = useState<"posts" | "manage_posts" | "users" | "analytics">("posts");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [postsList, setPostsList] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [errorPosts, setErrorPosts] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [postsPage, setPostsPage] = useState(1);
  const [postsTotalPages, setPostsTotalPages] = useState(1);

  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [usersPage, setUsersPage] = useState(1);
  const [usersPageTokens, setUsersPageTokens] = useState<string[]>([]);
  const [usersNextToken, setUsersNextToken] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [errorAnalytics, setErrorAnalytics] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "",
    imageUrl: "",
    content: "",
    status: "published" as "draft" | "published",
  });

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;



  useEffect(() => {
    if (activeTab === "manage_posts") {
      fetchAdminPosts();
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "analytics") {
      fetchAnalytics();
    }
  }, [activeTab, postsPage, usersPage, token]);

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    setErrorAnalytics(null);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err: any) {
      setErrorAnalytics(err.message);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchAdminPosts = async () => {
    setLoadingPosts(true);
    setErrorPosts(null);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/posts?limit=10&page=${postsPage}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPostsList(data.posts);
      setPostsTotalPages(data.totalPages);
    } catch (err: any) {
      setErrorPosts(err.message);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const currentToken = usersPageTokens.length > 0 ? usersPageTokens[usersPageTokens.length - 1] : "";
      const url = `http://localhost:5000/api/users?limit=10${currentToken ? `&pageToken=${currentToken}` : ""}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch users");
      }
      const data = await response.json();
      setUsersList(data.users);
      setUsersNextToken(data.nextPageToken || null);
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

  const handleEditPost = (post: any) => {
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      imageUrl: post.imageUrl,
      content: post.content,
      status: post.status || "published",
    });
    setEditingPostId(post.id || post._id);
    setActiveTab("posts");
  };

  const handleDeletePost = async (id: string) => {
    if (!token || !window.confirm("Are you sure you want to delete this post?")) return;
    setDeletingPostId(id);
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      setPostsList(prev => prev.filter(p => (p.id || p._id) !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingPostId(null);
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
      const isEditing = !!editingPostId;
      const url = isEditing 
        ? `http://localhost:5000/api/posts/${editingPostId}` 
        : "http://localhost:5000/api/posts";
        
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEditing ? "update" : "create"} post`);
      }

      setSuccess(true);
      setFormData({
        title: "",
        excerpt: "",
        category: "",
        imageUrl: "",
        content: "",
        status: "published",
      });
      setEditingPostId(null);
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

  return (
    <div className="container" style={{ padding: "4rem 0" }}>
      <div className="widget" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 className="widget-title">
          <span className="text-gradient">Admin Dashboard</span>
        </h1>
        
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
          <button 
            onClick={() => {
              setActiveTab("posts");
              if (activeTab !== "posts") {
                setEditingPostId(null);
                setFormData({ title: "", excerpt: "", category: "", imageUrl: "", content: "", status: "published" });
                setSuccess(false);
              }
            }}
            className={`admin-tab-btn ${activeTab === "posts" ? "active" : ""}`}
          >
            <FileText size={18} /> {editingPostId ? "Edit Post" : "Create Post"}
          </button>
          <button 
            onClick={() => setActiveTab("manage_posts")}
            className={`admin-tab-btn ${activeTab === "manage_posts" ? "active" : ""}`}
          >
            <List size={18} /> Manage Posts
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
          >
            <Users size={18} /> Manage Users
          </button>
          <button 
            onClick={() => setActiveTab("analytics")}
            className={`admin-tab-btn ${activeTab === "analytics" ? "active" : ""}`}
          >
            <BarChart2 size={18} /> Analytics
          </button>
        </div>

        {activeTab === "posts" && (
          <div className="animate-fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <p className="hero-subtitle" style={{ fontSize: "1rem", margin: 0 }}>
                {editingPostId ? "Editing existing blog post." : "Create a new blog post."}
              </p>
              {editingPostId && (
                <button 
                  onClick={() => {
                    setEditingPostId(null);
                    setFormData({ title: "", excerpt: "", category: "", imageUrl: "", content: "", status: "published" });
                    setActiveTab("manage_posts");
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ border: "1px solid var(--border)" }}
                >
                  Cancel Edit
                </button>
              )}
            </div>

        {error && (
          <div className="form-error" style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", border: "1px solid var(--danger)" }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "rgba(34, 197, 94, 0.1)", color: "#4ade80", borderRadius: "8px", border: "1px solid #4ade80", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle size={20} />
            {editingPostId ? "Post updated successfully!" : "Post created successfully!"}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="form-group floating-group">
            <input
              type="text"
              id="title"
              name="title"
              className="form-input floating-input-global"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="title" className="floating-label-global">
              Post Title <span className="form-required">*</span>
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div className="form-group floating-group">
              <input
                type="text"
                id="category"
                name="category"
                className="form-input floating-input-global"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label htmlFor="category" className="floating-label-global">
                Category <span className="form-required">*</span>
              </label>
            </div>

            <div className="form-group floating-group">
              <select
                id="status"
                name="status"
                className="form-input floating-input-global"
                value={formData.status}
                onChange={handleChange}
                required
                style={{ appearance: "none", backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23cbd5e1\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "1em" }}
              >
                <option value="published">Published (Live)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
              <label htmlFor="status" className="floating-label-global" style={{ top: 0, left: '0.8rem', fontSize: '0.75rem', color: 'var(--primary)', background: 'var(--surface)', padding: '0 0.25rem', transform: 'translateY(-50%)' }}>
                Status <span className="form-required">*</span>
              </label>
            </div>
          </div>

          <div className="form-group floating-group">
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              className="form-input floating-input-global"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="imageUrl" className="floating-label-global">
              Cover Image URL <span className="form-required">*</span>
            </label>
          </div>

          <div className="form-group floating-group">
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              className="form-input floating-input-global"
              value={formData.excerpt}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="excerpt" className="floating-label-global">
              Excerpt (Short Summary) <span className="form-required">*</span>
            </label>
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
                {editingPostId ? "Updating..." : "Publishing..."}
              </>
            ) : (
              <>
                <PlusCircle size={18} style={{ marginRight: "0.5rem" }} />
                {editingPostId ? "Update Post" : "Publish Post"}
              </>
            )}
            </button>
          </form>
        </div>
        )}

        {activeTab === "manage_posts" && (
          <div className="animate-fade-in">
            <p className="hero-subtitle" style={{ fontSize: "1rem", marginBottom: "2rem" }}>
              Manage published posts.
            </p>
            
            {errorPosts ? (
              <div className="form-error" style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", border: "1px solid var(--danger)" }}>
                {errorPosts}
              </div>
            ) : loadingPosts ? (
              <TableSkeleton />
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
                      <th style={{ padding: "1rem" }}>Post Title</th>
                      <th style={{ padding: "1rem" }}>Category</th>
                      <th style={{ padding: "1rem" }}>Date</th>
                      <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postsList.map((p) => (
                      <tr key={p.id || p._id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "1rem", fontWeight: "bold", maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {p.title}
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ padding: "0.2rem 0.6rem", borderRadius: "100px", background: "var(--surface-light)", fontSize: "0.85rem", color: "var(--primary)" }}>
                              {p.category}
                            </span>
                            {p.status === "draft" && (
                              <span style={{ padding: "0.2rem 0.6rem", borderRadius: "100px", border: "1px solid var(--border)", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                Draft
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{new Date(p.date || p.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: "1rem", textAlign: "right" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                            <button 
                              onClick={() => handleEditPost(p)}
                              className="btn btn-surface btn-sm"
                            >
                              <Edit size={16} /> Edit
                            </button>
                            <button 
                              onClick={() => handleDeletePost(p.id || p._id)}
                              disabled={deletingPostId === (p.id || p._id)}
                              className="btn btn-danger-ghost btn-sm"
                            >
                              {deletingPostId === (p.id || p._id) ? <Loader2 size={16} className="spin" /> : <Trash2 size={16} />}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {postsList.length === 0 && (
                  <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>No posts found.</p>
                )}
                {postsTotalPages > 1 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", padding: "1rem" }}>
                    <button 
                      className="btn btn-surface btn-sm" 
                      disabled={postsPage === 1}
                      onClick={() => setPostsPage(p => p - 1)}
                    >
                      Previous
                    </button>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Page {postsPage} of {postsTotalPages}</span>
                    <button 
                      className="btn btn-surface btn-sm" 
                      disabled={postsPage === postsTotalPages}
                      onClick={() => setPostsPage(p => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
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
              <TableSkeleton />
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
                            className="btn btn-danger-ghost btn-sm"
                          >
                            {deletingUserId === u.uid ? <Loader2 size={16} className="spin" /> : <Trash2 size={16} />}
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {usersList.length === 0 && (
                  <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>No users found.</p>
                )}
                {(usersPage > 1 || usersNextToken) && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", padding: "1rem" }}>
                    <button 
                      className="btn btn-surface btn-sm" 
                      disabled={usersPage === 1}
                      onClick={() => {
                        setUsersPageTokens(prev => prev.slice(0, -1));
                        setUsersPage(p => p - 1);
                      }}
                    >
                      Previous
                    </button>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Page {usersPage}</span>
                    <button 
                      className="btn btn-surface btn-sm" 
                      disabled={!usersNextToken}
                      onClick={() => {
                        if (usersNextToken) {
                          setUsersPageTokens(prev => [...prev, usersNextToken]);
                          setUsersPage(p => p + 1);
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="animate-fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <p className="hero-subtitle" style={{ fontSize: "1rem", margin: 0 }}>
                Platform performance and metrics.
              </p>
              <button onClick={fetchAnalytics} className="btn btn-surface btn-sm" disabled={loadingAnalytics}>
                {loadingAnalytics ? <Loader2 size={16} className="spin" /> : "Refresh"}
              </button>
            </div>

            {errorAnalytics ? (
              <div className="form-error" style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", border: "1px solid var(--danger)" }}>
                {errorAnalytics}
              </div>
            ) : loadingAnalytics && !analyticsData ? (
              <TableSkeleton />
            ) : analyticsData ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                  <div style={{ padding: "1.5rem", borderRadius: "12px", background: "rgba(30, 41, 59, 0.4)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)" }}>
                      <Eye size={18} /> <span style={{ fontWeight: 500 }}>Total Views</span>
                    </div>
                    <span style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--text-primary)" }}>
                      {analyticsData.totalViews.toLocaleString()}
                    </span>
                  </div>
                  
                  <div style={{ padding: "1.5rem", borderRadius: "12px", background: "rgba(30, 41, 59, 0.4)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)" }}>
                      <TrendingUp size={18} /> <span style={{ fontWeight: 500 }}>Total Likes</span>
                    </div>
                    <span style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--text-primary)" }}>
                      {analyticsData.totalLikes.toLocaleString()}
                    </span>
                  </div>
                  
                  <div style={{ padding: "1.5rem", borderRadius: "12px", background: "rgba(30, 41, 59, 0.4)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)" }}>
                      <MessageSquare size={18} /> <span style={{ fontWeight: 500 }}>Total Comments</span>
                    </div>
                    <span style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--text-primary)" }}>
                      {analyticsData.totalComments.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div style={{ padding: "2rem", borderRadius: "12px", background: "rgba(30, 41, 59, 0.2)", border: "1px solid var(--border)" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "2rem", color: "var(--text-primary)" }}>Category Performance (Views)</h3>
                  <div style={{ width: "100%", height: "350px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.categoryPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="var(--text-muted)" 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis 
                          stroke="var(--text-muted)" 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          dx={-10}
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', backdropFilter: 'blur(10px)' }}
                        />
                        <Bar dataKey="views" radius={[4, 4, 0, 0]}>
                          {analyticsData.categoryPerformance.map((_entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "var(--primary)" : "var(--secondary)"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
}
