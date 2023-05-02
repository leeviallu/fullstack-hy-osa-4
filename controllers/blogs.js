const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
    const { body } = request;

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
    });
    const savedBlog = await blog.save();
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
