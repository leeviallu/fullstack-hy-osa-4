const Blog = require('../models/blog');

const initialBlogs = [
    {
        title: 'Hyvä blogi',
        author: 'Leevi Leppänen',
        url: 'www.hyva-blogi.fi',
        likes: 12,
    },
    {
        title: 'Blogi 2',
        author: 'Jarppa Kanerva',
        url: 'www.blogi2.fi',
        likes: 3,
    },
];

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
};

module.exports = {
    initialBlogs, blogsInDb,
};
