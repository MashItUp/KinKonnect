module.exports = function(sequelize, DataTypes) {
    var Personfamily = sequelize.define("Personfamily",
        {},
        {
            classMethods:
                {
                    associate: function (models)
                    {
                        // Using additional options like CASCADE etc for demonstration
                        // Can also simply do Task.belongsTo(models.User);
                        Personfamily.belongsTo(models.Person,
                            {
                                foreignKey:
                                    {
                                        allowNull: true
                                    },
                                onDelete: 'cascade', hooks:true
                            });
                        Personfamily.belongsTo(models.Family,
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
    return Personfamily;
};
