const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Form = sequelize.define("Form", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  // Arrays
  part1GeneralInformation: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  part2StructuralSystem: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },

  // Survey Signs
  leaningOfBuilding: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
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

  // Defects
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

  // Overall condition
  overallCondition: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Recommendations (flattened)
  recommendation_noActionRequired: { type: DataTypes.STRING, allowNull: true },
  recommendation_repairStrengthening: { type: DataTypes.STRING, allowNull: true },
  recommendation_detailedAssessmentRequired: { type: DataTypes.STRING, allowNull: true },
  recommendation_barricadeNonUse: { type: DataTypes.STRING, allowNull: true },
  recommendation_reconstruction: { type: DataTypes.STRING, allowNull: true },

  status: {
    type: DataTypes.ENUM("Inprocess", "Complete"),
    allowNull: false,
    defaultValue: "Inprocess",
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
});

module.exports = Form;
