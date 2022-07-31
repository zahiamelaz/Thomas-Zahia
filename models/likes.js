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
        foreignKey: {
          name: '...'
        }
      })
      /*models.Likes.belongTo(models.Posts.Users, {
        foreignKey: {
        allowNull: false
        }
      })*/
      /*      })
      models.Likes.belongTo(models.Users.Posts, {
        foreignKey: {
        allowNull: false
        }
      })*/
      models.Likes.belongsTo(models.Posts, {
        foreignKey: {
          name: '...'
        }
      })
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