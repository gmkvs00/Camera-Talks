const mongoose = require('mongoose');
const slugify = require('slugify');

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    content: {
        type: String,
        required: true,
    },

    excerpt: {
        type: String,
        trim: true,
    },

    category: {
        type: String,
        trim: true,
    },

    tags: [
        {
            type: String,
            trim: true,
        },
    ],

    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
    },

    featuredImage: {
        type: String, // store URL or file path
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    publishedAt: {
        type: Date,
    },

    metaTitle: {
        type: String,
        trim: true,
    },

    metaDescription: {
        type: String,
        trim: true,
    },
},{ timestamps: true, });

newsSchema.pre('validate', function (next) {
    if (!this.slug && this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('News', newsSchema);
