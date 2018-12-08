module.exports = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mongodb/${process.env.DB_DATABASE}?authSource=admin`;
