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
            allowNull: false,
            validate: {
                isEmail: true,
                isUnique: function(value, next) {
                    var self = this;
                    User.find({
                            where: {
                                email: value
                            }
                        })
                        .then(function(user) {
                            // reject if a different user wants to use the same email
                            if (user && self.id !== user.id) {
                                return next('Email already in use!');
                            }
                            return next();
                        })
                        .catch(function(err) {
                            return next(err);
                        });
                }
            }
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
    // methods ======================
    // generating a hash
    Person.methods.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

// checking if password is valid
    Person.methods.validPassword = function(password) {
        return bcrypt.compareSync(password, this.local.password);
    };
    return Person;
};