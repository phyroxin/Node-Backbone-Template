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
		populateDB();
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

exports.getAll = function(req, res){
	
	var collection = db.get('friendcollection');
	collection.find({},{},function(err, doc){
		if(err){
			console.log('No results found');
			res.send('No results found');
		}
		else{
			res.send(doc);
		}
	});
	
}

exports.addFriend = function(req, res){
	// Get our form values
	var friend	= req.params.name;
	console.log(friend);
	// Set our collection
	var collection = db.get('friendcollection');
	
	// Submit to the DB
	collection.insert({
		 'name'	:friend
	}, function(err, doc){
		if(err){
			// If it failed, return error
			res.send('There was a problem adding the information to the database.');
		}
		else{
			console.log('Name: '+friend+' inserted successfully!');
			// If it worked, forward to success page
			res.send({'name':friend});
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
         name: "Lamin"
    }
	,{
         name: "Bob"
    }
	,{
         name: "John"
    }
	,{
         name: "Jill"
    }];

	collection.insert(users, function(err, result) {
		if(!err)
			console.log('...collection creation complete!');
	});
};