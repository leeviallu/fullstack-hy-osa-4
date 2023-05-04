/* eslint-disable no-underscore-dangle */
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
    const { body } = request;

    const user = await User.findById(body.userId);

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        user: user._id,
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
    const { body } = request;
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        id: body.id,
    });
    const updatedBlog = await Blog.findByIdAndUpdate(body.id, {
        title: blog.title, author: blog.author, url: blog.url, likes: blog.likes,
    }, { new: true });
    response.status(201).send(updatedBlog);
});

module.exports = blogsRouter;
