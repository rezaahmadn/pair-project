'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    fullName(){
      return `${this.firstName} ${this.lastName}`
    }

    static search(options){
      return Profile.findAll(options)
    }

    static associate(models) {
      // define association here
      Profile.belongsTo(models.User)
    }
  }
  Profile.init({
    firstName: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"First name is required"
        },
        notEmpty:{
          msg:"First name is required"
        }
      }
    },
    lastName: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Last name is required"
        },
        notEmpty:{
          msg:"Last name is required"
        }
      }
    },
    age: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Age is required"
        },
        isNumeric: {
          msg:"Age is required"
        },
        min:{
          args:13,
          msg:"You must be 13+"
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};