const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Form = sequelize.define("Form", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    // Arrays of Strings: Use JSONB for PostgreSQL
    part1GeneralInformation: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    part2StructuralSystem: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },

    leaningOfBuilding: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },

    // Settlements as individual fields
    settlement_floor: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    settlement_wall: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    settlement_foundation: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },

    // Defects as string fields
    defect_cracking: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    defect_settlement: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    defect_thermalCracking: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    defect_structural: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    defect_crazing: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    defect_honeycombing: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    defect_wallCracks: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    defect_rccCracks: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

module.exports = Form;
