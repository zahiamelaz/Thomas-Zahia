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
                    response.status(200).json({'success': 'Comment successfuly modified'})
                } else {
                    response.status(400).json({ 'error': 'An error occurred' })
                } 
            }
        )           
    },
    searchOne: (request, response) => {
        // Parameters
        const id = request.params.id;   
        models.Comments.findOne({
            attributes: [ 'id', 'content'],
            where: { id: id }
        })
        .then(data => {
            if (data) {
                response.status(200).send(data);
            } else {
            response.status(400).send({
                message: `An error occurred : cannot found comment with id=${id}. Maybe comment was not found!`
              });
            }
        })
        .catch(err => {
            response.status(400).send({
                message: `An error occurred : could not found comment with id=${id}.`
            });
        });
    },
    searchAll: (request, response) => {
        // Parameters
        models.Comments.findAll({
            attributes: [ 'id', 'content']
            })
        .then(data => {
            if (data) {
                response.status(200).send(data);
            }
        })
        .catch(err => {
            response.status(400).send({
                message: "An error occurred : while retrieving comment."
            });
        });
      },
    // Have to verify identity with ? Token ?

    delete: (request, response) => {
        // Parameters
    const id = request.params.id;
    
    models.Comments.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
            response.status(200).send({
                message: "comment successfully deleted"
                });
            } else {
                response.status(400).send({
                message: `An error occurred : cannot delete comment with id=${id}.`
                });
            }
        })
        .catch(err => {
            response.status(404).send({
                message: "Comment with id=" + id + " was not found"
            });
        });
    }
}