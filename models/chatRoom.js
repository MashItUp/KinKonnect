module.exports = function(sequelize, DataTypes) {
    var ChatRoom = sequelize.define('ChatRoom', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:
            {
                len:
                {
                    args: [1, 100],
                        msg: "Please enter a Chat Room name 100."
                }
            }
        },
    },
    {
      classMethods: {
        associate: function(models) {
          // A PersonFamily (foreignKey) is required or a ChatRoom can't be made 
          ChatRoom.belongsTo(models.Person, {
            foreignKey: {
              allowNull: false
            },
            onDelete: 'cascade', hooks:true
          });
          // 
          ChatRoom.belongsTo(models.Family, {
            foreignKey: {
              allowNull: false
            },
            onDelete: 'cascade', hooks:true
          });
          // ChatRoom may have many posts 
          ChatRoom.hasMany(models.ChatPost, {
                foreignKey: {
                    allowNull: false
                },
                onDelete: 'cascade', hooks: true
          });
        }
      }, 
            freezeTableName: true
          }   
        );
    return ChatRoom;
};