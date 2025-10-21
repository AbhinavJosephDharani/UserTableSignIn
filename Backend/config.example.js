module.exports = {
  PORT: process.env.PORT || 5050,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/web_app?retryWrites=true&w=majority',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
