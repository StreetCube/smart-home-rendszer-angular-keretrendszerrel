module.exports = {
  database: {
    name: 'celestara',
    password: 'celestara',
    database: 'celestara',
    options: {
      schema: 'clst',
      host: 'localhost',
      port: 5432,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      seederStorage: 'sequelize',
    },
  },
  mqtt: {
    port: 1883,
    host: 'localhost',
  },
};
