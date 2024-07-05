const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const ChequeCadeau = sequelize.define("ChequeCadeau", {
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        statut: {
            type: DataTypes.STRING,
            defaultValue:'Valide',
        },
        date_expiration: {
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

    // Generate a unique code before creating a ChequeCadeau
    ChequeCadeau.beforeCreate(async (cheque) => {
        cheque.code = generateUniqueCode();
    });
    
    return ChequeCadeau;
};

// Function to generate a unique code
