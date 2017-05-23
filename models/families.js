module.exports = function(sequelize, DataTypes) {
    var Families = sequelize.define("Families", {
            name:
                {
                    type:DataTypes.STRING,
                    allowNull: false,
                },
            secret_key:
                {
                    type:DataTypes.STRING,
                    allowNull: false,
                },
        },
        {
            // We're saying that we want our Family to have many Persons
            classMethods: {
                associate: function (models)
                {
                    // Using additional options like CASCADE etc for demonstration
                    // Can also simply do Task.belongsTo(models.User);
                    Families.belongsTo(models.People,
                        {
                            foreignKey:
                                {
                                    allowNull: true
                                },
                            onDelete: 'cascade', hooks:true
                        });
                }
            }
        }
    );
    return Families;
};