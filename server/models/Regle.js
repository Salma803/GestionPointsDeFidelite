module.exports = (sequelize, DataTypes) => {
    const Regle = sequelize.define("Regle", {
        multiplicite: {
            type: DataTypes.STRING, 
            allowNull: false,
        },
        date_debut: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        date_fin: {
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

    Regle.associate = (models) => {
            
        Regle.hasMany(models.Rayon, {
            foreignKey: 'id_regle',
            onDelete: 'CASCADE'
        });
    };

    return Regle;
};
