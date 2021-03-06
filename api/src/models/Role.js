const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const role = sequelize.define(
    "role",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "roles",
    }
  );
  return role;
};
