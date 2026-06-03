import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  user: { type: String, required: true },
  userEmail: { type: String, required: true },
  userAvatar: { type: String },
  text: { type: String, required: true },
  date: { type: String, required: true }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id; // Map for frontend
      delete ret._id;
      delete ret.__v;
    }
  }
});

export const Comment = mongoose.model("Comment", commentSchema);
