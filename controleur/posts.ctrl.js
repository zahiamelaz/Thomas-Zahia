const asyncLib = require('async')
const models = require('../models')

module.exports = {
    create: (request, response) => {
        // Parameters
        let idUsers = request.body.idUsers
        let content = request.body.content;
        let attachments= request.body.attachments;

        
        // Fields verification
        if (content == null) {
            return response.status(400).json({'error': 'An error occured : Missing parameters'});
        }
        
        // Waterfall
        asyncLib.waterfall([
            (done) => {
                let newPost = models.Posts.create({
                    attachments: attachments,
                    Users_idUsers: idUsers,
                    content: content
                })
                .then((newPost) => {
                    done(newPost);
                })
                .catch((err) => {
console.log(err, idUsers)
                    return response.status(500).json({'error': 'An error occurred : unable to create posts'})
                });
            }
        ],
        (newPost) => {
            if(newPost) {
                return response.status(201).json({
                    'postId': newPost.id, sucess: 'Post successfully created'
                })
            } 
        })
    },
    update: (request, response) => {
        let id = request.params.id;
        let content = request.body.content;
        let attachments = request.body.attachments;
 
        asyncLib.waterfall([
            (done) => {
                models.Posts.findOne({
                    attributes: [ 'id', 'content', 'attachments'],
                    where: { id: id }
                })
                .then((postFound) => {
                    done(null, postFound);
                })
                .catch((err) => {
console.log(err)
                    return response.status(400).json({ 'error': 'Unable to verify Post' });
                });
            },
            (postFound, done) => {
                if(postFound) {
                  postFound.update({
                      content: (content ? content : postFound.content),
                      attachments: (attachments ? attachments : postFound.attachments)
                  })

                  .then((postFound) => {
                      done(postFound);
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
            (postFound) => {
                if (postFound) {
                    response.status(200).json({'success': 'Post successfuly modified'})
                } else {
                    response.status(400).json({ 'error': 'An error occurred' })
                } 
            }
        )           
    },
}