module.exports = (sequelize, DataTypes) => {
    const Achat = sequelize.define("Achat", {
        point: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reste:{
            type: DataTypes.FLOAT,
            
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
            allowNull: false,
        });
    
    Achat.belongsTo(models.Magasin, {
        foreignKey: {
            name: 'id_magasin',
            defaultValue: 1, //Valeur par défaur à 0 pour indiquer les achats en ligne
             
        },
        onDelete: 'SET NULL',
    });
        };

    return Achat;
};
