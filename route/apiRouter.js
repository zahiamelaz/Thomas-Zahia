const express = require('express')
const usersCtrl = require('../controleur/usersCtrl')
const postsCtrl = require('../controleur/posts.ctrl')
const commentsCtrl = require('../controleur/comments.ctrl')
//const likesCtrl = require('../controleur/likes.ctrl')


// Router
exports.router = (() => {
    const apiRouter = express.Router();
    // Users routes
    apiRouter.route('/users/register/').post(usersCtrl.register)
    apiRouter.route('/users/login/').post(usersCtrl.login)
    apiRouter.route('/user/:id/').put(usersCtrl.update)
    apiRouter.route('/user/:id/').delete(usersCtrl.delete)
    apiRouter.route('/user/:id/').get(usersCtrl.searchOne)
    apiRouter.route('/users/').get(usersCtrl.searchAll)

    // Posts routes
    apiRouter.route('/posts/create/').post(postsCtrl.create)
    apiRouter.route('/post/:id/').put(postsCtrl.update)
    //apiRouter.route('/post/:id/').delete(postsCtrl.delete)
    apiRouter.route('/post/:id/').get(postsCtrl.searchOne)
    apiRouter.route('/posts/').get(postsCtrl.searchAll)

    // Comments routes
    apiRouter.route('/comments/create/').post(commentsCtrl.create)
    apiRouter.route('/comment/:id/').put(commentsCtrl.update)
    //apiRouter.route('/comment/:id/').delete(commentsCtrl.delete)
    apiRouter.route('/comment/:id/').get(commentsCtrl.searchOne)
    apiRouter.route('/comments/').get(commentsCtrl.searchAll)

    // Likes routes
    //apiRouter.route('/likes/create/').post(likesCtrl.create)
    //apiRouter.route('/like/:id/').delete(likesCtrl.delete)
    //apiRouter.route('/like/:id/').get(likesCtrl.searchOne)
    //apiRouter.route('/likes/').get(likesCtrl.searchAll)

    // Admin routes


    return apiRouter;
})();