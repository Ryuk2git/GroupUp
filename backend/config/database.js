import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize('groupproxy', 'root', 'Rishi', {
    host: 'localhost',
    dialect: 'mysql'
    // logging: false,
});

export default sequelize;
