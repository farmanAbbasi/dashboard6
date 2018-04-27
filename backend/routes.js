module.exports = app => {
    // users route
    app.use('/api/users', require('./app/users/user.route.js'));
    // post route
    app.use('/api/posts', require('./app/posts/post.route.js'));
    // logout route
    app.use('/api/logout', require('./app/logout/logout.route.js'));
    //ads route
    app.use('/api/ads', require('./app/ads/ads.route.js'));
    //question responses route
    app.use('/api/question', require('./app/question/question.route.js'));
    //poll route
    app.use('/api/poll', require('./app/poll/poll.route.js'));
    //likes route
    app.use('/api/like', require('./app/like/like.route.js'));
    //search route
    app.use('/api/search', require('./app/search/search.route.js'));
    //comments route
    app.use('/api/comments', require('./app/comments/comments.route.js'));
    //tags route
    app.use('/api/tags', require('./app/tags/tags.route.js'));
    // notifications route
    app.use('/api/notifications', require('./app/notifications/notifications.route.js'));
};
