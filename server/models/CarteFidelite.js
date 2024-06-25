module.exports = (sequelize, DataTypes) => {
    const CarteFidelite = sequelize.define("CarteFidelite", {
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

    CarteFidelite.associate = (models) => {
        CarteFidelite.belongsTo(models.Client, {
            foreignKey: 'id_client',
            onDelete: 'CASCADE'
        });
    };

    return CarteFidelite;
};
