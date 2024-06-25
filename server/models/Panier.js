module.exports = (sequelize, DataTypes) => {
    const Panier = sequelize.define("Panier", {
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

    Panier.associate = (models) => {
        Panier.belongsTo(models.Client, {
            foreignKey: 'id_client',
            onDelete: 'CASCADE',
        });
        Panier.belongsTo(models.Produit, {
            foreignKey: 'id_produit',
            onDelete: 'CASCADE',
        });
    };

    return Panier;
};
