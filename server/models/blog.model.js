const mongoose = require("mongoose");

const Blog = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        cloudinaryId: {
            type: String,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        author_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        created_at: {
            type: Date,
            required: true,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [{
            name: {
                type: String,
            },
            comment: {
                type: String,
            },
            date: {
                type: Date,
            },
        }],
    },
    { collection: "blog-data" }
);

const model = mongoose.model("BlogData", Blog);

module.exports = model;