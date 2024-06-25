module.exports = (sequelize, DataTypes) => {
    const Magasin = sequelize.define("Magasin", {
        nom: {
            type: DataTypes.STRING, 
            allowNull: false,
        },
        adresse:{
            type: DataTypes.STRING, // Assuming it should be STRING instead of DATE
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

    return Magasin;
};
