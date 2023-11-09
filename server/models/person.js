module.exports = (sequelize, DataType) => {
    let Person = sequelize.define('Person', {
        firstName: {
            type: DataType.STRING(255),
            allowNull: false,
        },
        lastName: {
            type: DataType.STRING(255),
            allowNull: false,
        },
        cnp: {
            type: DataType.STRING(13),
            allowNull: false,
        },
        age: {
            type: DataType.NUMERIC(0, 3),
            allowNull: false,
        },
        
    });
    
    // Person.associate = (models) => {
    //     Person.belongsToMany(models.Car, { through: 'Junction', foreignKey: 'id_person', onDelete: 'CASCADE' });
    // };

    return Person;
}