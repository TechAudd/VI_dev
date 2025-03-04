const sequelize = require("../config/database");
const User = require("./User");

const initDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected!");
        await sequelize.sync({ alter: true }); 
    } catch (error) {
        console.error("Database connection error:", error);
    }
};

module.exports = { initDB, User };
