import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, MessageSquare, Heart, Settings, Loader2, Save } from "lucide-react";
import type { Post, Comment } from "../types";

export function UserProfile() {
  const { user, token, signInWithGoogle } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"activity" | "settings">("activity");
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  
  const [displayName, setDisplayName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      fetchActivity();
    }
  }, [user, token]);

  const fetchActivity = async () => {
    if (!token) return;
    setLoadingActivity(true);
    try {
      const [commentsRes, likesRes] = await Promise.all([
        fetch("http://localhost:5000/api/users/profile/comments", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/users/profile/likes", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (commentsRes.ok) setComments(await commentsRes.json());
      if (likesRes.ok) setLikedPosts(await likesRes.json());
    } catch (err) {
      console.error("Failed to fetch activity", err);
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setSavingProfile(true);
    setProfileMessage({ type: "", text: "" });
    
    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ displayName })
      });
      
      if (!response.ok) throw new Error("Failed to update profile");
      
      setProfileMessage({ type: "success", text: "Profile updated successfully! Changes may take a moment to reflect across the site." });
    } catch (err: any) {
      setProfileMessage({ type: "error", text: err.message || "An error occurred" });
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) {
    return (
      <div className="layout-grid">
        <div className="widget" style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <h2>Please log in to view your profile</h2>
          <button onClick={signInWithGoogle} className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>
      <div className="widget profile-header" style={{ display: "flex", alignItems: "center", gap: "2rem", padding: "2rem" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--surface-light)", overflow: "hidden" }}>
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || "User"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <User size={40} style={{ margin: "20px" }} />
          )}
        </div>
        <div>
          <h1 style={{ margin: 0 }}>{user.displayName || "Reader"}</h1>
          <p style={{ color: "var(--text-muted)", margin: "0.5rem 0 0 0" }}>{user.email}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "2rem", marginTop: "2rem" }}>
        <div className="widget" style={{ padding: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <button 
              className={`btn ${activeTab === "activity" ? "btn-primary" : "btn-surface"}`}
              onClick={() => setActiveTab("activity")}
              style={{ justifyContent: "flex-start", padding: "0.75rem 1rem" }}
            >
              <MessageSquare size={18} style={{ marginRight: "0.5rem" }} /> Activity
            </button>
            <button 
              className={`btn ${activeTab === "settings" ? "btn-primary" : "btn-surface"}`}
              onClick={() => setActiveTab("settings")}
              style={{ justifyContent: "flex-start", padding: "0.75rem 1rem" }}
            >
              <Settings size={18} style={{ marginRight: "0.5rem" }} /> Settings
            </button>
          </div>
        </div>

        <div className="widget" style={{ padding: "2rem", minHeight: "400px" }}>
          {activeTab === "activity" && (
            <div>
              <h2 style={{ marginBottom: "1.5rem" }}>Your Activity</h2>
              
              {loadingActivity ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}><Loader2 className="spin" size={32} /></div>
              ) : (
                <>
                  <div style={{ marginBottom: "3rem" }}>
                    <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                      <Heart size={20} color="#ef4444" /> Liked Posts ({likedPosts.length})
                    </h3>
                    {likedPosts.length === 0 ? (
                      <p style={{ color: "var(--text-muted)" }}>You haven't liked any posts yet.</p>
                    ) : (
                      <ul style={{ listStyle: "none", padding: 0 }}>
                        {likedPosts.map(post => (
                          <li key={post.id} style={{ marginBottom: "1rem", padding: "1rem", background: "var(--surface-light)", borderRadius: "8px" }}>
                            <a href={`/post/${post.id}`} style={{ color: "var(--primary)", fontWeight: "bold", textDecoration: "none", fontSize: "1.1rem" }}>{post.title}</a>
                            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{post.date}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                      <MessageSquare size={20} color="var(--primary)" /> Your Comments ({comments.length})
                    </h3>
                    {comments.length === 0 ? (
                      <p style={{ color: "var(--text-muted)" }}>You haven't left any comments yet.</p>
                    ) : (
                      <ul style={{ listStyle: "none", padding: 0 }}>
                        {comments.map(comment => (
                          <li key={comment.id} style={{ marginBottom: "1rem", padding: "1rem", background: "var(--surface-light)", borderRadius: "8px" }}>
                            <p style={{ marginBottom: "0.5rem" }}>"{comment.text}"</p>
                            <a href={`/post/${comment.postId}`} style={{ fontSize: "0.9rem", color: "var(--primary)", textDecoration: "none" }}>View on Post &rarr;</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 style={{ marginBottom: "1.5rem" }}>Profile Settings</h2>
              
              {profileMessage.text && (
                <div style={{ padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", background: profileMessage.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: profileMessage.type === "success" ? "#10b981" : "#ef4444", border: `1px solid ${profileMessage.type === "success" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}` }}>
                  {profileMessage.text}
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Display Name</label>
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. CodeWizard"
                    style={{ width: "100%", padding: "0.75rem", background: "var(--surface-light)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)" }}
                  />
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>This name will appear on your comments.</p>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Email Address</label>
                  <input 
                    type="text" 
                    value={user.email || ""}
                    disabled
                    style={{ width: "100%", padding: "0.75rem", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-muted)", cursor: "not-allowed" }}
                  />
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Email cannot be changed via Google Auth.</p>
                </div>

                <button type="submit" disabled={savingProfile} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {savingProfile ? <Loader2 className="spin" size={18} /> : <Save size={18} />}
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
