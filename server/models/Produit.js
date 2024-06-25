module.exports = (sequelize, DataTypes) => {
    const Produit = sequelize.define("Produit", {
        nom: {
            type: DataTypes.STRING, 
        },
        description:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        ean1:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        ean2:{
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

    Produit.associate = (models) => {
        Produit.belongsTo(models.Rayon, {
            foreignKey: 'id_rayon',
            onDelete: 'CASCADE'
        });
        Produit.belongsTo(models.Promotion, {
            foreignKey: 'id_promotion',
            onDelete: 'CASCADE'
        });
        Produit.hasMany(models.Detail, {
            foreignKey: 'id_produit',
            onDelete: 'CASCADE'
        });
    };

    return Produit;
};
