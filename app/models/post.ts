import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
})

const Post = mongoose.models.Post || mongoose.model('Post', postSchema)


export { Post }