module.exports = (sequelize, DataType) => {
    let Car = sequelize.define('Car', {
        brand: {
            type: DataType.STRING(255),
            allowNull: false,
        },
        model: {
            type: DataType.STRING(255),
            allowNull: false,
        },
        year: {
            type: DataType.NUMERIC(0, 4),
            allowNull: false,
        },
        tax: {
            type: DataType.NUMERIC(0, 4),
            allowNull: false,
        }
    });
    
    // Car.associate = (models) => {
    //     Car.belongsToMany(models.Person, { through: 'Junction', foreignKey: 'id_car', onDelete: 'CASCADE' });
    // };

    return Car;
}