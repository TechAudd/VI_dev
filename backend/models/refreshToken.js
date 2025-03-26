module.exports = (sequelize, DataTypes) => {
    const RefreshToken = sequelize.define("RefreshToken", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "User", 
                key: "id",
            },
            onDelete: "CASCADE",
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return RefreshToken;
};
