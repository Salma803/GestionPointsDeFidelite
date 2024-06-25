module.exports = (sequelize, DataTypes) => {
    const PromotionRayon = sequelize.define("PromotionRayon", {
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

    
    PromotionRayon.associate = (models) => {
        PromotionRayon.belongsTo(models.Rayon, {
            foreignKey: 'id_rayon',
            onDelete: 'CASCADE'
        });
        
    };


    return PromotionRayon;
};
