module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("Admin", {
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
        role:{
            type:DataTypes.STRING,
            allowNull:false,
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

  

    return Admin;
};
