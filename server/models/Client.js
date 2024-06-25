module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define("Client", {
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        adresse: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mot_de_passe: {
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

    Client.associate = (models) => {
        Client.hasMany(models.Reclamation, {
            foreignKey: 'id_client',
            onDelete: 'CASCADE'
        });
        Client.hasMany(models.ChequeCadeau, {
            foreignKey: 'id_client',
            onDelete: 'CASCADE'
        });
        Client.hasOne(models.CarteFidelite, {
            foreignKey: 'id_client',
            onDelete: 'CASCADE'
        });
        Client.hasOne(models.Achat, {
            foreignKey: 'id_client',
            onDelete: 'CASCADE'
        });
    };

    return Client;
};
