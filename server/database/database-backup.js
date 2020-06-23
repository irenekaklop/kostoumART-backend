const { exec } = require('child_process');
var fs = require('fs');
var config   = require('../config/db.config');
var path = require('path');

var mysqlBackup = function() {
	var now = new Date();
	var day = now.getDay();
	var directory =  __dirname + '/backups/'
	//Weekly backup too (on Monday)
	if(day === 1){
		var filepath = path.join(directory, 'weeklyDatabaseDump.sql');
		//Check if weekly dumps exist
		if (fs.existsSync(filepath)){
			fs.unlinkSync(filepath);
			fs.readdir(directory, (err, files) => {
				if (err) throw err;
			  
				for (const file of files) {
					fs.rename(path.join(directory, file), path.join(directory, 'weeklyDatabaseDump.sql'), function(err) {
						if ( err ) console.log('ERROR: ' + err + directory+file );
					});
				}
			});
		}
		else{
			fs.readdir(directory, (err, files) => {
				if (err) throw err;
			  
				for (const file of files) {
					fs.rename(path.join(directory, file), path.join(directory, 'weeklyDatabaseDump.sql'), function(err) {
						if ( err ) console.log('ERROR: ' + err + directory+file );
					});
				}
			});
		}
	}
	else {
		fs.readdir(directory, (err, files) => {
			if (err) throw err;
		  
			for (const file of files) {
				if(file!=='weeklyDatabaseDump.sql'){
					fs.unlinkSync(path.join(directory, file), err => {
						if (err) throw err;
					});
				}
			}
		});
	}
	var filename = now.getFullYear() + "-"+ now.getMonth() + "-" + now.getDate() +'-databaseDump';
	exec(`mysqldump -u${config.user} -p${config.password} ${config.database} > ${path.join(directory, filename)}.sql`);
};

module.exports = mysqlBackup;