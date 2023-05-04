/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});
    let blogObject = new Blog(helper.initialBlogs[0]);
    await blogObject.save();
    blogObject = new Blog(helper.initialBlogs[1]);
    await blogObject.save();

    await User.deleteMany({});
    let userObject = new User(helper.initialUsers[0]);
    await userObject.save();
    userObject = new User(helper.initialUsers[1]);
    await userObject.save();
});

describe('when there is initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs');

        expect(response.body).toHaveLength(helper.initialBlogs.length);
    });

    test('id field of a blog is properly defined', async () => {
        const response = await api.get('/api/blogs');
        expect(response.body[0].id).toBeDefined();
    });
});

describe('addition of a new blog', () => {
    const newBlog = {
        title: 'Joelin blogi',
        author: 'Joel Karhu',
        url: 'www.joel-blog.fi',
    };
    test('succeeds with valid data', async () => {
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

        const contents = blogsAtEnd.map((blog) => blog.title);
        expect(contents).toContain(
            'Joelin blogi',
        );
    });

    test('blog without likes field gets initial value of 0 for likes', async () => {
        if (newBlog.likes === undefined) {
            newBlog.likes = 0;
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        const blogsAtEnd = await helper.blogsInDb();
        const likeList = blogsAtEnd.map((blog) => blog.likes);
        expect(likeList).toHaveLength(blogsAtEnd.length);
    });

    test('fails with status code 400 if data is invalid', async () => {
        const addBlog = {
            title: 'failblog',
        };

        await api
            .post('/api/blogs')
            .send(addBlog)
            .expect(400);

        const blogsAtEnd = await helper.blogsInDb();

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    });
});
describe('removal of a blog', () => {
    test('succeeds with status code 204', async () => {
        const blogs = await helper.blogsInDb();
        const blogToRemove = blogs[0];
        await api
            .delete(`/api/blogs/${blogToRemove.id}`)
            .expect(204);

        const blogsAtEnd = await helper.blogsInDb();

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
    });
});

describe('update of a blog', () => {
    test('succeeds with status code 201', async () => {
        const blogs = await helper.blogsInDb();
        const blogToUpdate = blogs[0];
        blogToUpdate.likes += 1;
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(201);
        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd[0].likes).toStrictEqual(helper.initialBlogs[0].likes + 1);
    });
});

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({ username: 'root', passwordHash });

        await user.save();
    });

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'leeviallu',
            name: 'Leevi Leppänen',
            password: 'ananasalas',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map((user) => user.username);
        expect(usernames).toContain(newUser.username);
    });
    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'root',
            name: 'MainUser',
            password: 'ananasalas123',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('expected `username` to be unique');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
});

describe('addition of a user', () => {
    test('fails if username or password is invalid', async () => {
        const addUser = {
            username: 'fa',
            name: 'fail',
            password: 'il',
        };
        await api
            .post('/api/users')
            .send(addUser)
            .expect(400);

        const usersAtEnd = await helper.usersInDb();
        console.log(usersAtEnd);
        expect(usersAtEnd).toHaveLength(helper.initialUsers.length);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
