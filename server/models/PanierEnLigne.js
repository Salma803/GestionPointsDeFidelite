module.exports = (sequelize, DataTypes) => {
    const PanierEnLigne = sequelize.define("PanierEnLigne", {
        quantité: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1, // Ensure the quantity is at least 1
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    PanierEnLigne.associate = (models) => {
        PanierEnLigne.belongsTo(models.Client, {
            foreignKey: 'id_client',
            onDelete: 'CASCADE',
        });
        PanierEnLigne.belongsTo(models.Produit, {
            foreignKey: 'id_produit',
            onDelete: 'CASCADE',
        });
    };

    return PanierEnLigne;
};
