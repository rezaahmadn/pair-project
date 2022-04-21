'use strict';

const bcrypt = require('bcryptjs')

module.exports = {
  up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     const users = require('../users.json')

     users.forEach(el => {
       let salt = bcrypt.genSaltSync(10);
       let hash = bcrypt.hashSync(el.password, salt);
       el.password = hash
       el.createdAt = new Date()
       el.updatedAt = new Date()
     })

     return queryInterface.bulkInsert("Users", users, {})
  },

  down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Users', null, {})
  }
};
