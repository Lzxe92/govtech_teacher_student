/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {

  console.log('Bootstrap start');
  var execSQL = require('exec-sql');
  execSQL.connect({
    'host': sails.getDatastore().config.host,
    'database': sails.getDatastore().config.database,
    'user': sails.getDatastore().config.user,
    'password': sails.getDatastore().config.password
  });
  await execSQL.executeFile(sails.config.appPath + '/database/init.sql'), function(err) {
    execSQL.disconnect();
  };


  console.log('Bootstrap done');
};
