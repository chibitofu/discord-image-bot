'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    name: DataTypes.STRING,
    currentImage: DataTypes.STRING,
    history: DataTypes.ARRAY(DataTypes.STRING),
    discordID: DataTypes.BIGINT
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};