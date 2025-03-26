const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Form = sequelize.define("Form", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userName:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },

  part1GeneralInformation: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  part2StructuralSystem: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },

  leaningOfBuilding: { type: DataTypes.BOOLEAN, allowNull: true },
  settlement_floor: { type: DataTypes.BOOLEAN, allowNull: true },
  settlement_wall: { type: DataTypes.BOOLEAN, allowNull: true },
  settlement_foundation: { type: DataTypes.BOOLEAN, allowNull: true },

  defect_cracking: { type: DataTypes.STRING, allowNull: true },
  defect_settlement: { type: DataTypes.STRING, allowNull: true },
  defect_structural: { type: DataTypes.STRING, allowNull: true },
  defect_crazing: { type: DataTypes.STRING, allowNull: true },
  defect_honeycombing: { type: DataTypes.STRING, allowNull: true },
  defect_wallCracks: { type: DataTypes.STRING, allowNull: true },
  defect_rccCracks: { type: DataTypes.STRING, allowNull: true },
  defect_thermalCracking: { type: DataTypes.STRING, allowNull: true },
  defect_waterSeepage: { type: DataTypes.STRING, allowNull: true },
  defect_popOuts: { type: DataTypes.STRING, allowNull: true },
  defect_spalling: { type: DataTypes.STRING, allowNull: true },
  defect_rustStaining: { type: DataTypes.STRING, allowNull: true },
  defect_corrosionLongitudinalBars: { type: DataTypes.STRING, allowNull: true },
  defect_corrosionLateralTies: { type: DataTypes.STRING, allowNull: true },
  defect_debondingDueToCorrosion: { type: DataTypes.STRING, allowNull: true },
  defect_deflectionBeamsSlabsFloors: { type: DataTypes.STRING, allowNull: true },
  defect_delaminationDebonding: { type: DataTypes.STRING, allowNull: true },
  defect_crackingOthers: { type: DataTypes.STRING, allowNull: true },

  overallCondition: { type: DataTypes.STRING, allowNull: true },

  recommendation_noActionRequired: { type: DataTypes.STRING, allowNull: true },

  status: {
    type: DataTypes.ENUM("Inprocess", "Complete"),
    allowNull: false,
    defaultValue: "Inprocess",
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
});

// Define associations
User.hasMany(Form, { foreignKey: "userId" });
Form.belongsTo(User, { foreignKey: "userId" });

module.exports = Form;

