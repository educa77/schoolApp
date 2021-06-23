module.exports = (sequelize, DataTypes) =>
    sequelize.define("lessons", {
        link: {
            type: DataTypes.STRING,
        },
        contentId: {
            type: DataTypes.INTEGER,
        },
    });
