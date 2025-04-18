module.exports = (sequelize, DataTypes) => {
    const CarteFidelite = sequelize.define("CarteFidelite", {
        point: {
            type: DataTypes.INTEGER,
            defaultValue:0,
        },
        reste:{
            type: DataTypes.FLOAT,
            defaultValue:0,
           
            
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
