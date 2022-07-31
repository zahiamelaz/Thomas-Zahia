const asyncLib = require('async')
const models = require('../models')
const LIKED    = 1;
const DISLIKED = 0;
// Routes
 module.exports = {
    create: function(req, res) {
      // Getting auth header
     
      // Params
      var postId = parseInt(req.params.Posts_idPosts);
  
      if (postId <= 0) {
        return res.status(400).json({ 'error': 'invalid parameters' });
      }
  
      asyncLib.waterfall([
        (done)=> {
          models.Posts.findOne({
            where: { id: postId }
          })
          .then(function(postFound) {
            done(null, postFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify post' });
          });
        },
        function(postFound, done) {
          if(postFound) {
            models.Users.findOne({
              where: { id: userId }
            })
            .then(function(userFound) {
              done(null, postFound, userFound);
            })
            .catch(function(err) {
              return res.status(500).json({ 'error': 'unable to verify user' });
            });
          } else {
            res.status(404).json({ 'error': 'post already liked' });
          }
        },
        function(postFound, userFound, done) {
          if(userFound) {
            models.Like.findOne({
              where: {
                Users_idUsers: userId,
                Posts_idPosts: postId
              }
            })
            .then(function(userAlreadyLikedFound) {
              done(null, postFound, userFound, userAlreadyLikedFound);
            })
            .catch(function(err) {
              return res.status(500).json({ 'error': 'unable to verify is user already liked' });
            });
          } else {
            res.status(404).json({ 'error': 'user not exist' });
          }
        },
        function(postFound, userFound, userAlreadyLikedFound, done) {
          if(!userAlreadyLikedFound) {
            postFound.addUser(userFound, { isLike: LIKED })
            .then(function (alreadyLikeFound) {
              done(null, postFound, userFound);
            })
            .catch(function(err) {
              return res.status(500).json({ 'error': 'unable to set user reaction' });
            });
          } else {
            if (userAlreadyLikedFound.isLike === DISLIKED) {
              userAlreadyLikedFound.update({
                isLike: LIKED,
              }).then(function() {
                done(null, postFound, userFound);
              }).catch(function(err) {
                res.status(500).json({ 'error': 'cannot update user reaction' });
              });
            } else {
              res.status(409).json({ 'error': 'message already liked' });
            }
          }
        },
        function(postFound, userFound, done) {
          postFound.update({
            likes: postFound.likes + 1,
          }).then(function() {
            done(postFound);
          }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot update post like counter' });
          });
        },
      ], function(postFound) {
        if (postFound) {
          return res.status(201).json(postFound);
        } else {
          return res.status(500).json({ 'error': 'cannot update post' });
        }
      });
    },
    //UPDATE
    //DELETTE
    //GETALLLIKE
}
 
/*
module.exports = {
  create: (request, response) => {
      // Parameters
      let like = request.body.like;
      let idUsers = request.body.Users_idUsers;
      let idPosts = request.body.Posts_idPosts;

      // Fields verification
      if (like == null) {
          return response.status(400).json({'error': 'An error occured : Missing parameters'});
      }
      
      // Waterfall
      asyncLib.waterfall([
          (done) => {
              let newlike = models.like.create({
                  like: like,
                  Users_idUsers: idUsers,
                  Posts_idPosts: idPosts
              })
              .then((newlike) => {
                  done(newlike);
              })
              .catch((err) => {
                  return response.status(500).json({'error': 'An error occurred : unable to create like'})
              });
          }
      ],  
      (newlike) => {
          if(newlike) {
              return response.status(201).json({
                  'likeId': newlike.id, sucess: 'like successfully created'
              })
          } 
      }) 
      //
  },
  update: (request, response) => {
      let id = request.params.id;
      let like = request.body.like;

      asyncLib.waterfall([
          (done) => {
              models.Likes.findOne({
                  attributes: [ 'id', 'like'],
                  where: { id: id }
              })
              .then((likeFound) => {
                  done(null, likeFound);
              })
              .catch((err) => {
console.log(err)
                  return response.status(400).json({ 'error': 'Unable to verify like' });
              });
          },
          (likeFound, done) => {
              if(likeFound) {
                likeFound.update({
                      like: (like ? like : likeFound.like)
                  })

                  .then((likeFound) => {
                      done(likeFound);
                  })
                  .catch((err) => {
console.log(err)
                      response.status(400).json({ 'error': 'An error occurred' });
                  });
              }
              else {
                response.status(404).json({ 'error': 'An error occurred' });
              }
          },
      ],
          (likeFound) => {
              if (likeFound) {
console.log(likeFound)
                  response.status(200).json({'success': 'Comment successfuly modified'})
              } else {
                  response.status(400).json({ 'error': 'An error occurred' })
              } 
          }
      )           
  },
}*/