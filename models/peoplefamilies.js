module.exports = function(sequelize, DataTypes) {
    var Personfamilies = sequelize.define("Personfamilies",
        {},
        {
            classMethods:
                {
                    associate: function (models)
                    {
                        // Using additional options like CASCADE etc for demonstration
                        // Can also simply do Task.belongsTo(models.User);
                        Personfamilies.belongsTo(models.People,
                            {
                                foreignKey:
                                    {
                                        allowNull: true
                                    },
                                onDelete: 'cascade', hooks:true
                            });
                        Personfamilies.belongsTo(models.Families,
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
    return Personfamilies;
};