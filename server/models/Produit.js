module.exports = (sequelize, DataTypes) => {
    const Produit = sequelize.define("Produit", {
        nom: {
            type: DataTypes.STRING, 
        },
        description:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        ean1:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        ean2:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        prix:{
            type:DataTypes.FLOAT,
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
        
    };

    return Produit;
};
