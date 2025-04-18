module.exports = (sequelize, DataTypes) => {
    const Detail= sequelize.define("Detail", {
        quantite: {
            type: DataTypes.STRING, 
        },
        point:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        total:{
            type: DataTypes.FLOAT,
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
