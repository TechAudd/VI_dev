module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if column exists before adding it
    return queryInterface.describeTable("Forms").then((tableDefinition) => {
      if (!tableDefinition.userId) {
        return queryInterface.addColumn("Forms", "userId", {
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        });
      }
    });
  },

  down: async (queryInterface) => {
    return queryInterface.removeColumn("Forms", "userId");
  },
};
