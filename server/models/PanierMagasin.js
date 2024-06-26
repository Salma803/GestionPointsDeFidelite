module.exports = (sequelize, DataTypes) => {
    const PanierMagasin = sequelize.define("PanierMagasin", {
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

    PanierMagasin.associate = (models) => {
        PanierMagasin.belongsTo(models.Client, {
            foreignKey: 'id_client',
            onDelete: 'CASCADE',
        });
        PanierMagasin.belongsTo(models.Produit, {
            foreignKey: 'id_produit',
            onDelete: 'CASCADE',
        });
    };

    return PanierMagasin;
};
