module.exports = (sequelize, DataTypes) => {
    const Rayon = sequelize.define("Rayon", {
        nom: {
            type: DataTypes.STRING, 
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
        Rayon.belongsTo(models.Regle, {
            foreignKey: 'id_regle',
            onDelete: 'CASCADE'
        });
        Rayon.belongsTo(models.Promotion, {
            foreignKey: 'id_promotion',
            onDelete: 'CASCADE'
        });
    };
        

    return Rayon;
};
