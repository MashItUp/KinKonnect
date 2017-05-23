module.exports = function(sequelize, DataTypes) {
    var People = sequelize.define("People", {
            first_name:
                {
                    type:DataTypes.STRING,
                    allowNull: false,
                    validate:
                        {
                            len:
                                {
                                    args: [1, 160],
                                    msg: "Please enter a first name."
                                }
                        }
                },
            last_name:
                {
                    type:DataTypes.STRING,
                    allowNull: false,
                    validate:
                        {
                            len:
                                {
                                    args: [1, 160],
                                    msg: "Please enter a last name."
                                }
                        }
                },
            email:
                {
                    type:DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        isEmail: true,
                        isUnique: function (value, next) {
                            var self = this;
                            User.find({where: {email: value}})
                                .then(function (user) {
                                    // reject if a different user wants to use the same email
                                    if (user && self.id !== user.id) {
                                        return next('Email already in use!');
                                    }
                                    return next();
                                })
                                .catch(function (err) {
                                    return next(err);
                                });
                        }
                    }
                },
            password:
                {
                    type:DataTypes.STRING,
                    allowNull: false
                },
            dob:
                {
                    type:DataTypes.DATE,
                    allowNull: false
                }
        }
    );
    return People;
};