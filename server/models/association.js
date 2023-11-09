function applyExtraSetup(sequelize) {
	const { Person, Car } = sequelize.models;
    Person.belongsToMany(Car, { through: 'Junction', foreignKey: 'id_person', onDelete: 'CASCADE' });
    Car.belongsToMany(Person, { through: 'Junction', foreignKey: 'id_car', onDelete: 'CASCADE' });
}

module.exports = { applyExtraSetup };