// Imports
const bcrypt = require('bcrypt')
const jwtUtils = require('../utils/jwt.utils')
const asyncLib = require('async')
const models = require('../models')


const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASWORD_REGEX = /^(?=.*\d).{4,18}$/

//Routes
module.exports = {
    register: (request, response) => {
        // Parameters
        let lastName = request.body.lastName;
        let firstName = request.body.firstName;
        let email = request.body.email;
        let password = request.body.password;

        // Fields verification
        
        if (lastName == null || firstName == null || email == null || password == null) {
            return response.status(400).json({'error': 'An error occured : Missing parameters'});
        }
        
        
        if (!EMAIL_REGEX.test(email)) {
            return response.status(400).json({'error': 'An error occured : email is not valid'})
        }
        
        if (!PASWORD_REGEX.test(password)) {
            return response.status(400).json({'error': 'An error occured : password invalid (must length 4 - 18 and include 1 number)'})
        }
        // Waterfall
        asyncLib.waterfall([
            (done) => {
                models.Users.findOne({
                    attributes: ['email'],
                    where: { email: email}
                })
                .then((userFound) => {
                    done(null, userFound);
                })
                .catch((err) => {
                    return response.status(400).json({'error': 'An error occured'});
                });
            },
            (userFound, done) => {
                if (!userFound) {
                    bcrypt.hash(password, 5, (err, bcryptedPassword) => { done(null, userFound, bcryptedPassword) })
                } else { 
                    response.status(409).json({'error': 'user already exist.'})
                }
            },
            (userFound, bcryptedPassword, done) => {
                let newUser = models.Users.create({
                    lastName: lastName,
                    firstName: firstName,
                    email: email,
                    password: bcryptedPassword
                })
                .then((newUser) => {
                    done(newUser);
                })
                .catch((err) => {
                    return response.status(500).json({'error': 'An error occurred : unable to verify user'})
                });
            }
        ],
        (newUser) => {
            if(newUser) {
                return response.status(201).json({
                    'userId': newUser.id, 'sucess': 'User successfully created'
                })
            } else {
                return res.status(400).json({ 'error': 'An error occurred : user already exist.'})
            }
        }
        ) 
        //
    },
    update: (request, response) => {
        const id = request.params.id;
        let lastName = request.body.lastName;
        let firstName = request.body.firstName;
        let email = request.body.email;
        let password = request.body.password;   
        
        asyncLib.waterfall([
            (done) => {
                models.Users.findOne({
                    attributes: [ 'id', 'email', 'firstName', 'lastName', 'password'],
                    where: { id: id}
                })
                .then((userFound) => {
                    done(null, userFound);
                })
                .catch((err) => {
                    return response.status(400).json({ 'error': 'Unable to verify user' });
                });
            },
            (userFound, done) => {
                if(userFound) {
                    userFound.update({
                        lastName: (lastName ? lastName : userFound.lastName),
                        firstName: (firstName ? firstName : userFound.firstName),
                        email: (email ? email : userFound.email),
                        password: (password ? password : userFound.password)
                    })

                    .then((userFound) => {
                        done(userFound);
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
            (userFound) => {
                if (userFound) {
                    response.status(200).json({'success': 'User successfuly modified'})
                } else {
                    response.status(400).json({ 'error': 'An error occurred' })
                } 
            }
        )           
    },
    searchOne: (request, response) => {
        // Parameters
        const id = request.params.id;   
        models.Users.findOne({
            attributes: [ 'id', 'email', 'firstName', 'lastName'],
            where: { id: id }
        })
        .then(data => {
            if (data) {
                response.status(200).send(data);
            } else {
            response.status(400).send({
                message: `An error occurred : cannot found user with id=${id}. Maybe user was not found!`
              });
            }
        })
        .catch(err => {
            response.status(400).send({
                message: `An error occurred : could not found user with id=${id}.`
            });
        });
    },
    searchAll: (request, response) => {
        // Parameters
        models.Users.findAll({
            attributes: [ 'id', 'email', 'firstName', 'lastName']
            })
        .then(data => {
            if (data) {
                response.status(200).send(data);
            }
        })
        .catch(err => {
            response.status(400).send({
                message: "An error occurred : while retrieving Users."
            });
        });
      },
      delete: (request, response) => {
        // Parameters
    const id = request.params.id;
    
    models.Users.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
            response.status(200).send({
                    message: "User successfully deleted"
                });
            } else {
                response.status(400).send({
                    message: `An error occurred : cannot delete user with id=${id}.`
                });
            }
        })
        .catch(err => {
            response.status(404).send({
                message: "User with id=" + id + " was not found"
            });
        });
    },
    login: (request, response) => {

        // Parameters
        let email = request.body.email;
        let password = request.body.password;

        if (email == null || password == null) {
            return response.status(400).json({'error': 'missing parameters'})
        }

        models.Users.findOne({
            where: { email: email}
        })
        .then((userFound) => {
            if (userFound) {
                bcrypt.compare(password, userFound.password, (errBycrypt, resBycrypt) => {
                    if (resBycrypt) {
                        return response.status(200).json({
                            'userId': userFound.id,
                            'token': jwtUtils.generateTokenForUser(userFound)
                        })
                    } else {
                        return response.status(403).json({'error': 'invalid password'})
                    }
                })
            } else {
                return response.status(404).json({'error': 'user not exist in DB'})
            }
        })
        .catch((err) => {
            return response.status(500).json({'error': 'unable to verify user'})
        })
    }
}
/*
// Imports
const bcrypt = require('bcrypt')
const jwtUtils = require('../utils/jwt.utils')
const asyncLib = require('async')
const models = require('../models')


const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASWORD_REGEX = /^(?=.*\d).{4,18}$/

//Routes
module.exports = {
    register: (request, response) => {
        // Parameters
        let lastName = request.body.lastName;
        let firstName = request.body.firstName;
        let email = request.body.email;
        let password = request.body.password;

        // Fields verification
        
        if (lastName == null || firstName == null || email == null || password == null) {
            return response.status(400).json({'error': 'An error occured : Missing parameters'});
        }
        
        if (!EMAIL_REGEX.test(email)) {
            return response.status(400).json({'error': 'An error occured : email is not valid'})
        }

        if (!PASWORD_REGEX.test(password)) {
            return response.status(400).json({'error': 'An error occured : password invalid (must length 4 - 18 and include 1 number)'})
        }

        // Waterfall
        asyncLib.waterfall([
            (done) => {
                models.Users.findOne({
                    attributes: ['email'],
                    where: { email: email}
                })
                .then((userFound) => {
                    done(null, userFound);
                })
                .catch((err) => {
                    return response.status(400).json({'error': 'An error occured'});
                });
            },
            (userFound, done) => {
                (!userFound) ? bcrypt.hash(password, 5, (err, bcryptedPassword) => { done(null, userFound, bcryptedPassword) }) : response.status(409).json({'error': 'user already exist.'})
            },
            (userFound, bcryptedPassword, done) => {
                let newUser = models.Users.create({
                    lastName: lastName,
                    firstName: firstName,
                    email: email,
                    password: bcryptedPassword
                })
                .then((newUser) => {
                    done(newUser);
                })
                .catch((err) => {
                    return response.status(500).json({'error': 'An error occurred : unable to verify user'})
                });
            }
        ],
        (newUser) => { newUser ? response.status(201).json({ 'userId': newUser.id, 'sucess': 'User successfully created' }) : res.status(400).json({ 'error': 'An error occurred : user already exist.'})}
        ) 
        //
    },
    update: (request, response) => {
        const id = request.params.id;
        let lastName = request.body.lastName;
        let firstName = request.body.firstName;
        let email = request.body.email;
        let password = request.body.password;   
        
        asyncLib.waterfall([
            (done) => {
                models.Users.findOne({
                    attributes: [ 'id', 'email', 'firstName', 'lastName', 'password'],
                    where: { id: id}
                })
                .then((userFound) => {
                    done(null, userFound);
                })
                .catch((err) => {
                    return response.status(400).json({ 'error': 'Unable to verify user' });
                });
            },
            (userFound, done) => { 
                (userFound) ? userFound.update({ lastName: (lastName ? lastName : userFound.lastName), firstName: (firstName ? firstName : userFound.firstName), email: (email ? email : userFound.email), password: (password ? password : userFound.password)}) .then((userFound) => { done(userFound); }) .catch((err) => { response.status(400).json({ 'error': 'An error occurred' })}) : response.status(404).json({ 'error': 'An error occurred' })
            },
        ],
            (userFound) => {
                (userFound) ? response.status(200).json({'success': 'User successfuly modified'}) : response.status(400).json({ 'error': 'An error occurred' })
            }
        )           
    },
    searchOne: (request, response) => {
        // Parameters
        const id = request.params.id;   
        models.Users.findOne({
            attributes: [ 'id', 'email', 'firstName', 'lastName'],
            where: { id: id }
            })
        .then(data => {
            data ? response.status(200).send(data) : response.status(400).send({ message: `An error occurred : cannot found user with id=${id}. Maybe user was not found!` })
        })
        .catch(err => {
            response.status(400).send({
                message: `An error occurred : could not found user with id=${id}.`
            });
        });
    },
    searchAll: (request, response) => {
        // Parameters
        models.Users.findAll({
            attributes: [ 'id', 'email', 'firstName', 'lastName']
            })
        .then(data => {
            if (data) {
                response.status(200).send(data);
            }
        })
        .catch(err => {
            response.status(400).send({
                message: "An error occurred : while retrieving Users."
            });
        });
      },
      delete: (request, response) => {
        // Parameters
    const id = request.params.id;
    
    models.Users.destroy({
        where: { id: id }
    })
        .then(num => {
            (num == 1) ? response.status(200).send({ message: "User successfully deleted" }) : response.status(400).send({ message: `An error occurred : cannot delete user with id=${id}.` });
        })
        .catch(err => {
            response.status(404).send({
                message: "User with id=" + id + " was not found"
            });
        });
    },
    login: (request, response) => {

        // Parameters
        let email = request.body.email;
        let password = request.body.password;

        if (email == null || password == null) {
            return response.status(400).json({'error': 'missing parameters'})
        }

        models.Users.findOne({
            where: { email: email}
        })
        .then((userFound) => {
            (userFound) ?bcrypt.compare(password, userFound.password, (errBycrypt, resBycrypt) => {(resBycrypt) ? response.status(200).json({'userId': userFound.id,'token': jwtUtils.generateTokenForUser(userFound)}) :response.status(403).json({'error': 'invalid password'})}) :response.status(404).json({'error': 'user not exist in DB'})
        })
        .catch((err) => {
            return response.status(500).json({'error': 'unable to verify user'})
        })
    }
}
*/