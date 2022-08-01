'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Likes.belongsTo(models.Users, {
        foreignKey: 'Userid',
        as: 'Users',
      });
  
      models.Users.belongsToMany(models.Posts, {
        through: models.Likes,
        foreignKey: 'Userid',
        otherKey: 'Postid',
      });
  
      models.Posts.belongsToMany(models.Users, {
        through: models.Likes,
        foreignKey: 'Postid',
        otherKey: 'Userid',
      });
      models.Likes.belongsTo(models.Posts, {
        foreignKey: 'Postid',
        as: 'Posts',
      });
    }
  }
  Likes.init({
    idPosts: DataTypes.INTEGER,
    idUsers: DataTypes.INTEGER,
    like: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Likes',
  });
  return Likes;
};