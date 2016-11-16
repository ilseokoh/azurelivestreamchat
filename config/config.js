var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'livestreamchat'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://livestreamchatdb:ZO0v0SwRprbsvgwTunv0l7JojEJ5KcEX7G5jZwWDF0i1SVTJLSloAE8OqEXeC53akfxntOtreLqSRKFQ7OthKg==@livestreamchatdb.documents.azure.com:10250/?ssl=true'
  },

  test: {
    root: rootPath,
    app: {
      name: 'livestreamchat'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://livestreamchatdb:ZO0v0SwRprbsvgwTunv0l7JojEJ5KcEX7G5jZwWDF0i1SVTJLSloAE8OqEXeC53akfxntOtreLqSRKFQ7OthKg==@livestreamchatdb.documents.azure.com:10250/?ssl=true'
  },

  production: {
    root: rootPath,
    app: {
      name: 'livestreamchat'
    },
    port: process.env.PORT || 80,
    db: 'mongodb://livestreamchatdb:ZO0v0SwRprbsvgwTunv0l7JojEJ5KcEX7G5jZwWDF0i1SVTJLSloAE8OqEXeC53akfxntOtreLqSRKFQ7OthKg==@livestreamchatdb.documents.azure.com:10250/?ssl=true'
  }
};

module.exports = config[env];