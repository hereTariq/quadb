const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_password: {
        type: DataTypes.STRING,
        // allowNull: false,
    },
    user_image: {
        type: DataTypes.STRING,
    },
    total_orders: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    last_logged_in: {
        type: DataTypes.DATE,
    },
});

module.exports = User;
