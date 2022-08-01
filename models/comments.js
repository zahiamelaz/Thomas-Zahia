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
      models.Users.belongsToMany(models.Posts, {
        through: models.Comments,
        foreignKey: 'Userid',
        otherKey: 'Pstid',
      });
  
      models.Posts.belongsToMany(models.Users, {
        through: models.Comments,
        foreignKey: 'Postid',
        otherKey: 'Userid',
      });
  
      models.Comments.belongsTo(models.Users, {
        foreignKey: 'Userid',
        as: 'Users',
      });
  
      models.Comments.belongsTo(models.Posts, {
        foreignKey: 'Postid',
        as: 'Posts',
      });
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