import express from "express";
import nodemailer from "nodemailer";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { Post } from "./models/Post.js";
import { Comment } from "./models/Comment.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow frontend
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Security Headers Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allow cross-origin requests from frontend
  }),
);

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", globalLimiter);

// Strict Rate Limiting for Comments
const commentsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 comments per minute
  message: {
    error:
      "Too many comments created from this IP, please try again after a minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Initialize Firebase Admin (Only if config is provided)
if (process.env.FIREBASE_PROJECT_ID) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace literal \n with actual newlines in private key
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    console.log("Firebase Admin initialized");
  } catch (error) {
    console.error("Firebase Admin setup error:", error);
  }
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Auth Middleware (Verify Firebase Token)
const verifyAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    if (admin.apps.length > 0) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
    } else {
      console.warn(
        "Firebase Admin not configured, decoding JWT without verification",
      );
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString(),
      );
      req.user = payload;
    }
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Admin Middleware
const verifyAdmin = async (req, res, next) => {
  if (req.user.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
  next();
};

// API: Get all users
app.get("/api/users", verifyAuth, verifyAdmin, async (req, res) => {
  if (admin.apps.length === 0) {
    return res
      .status(500)
      .json({
        error:
          "Firebase Admin SDK not initialized. Please configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in server/.env",
      });
  }
  try {
    const limit = parseInt(req.query.limit) || 10;
    const pageToken = req.query.pageToken || undefined;
    const listUsersResult = await admin.auth().listUsers(limit, pageToken);
    const users = listUsersResult.users.map((u) => ({
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      photoURL: u.photoURL,
      creationTime: u.metadata.creationTime,
      lastSignInTime: u.metadata.lastSignInTime,
    }));
    res.json({ users, nextPageToken: listUsersResult.pageToken });
  } catch (error) {
    console.error("Error listing users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// API: Delete a user
app.delete("/api/users/:uid", verifyAuth, verifyAdmin, async (req, res) => {
  if (admin.apps.length === 0) {
    return res.status(500).json({ error: "Firebase Admin SDK not initialized." });
  }
  try {
    const { uid } = req.params;
    const userToDelete = await admin.auth().getUser(uid);
    if (userToDelete.email === process.env.ADMIN_EMAIL) {
      return res.status(403).json({ error: "Cannot delete the admin account" });
    }
    await admin.auth().deleteUser(uid);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// API: Get user's own comments
app.get("/api/users/profile/comments", verifyAuth, async (req, res) => {
  try {
    const comments = await Comment.find({ userEmail: req.user.email }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user comments" });
  }
});

// API: Get user's liked posts
app.get("/api/users/profile/likes", verifyAuth, async (req, res) => {
  try {
    const posts = await Post.find({ likes: req.user.email }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch liked posts" });
  }
});

// API: Update user's profile
app.put("/api/users/profile", verifyAuth, async (req, res) => {
  if (admin.apps.length === 0) {
    return res.status(500).json({ error: "Firebase Admin SDK not initialized." });
  }
  try {
    const { displayName } = req.body;
    const userRecord = await admin.auth().updateUser(req.user.uid, {
      displayName: displayName,
    });
    res.json({ message: "Profile updated successfully", user: userRecord });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// API: Get all categories
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Post.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// API: Create new post
app.post("/api/posts", verifyAuth, async (req, res) => {
  try {
    if (req.user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    const { title, excerpt, content, imageUrl, category, status } = req.body;

    if (!title || !excerpt || !content || !imageUrl || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const words = content.replace(/<[^>]*>?/gm, "").split(/\s+/).length;
    const readTime = Math.ceil(words / 200) + " min read";
    const date = new Date().toISOString().split("T")[0];

    const newPost = new Post({
      title,
      excerpt,
      content,
      author: req.user.name || req.user.email.split("@")[0],
      date,
      readTime,
      imageUrl,
      category,
      status: status || "published",
      likes: [],
      views: 0,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// API: Update an existing post
app.put("/api/posts/:id", verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, imageUrl, category, status } = req.body;

    if (!title || !excerpt || !content || !imageUrl || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const words = content.replace(/<[^>]*>?/gm, "").split(/\s+/).length;
    const readTime = Math.ceil(words / 200) + " min read";

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, excerpt, content, imageUrl, category, status: status || "published", readTime },
      { new: true },
    );

    if (!updatedPost) return res.status(404).json({ error: "Post not found" });

    if (io)
      io.emit("post_updated", {
        id: updatedPost._id,
        likes: updatedPost.likes,
        views: updatedPost.views,
      });

    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// API: Delete a post
app.delete("/api/posts/:id", verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ error: "Post not found" });

    // If you have a 'post_deleted' event listener on frontend, emit it here
    if (io) io.emit("post_deleted", { id: req.params.id });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// API: Get paginated posts
app.get("/api/posts", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { category, search } = req.query;

    let query = { status: { $ne: "draft" } };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// API: Get ALL posts for Admin Dashboard (includes drafts)
app.get("/api/admin/posts", verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    let query = {};
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch admin posts" });
  }
});

// API: Get analytics for Admin Dashboard
app.get("/api/admin/analytics", verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const totalComments = await Comment.countDocuments();
    const posts = await Post.find({});
    
    let totalViews = 0;
    let totalLikes = 0;
    const categoryMap = {};

    posts.forEach((post) => {
      totalViews += post.views || 0;
      totalLikes += (post.likes && post.likes.length) || 0;
      
      const cat = post.category || "Uncategorized";
      if (!categoryMap[cat]) {
        categoryMap[cat] = { name: cat, views: 0, likes: 0 };
      }
      categoryMap[cat].views += post.views || 0;
      categoryMap[cat].likes += (post.likes && post.likes.length) || 0;
    });

    const categoryPerformance = Object.values(categoryMap);

    res.json({
      totalViews,
      totalLikes,
      totalComments,
      categoryPerformance
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// API: Get comments for a post
app.get("/api/comments/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: 1,
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// API: Add a comment (Requires Auth)
app.post("/api/comments", commentsLimiter, verifyAuth, async (req, res) => {
  try {
    const { postId, text, parentId } = req.body;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const newComment = new Comment({
      postId,
      parentId: parentId || null,
      user: req.user.name || req.user.email.split("@")[0], // fallback name
      userEmail: req.user.email,
      userAvatar: req.user.picture || null,
      text,
      date: new Date().toLocaleDateString(),
    });

    const savedComment = await newComment.save();

    // Broadcast via Socket.io
    io.emit(`new_comment_${postId}`, savedComment);

    res.status(201).json(savedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// API: Like a post (Requires Auth)
app.post("/api/posts/:id/like", verifyAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userEmail = req.user.email;
    const hasLiked = post.likes.includes(userEmail);

    if (hasLiked) {
      post.likes = post.likes.filter((email) => email !== userEmail);
    } else {
      post.likes.push(userEmail);
    }

    const updatedPost = await post.save();

    // Broadcast via Socket.io
    io.emit("post_updated", {
      id: updatedPost.id,
      likes: updatedPost.likes,
      views: updatedPost.views,
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to like post" });
  }
});

// API: Get related posts
app.get("/api/posts/:id/related", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const relatedPosts = await Post.find({
      category: post.category,
      _id: { $ne: post._id },
      status: { $ne: "draft" }
    })
      .sort({ views: -1 })
      .limit(3);

    res.json(relatedPosts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch related posts" });
  }
});

// API: View a post (Public)
app.post("/api/posts/:id/view", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    );
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Broadcast via Socket.io
    io.emit("post_updated", {
      id: post.id,
      likes: post.likes,
      views: post.views,
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to update views" });
  }
});

// API: Contact Form (Send Email)
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlEmail = `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">New Message Received</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">from DevPulse Contact Form</p>
          </div>
          
          <div style="padding: 35px 30px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #edf2f7; width: 80px;">
                  <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Name</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #edf2f7;">
                  <span style="color: #0f172a; font-size: 16px; font-weight: 500;">${name}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #edf2f7;">
                  <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #edf2f7;">
                  <a href="mailto:${email}" style="color: #6366f1; font-size: 16px; font-weight: 500; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #edf2f7;">
                  <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Subject</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #edf2f7;">
                  <span style="color: #0f172a; font-size: 16px; font-weight: 500;">${subject || "No Subject Provided"}</span>
                </td>
              </tr>
            </table>
            
            <div>
              <h3 style="color: #0f172a; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 15px 0;">Message Content</h3>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px;">
                <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #edf2f7;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">This is an automated message from the DevPulse website.</p>
            <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0 0;">Please do not reply directly to this email unless responding to the sender.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: "balathabo96@gmail.com",
      subject: subject || "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: htmlEmail,
    });

    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_post", (postId) => {
    socket.join(postId);
    const roomSize = io.sockets.adapter.rooms.get(postId)?.size || 0;
    io.to(postId).emit("active_readers", roomSize);
  });

  socket.on("leave_post", (postId) => {
    socket.leave(postId);
    const roomSize = io.sockets.adapter.rooms.get(postId)?.size || 0;
    io.to(postId).emit("active_readers", roomSize);
  });

  socket.on("disconnecting", () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        const currentSize = io.sockets.adapter.rooms.get(room)?.size || 1;
        io.to(room).emit("active_readers", currentSize - 1);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
