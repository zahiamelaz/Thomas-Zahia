'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Posts.belongsTo(models.Users, {
        foreignKey: {
          name: 'Users_idUsers'
        }
      })
      
      models.Posts.hasMany(models.Likes);
      models.Posts.hasMany(models.Comments);
    }
  }
  Posts.init({
    idUsers: DataTypes.INTEGER,
    content: DataTypes.STRING,
    attachments: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};