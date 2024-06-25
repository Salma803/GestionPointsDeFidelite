module.exports = (sequelize, DataTypes) => {
    const Reclamation = sequelize.define("Reclamation", {
        contenu: {
            type: DataTypes.STRING, // Assuming content is a string, not DATE
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

    Reclamation.associate = (models) => {
        Reclamation.belongsTo(models.Client, {
            foreignKey: 'id_client',
            onDelete: 'CASCADE'
        });
    };

    return Reclamation;
};
