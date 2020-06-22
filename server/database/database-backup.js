const { exec } = require('child_process');
var config   = require('../config/db.config');

var mysqlBackup = function() {
	var now = new Date();
	var filename = now.getFullYear() + "-"+ now.getMonth() + "-" + now.getDate() +'-databaseDump.sql';
	exec(`mysqldump -u${config.user} -p${config.password} ${config.database} > ${filename}.sql`);
};

module.exports = mysqlBackup;