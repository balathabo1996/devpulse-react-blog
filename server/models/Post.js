import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
  readTime: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ["draft", "published"], default: "published" },
  likes: [{ type: String }],
  views: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id; // Add 'id' field matching frontend expectations
      delete ret._id;
      delete ret.__v;
    }
  }
});

export const Post = mongoose.model("Post", postSchema);
