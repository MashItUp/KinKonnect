module.exports = function(sequelize, DataTypes) {
    var Family = sequelize.define("Family", {
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
                    Family.belongsTo(models.Person,
                        {
                            foreignKey:
                                {
                                    allowNull: false
                                },
                            onDelete: 'cascade', hooks:true
                        });
                    Family.hasMany(models.Personfamily)
                }
            },
            freezeTableName: true
        }
    );
    return Family;
};