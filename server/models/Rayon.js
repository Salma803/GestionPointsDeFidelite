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
    Rayon.associate = (models) => {
        Rayon.hasMany(models.PromotionRayon, { foreignKey: 'id_rayon' });

    };

    return Rayon;
};
