const asyncLib = require('async')
const models = require('../models')

module.exports = {
    create: (request, response) => {
        // Parameters
        let content = request.body.content;
        let idUsers = request.body.idUsers;
        let idPosts = request.body.idPosts;

        // Fields verification
        if (content == null) {
            return response.status(400).json({'error': 'An error occured : Missing parameters'});
        }
        
        // Waterfall
        asyncLib.waterfall([
            (done) => {
                let newComment = models.Comments.create({
                    content: content,
                    Users_idUsers: idUsers,
                    Posts_idPosts: idPosts
                })
                .then((newComment) => {
                    done(newComment);
                })
                .catch((err) => {
                    return response.status(500).json({'error': 'An error occurred : unable to create comment'})
                });
            }
        ],  
        (newComment) => {
            if(newComment) {
                return response.status(201).json({
                    'commentId': newComment.id, sucess: 'Comment successfully created'
                })
            } 
        }) 
        //
    },
    update: (request, response) => {
        let id = request.params.id;
        let content = request.body.content;
 
        asyncLib.waterfall([
            (done) => {
                models.Comments.findOne({
                    attributes: [ 'id', 'content'],
                    where: { id: id }
                })
                .then((commentFound) => {
                    done(null, commentFound);
                })
                .catch((err) => {
console.log(err)
                    return response.status(400).json({ 'error': 'Unable to verify Comment' });
                });
            },
            (commentFound, done) => {
                if(commentFound) {
                    commentFound.update({
                        content: (content ? content : commentFound.content)
                    })

                    .then((commentFound) => {
                        done(commentFound);
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
            (commentFound) => {
                if (commentFound) {
console.log(commentFound)
                    response.status(200).json({'success': 'Comment successfuly modified'})
                } else {
                    response.status(400).json({ 'error': 'An error occurred' })
                } 
            }
        )           
    },
}