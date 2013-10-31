/*========================================================
 * Connect to DB
 *========================================================
 */
var mongo 	= require('mongodb');
var monk 	= require('monk');
var db 		= monk('localhost:27017/nodetest2');

/*========================================================
 * Check DB exists, if not create
 *========================================================
 */
var collection = db.get('friendcollection');
collection.find({}, function(err, docs){
	if(JSON.stringify(docs) !== '[]'){
		console.log('Connected to nodetest2 database...');
		console.log(docs);
	}
	else{
		console.log('Couldn\'t find nodetest2 collection, creating with sample data...');
		//populateDB();
	}
});

/*========================================================
 * Route Models
 *========================================================
 */
exports.index = function(req, res){
	console.log('Home page');
	res.render('index', {
		title:'Home'
	});
};

exports.newuser = function(req, res){
	console.log('Add user page');
	res.render('newuser', {
		title: 'Add New User'
	});
};

exports.adduser = function(req, res){
	// Get our form values
	var userName	= req.body.username;
	var userEmail	= req.body.useremail;
	
	// Set our collection
	var collection = db.get('usercollection');
	
	// Submit to the DB
	collection.insert({
		 'username'	:userName
		,'email'	:userEmail
	}, function(err, doc){
		if(err){
			// If it failed, return error
			res.send('There was a problem adding the information to the database.');
		}
		else{
			console.log('Name: '+userName+' and email: '+userEmail+' inserted successfully!');
			// If it worked, forward to success page
			res.redirect('about');
		}
	});
};

exports.updateuser = function(req, res){
	// Get our update id
	var id 			= req.params.id;
	var userName	= req.body.data;
	
	console.log(id);
	console.log(userName);
	
	// Set our collection
	var collection = db.get('usercollection');
	
	// Submit to the DB
	collection.updateById(id, {
		 'username'	:userName
	}, function(err, doc){
		if(err){
			// If it failed, return error
			res.send('There was a problem updating.');
		}
		else{
			console.log('Name: '+userName+' updated successfully!');
			// If it worked, forward to success page
			res.redirect('about');
		}
	});
};

exports.deluser = function(req, res){
	// Get id
	var id = req.params.id;
	
	// Set our collection
	var collection = db.get('usercollection');
	
	// Submit to the DB
	collection.remove({_id: id}, function(err, doc){
		if(err){
			// If it failed, return error
			res.send('There was a problem deleting this item.');
		}
		else{
			console.log('Item id: '+id+' deleted!');
			res.send({'test':'test'});
		}
	});
};

exports.delall = function(req, res){
	
	// Set our collection
	var collection = db.get('usercollection');
	
	// Submit to the DB
	collection.drop(function(err){
		if(!err){
			console.log('All users deleted!');	
			res.send({'test':'test'});
		}
	});
};

/*========================================================
 * Populate db with data if none found
 *========================================================
 */
var populateDB = function() {

    var users = [
	{
         username: "Lamin"
        ,email: "me@me.com"
    }
	,{
         username: "Bob"
        ,email: "bob@bob.com"
    }
	,{
         username: "John"
        ,email: "john@john.com"
    }
	,{
         username: "Jill"
        ,email: "jill@jill.com"
    }
	,{
         username: "Rita"
        ,email: "rita@rita.com"
    }
	,{
         username: "Jay"
        ,email: "jay@jay.com"
    }
	,{
         username: "Marge"
        ,email: "marge@marge.com"
    }
	,{
         username: "Sue"
        ,email: "sue@sue.com"
    }];

	collection.insert(users, function(err, result) {
		if(!err)
			console.log('...collection creation complete!');
	});
};