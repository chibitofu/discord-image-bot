'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
      name: 'Nya',
      currentImage: 'dasfasfas',
      history: ['test', 'test2', 'test3'],
      discordID: 19769139420258304,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Perseus',
      currentImage: 'fewsresrw',
      history: ['test', 'test2', 'test3'],
      discordID: 60702139420258304,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Menae',
      currentImage: 'hkdjharw',
      history: ['test', 'test2', 'test3'],
      discordID: 50700919420258304,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
