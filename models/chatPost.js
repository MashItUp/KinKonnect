module.exports = function(sequelize, DataTypes) {
    var ChatPost = sequelize.define('ChatPost', {
        body: {
            type: DataTypes.STRING,
            notEmpty: true,
            validate:
                {
                    len:
                        {
                            args: [1, 350],
                            msg: "Please enter a post."
                        }
                }
        }
      }, 
        {
          classMethods: {
            associate: function(models) {
              // A PersonFamily (foreignKey) is required or a ChatPost can't be made 
              ChatPost.belongsTo(models.ChatRoom, {
                foreignKey: {
                  allowNull: false
                },
                onDelete: 'cascade', hooks:true
              });
              //  Belongs to Person
              ChatPost.belongsTo(models.Person, {
                foreignKey: {
                  allowNull: false
                },
                onDelete: 'cascade', hooks:true
              });
            }
          },
          freezeTableName: true  
        }
    );
  return ChatPost;
};