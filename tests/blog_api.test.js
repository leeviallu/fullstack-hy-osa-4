// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

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

beforeEach(async () => {
    await Blog.deleteMany({});
    let blogObject = new Blog(initialBlogs[0]);
    await blogObject.save();
    blogObject = new Blog(initialBlogs[1]);
    await blogObject.save();
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

        expect(response.body).toHaveLength(initialBlogs.length);
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
    const blogsInDb = async () => {
        const blogs = await Blog.find({});
        return blogs.map((blog) => blog.toJSON());
    };

    test('succeeds with valid data', async () => {
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const blogsAtEnd = await blogsInDb();
        expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

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
        const blogsAtEnd = await blogsInDb();
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

        const blogsAtEnd = await blogsInDb();

        expect(blogsAtEnd).toHaveLength(initialBlogs.length);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});