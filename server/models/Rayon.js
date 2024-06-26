module.exports = (sequelize, DataTypes) => {
    const Rayon = sequelize.define("Rayon", {
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    });

    return Rayon;
};
