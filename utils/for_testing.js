// Load the full build.
// eslint-disable-next-line import/no-extraneous-dependencies
const _ = require('lodash');

const dummy = () => 1;

// eslint-disable-next-line consistent-return
const totalLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0;
    } if (blogs.length === 1) {
        return blogs.likes;
    } if (blogs.length > 1) {
        const initialValue = 0;
        const sum = blogs.reduce(
            (accumulator, currentValue) => accumulator + currentValue.likes,
            initialValue,
        );
        return sum;
    }
};

const favoriteBlog = (blogs) => {
    const highestLikes = blogs.reduce((max, blog) => (max.likes > blog.likes ? max : blog));
    return highestLikes;
};

const mostBlogs = (blogList) => {
    const blogCounter = _(blogList)
        .countBy('author')
        .map((blogs, author) => ({ blogs, author }))
        .reverse()
        .value();
    const most = blogCounter[0];
    return most;
};

const mostLikes = (blogList) => {
    const getTotalLikes = (arr) => Object.values(
        arr.reduce((acc, { author, likes }) => {
            acc[author] = author in acc
                ? { author, totalLikes: acc[author].totalLikes + likes }
                : { author, totalLikes: likes };
            return acc;
        }, {}),
    );
    const authorsWithLikes = getTotalLikes(blogList);
    // eslint-disable-next-line max-len
    const authorWithMostLikes = authorsWithLikes.reduce((prev, current) => ((prev.totalLikes > current.totalLikes) ? prev : current));
    return authorWithMostLikes;
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
};
