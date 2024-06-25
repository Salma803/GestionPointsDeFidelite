module.exports = (sequelize, DataTypes) => {
    const Achat = sequelize.define("Achat", {
        point: {
            type: DataTypes.INTEGER, 
        },
        reste:{
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

    Achat.associate = (models) => {
        Achat.belongsTo(models.Client, {
            foreignKey: 'id_client',
            onDelete: 'CASCADE',
        });
    
    Achat.belongsTo(models.Magasin, {
                foreignKey: 'id_magasin',
                onDelete: 'SET NULL',
            });
        };

    return Achat;
};
