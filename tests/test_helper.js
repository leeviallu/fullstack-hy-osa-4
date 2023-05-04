const User = require('../models/user');
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

const initialUsers = [
    {
        username: 'leeviallu',
        name: 'Leevi Leppänen',
        password: 'salainensana',
    },
    {
        username: 'normaluser',
        name: 'Nor Maali',
        password: 'normaalisalasana',
    },
];

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
    const users = await User.find({});
    return users.map((user) => user.toJSON());
};

module.exports = {
    initialBlogs, initialUsers, blogsInDb, usersInDb,
};
