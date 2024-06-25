module.exports = (sequelize, DataTypes) => {
    const PromotionProduit = sequelize.define("PromotionProduit", {
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

    
    PromotionProduit.associate = (models) => {
        PromotionProduit.belongsTo(models.Produit, {
            foreignKey: 'id_produit',
            onDelete: 'CASCADE'
        });
        
    };


    return PromotionProduit;
};
