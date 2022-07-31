'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comments.belongsTo(models.Users, {
        foreignKey: {
          name: 'Users_idUsers'
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
      models.Comments.belongsTo(models.Posts, {
        foreignKey: {
          name: 'Posts_idPosts'
        }
      })
    }
  }
  Comments.init({
    idPosts: DataTypes.INTEGER,
    idUsers: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};