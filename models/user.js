'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post)
      User.hasOne(models.Profile)
    }
  }
  User.init({
    email: {
      type:DataTypes.STRING,
      unique: true,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Email is required"
        },
        notEmpty:{
          msg:"Email is required"
        },
        isEmail:{
          msg:"Must be a valid email"
        }
      }
    },
    password: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Password is required"
        },
        notEmpty:{
          msg:"Password is required"
        }
      }
    },
    role: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Role is required"
        },
        notEmpty:{
          msg:"Role is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks:{
      beforeCreate(instance, options){
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(instance.password, salt);

        instance.password = hash
      }
    }
  });
  return User;
};