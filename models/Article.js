const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },

    // Basic meta
    author: {
      type: String, // ya ObjectId ref: "User" agar admin users ka model hai
      default: "Staff",
    },
    category: {
      type: String, // "politics", "sports", etc.
      index: true,
    },
    tags: [
      {
        type: String,
        index: true,
      },
    ],

    coverImage: {
      type: String, // image URL
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    // dates
    publishedAt: {
      type: Date,
      index: true,
    },

    // for trending
    viewCount: {
      type: Number,
      default: 0,
      index: true,
    },

    // basic SEO
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", ArticleSchema);
