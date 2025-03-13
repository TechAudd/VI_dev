module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Forms", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Forms", "userId");
  },
};
