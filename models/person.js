module.exports = function(sequelize, DataTypes) {
    var Person = sequelize.define("Person", {
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 160],
                    msg: "Please enter a first name."
                }
            }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 160],
                    msg: "Please enter a last name."
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                len: {
                    args: [5, 10]
                }
            }
        }
    }, {
        classMethods:
            {
                associate: function (models)
                {
                    console.log('class method called');
                    // Using additional options like CASCADE etc for demonstration
                    // Can also simply do Task.belongsTo(models.User);
                    Person.hasMany(models.Family,
                        {
                            foreignKey:
                                {
                                    allowNull: false
                                }
                        });
                    Person.hasMany(models.ChatPost,
                        {
                            foreignKey:
                                {
                                    allowNull: false
                                }
                        });
                }
            },
        freezeTableName: true
    });

    return Person;
};