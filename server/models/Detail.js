module.exports = (sequelize, DataTypes) => {
    const Detail= sequelize.define("Detail", {
        quantite: {
            type: DataTypes.STRING, 
        },
        point:{
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

    Detail.associate = (models) => {
        Detail.belongsTo(models.Achat, {
            foreignKey: 'id_achat',
            onDelete: 'CASCADE'
        });
        Detail.belongsTo(models.Produit, {
            foreignKey: 'id_produit',
            onDelete: 'CASCADE'
        });
        
    };

    return Detail;
};
