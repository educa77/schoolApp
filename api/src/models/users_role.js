const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User_role = sequelize.define(
    "users_role",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      roleId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "users_role",
    }
  );
  return User_role;
};
