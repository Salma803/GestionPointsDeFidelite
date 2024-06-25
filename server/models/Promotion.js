module.exports = (sequelize, DataTypes) => {
    const Promotion = sequelize.define("Promotion", {
        valeur: {
            type: DataTypes.INTEGER, 
            allowNull: false,
        },
        date_fin:{
            type: DataTypes.DATE, 
        },
        date_debut:{
            type: DataTypes.DATE,
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


        Promotion.associate = (models) => {
            
            Promotion.hasMany(models.Produit, {
                foreignKey: 'id_produit',
                onDelete: 'CASCADE'
            });
            Promotion.hasMany(models.Rayon, {
                foreignKey: 'id_rayon',
                onDelete: 'CASCADE'
            });
        };
    return Promotion;
};
