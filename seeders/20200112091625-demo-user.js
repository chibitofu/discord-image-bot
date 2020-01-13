'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
      name: 'Nya',
      currentImage: 'dasfasfas.com',
      history: "{\"Ramona\":{\"link\":\"https://i.imgur.com/example.png\",\"count\":0},\"Aqua\":{\"link\":\"https://i.imgur.com/example.jpg\",\"count\":0},\"Mikasa Ackerman\":{\"link\":\"https://i.imgur.com/example.jpg\",\"count\":0}}",
      discordID: 19769139420258304,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Perseus',
      currentImage: 'fewsresrw.com',
      history: "{\"Ramona\":{\"link\":\"https://i.imgur.com/example.png\",\"count\":0},\"Aqua\":{\"link\":\"https://i.imgur.com/example.jpg\",\"count\":0},\"Mikasa Ackerman\":{\"link\":\"https://i.imgur.com/example.jpg\",\"count\":0}}",
      discordID: 60702139420258304,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Menae',
      currentImage: 'hkdjharw.com',
      history: "{\"Ramona\":{\"link\":\"https://i.imgur.com/example.png\",\"count\":0},\"Aqua\":{\"link\":\"https://i.imgur.com/example.jpg\",\"count\":0},\"Mikasa Ackerman\":{\"link\":\"https://i.imgur.com/example.jpg\",\"count\":0}}",
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
