'use strict';
const {
  Model
} = require('sequelize');

const Filter = require('bad-words')

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User)
    }
  }
  Post.init({
    content: {
      type:DataTypes.TEXT,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Content is required"
        },
        notEmpty:{
          msg:"Content is required"
        }
      }
    },
    votes: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
    hooks:{
      beforeCreate(instance, options){
        const filter = new Filter();
        instance.votes = 0
        instance.content = filter.clean(instance.content)
      }
    }
  });
  return Post;
};