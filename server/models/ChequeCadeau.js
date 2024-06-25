module.exports = (sequelize, DataTypes) => {
    const ChequeCadeau = sequelize.define("ChequeCadeau", {
        statut: {
            type: DataTypes.STRING, 
        },
        date_expiration:{
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

    ChequeCadeau.associate = (models) => {
        ChequeCadeau.belongsTo(models.Client, {
            foreignKey: 'id_client',
            onDelete: 'CASCADE'
        });
    };

    return ChequeCadeau;
};
