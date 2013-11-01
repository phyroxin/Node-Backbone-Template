(function($){
	
	/*========================================================
	 * Create a model to hold friend attribute
	 *========================================================
	 */
	Friend = Backbone.Model.extend({
		name: null
	});
	
	/*========================================================
	 * Friends collection holds the friends models
	 *========================================================
	 */
	Friends = Backbone.Collection.extend({
		 initialize: function(models, options){
			// Listen for new additions to the collection and call a view function if so
			this.bind('add', options.view.render);
		}
		,url: '/api/friends'
	});
	
	/*========================================================
	 * Friends view 
	 *========================================================
	 */
	AppView = Backbone.View.extend({
		 el: $('body')
		,initialize: function(){
			// Create a friends collection when the view is initialized
			// Pass it a reference to this view to create a connection between the two
			this.friends = new Friends(null, {view: this});
			this.friends.fetch();
		}
		,events: {
			'click #add-friend': 'showPrompt'
		}
		,showPrompt: function(){
			var friend_name = prompt('Who is your friend?');
			var friend_model = new Friend({name: friend_name});
			var inputSuccess;
			// Add a new friend model to our friend collection
			$.get('/api/addfriend/'+friend_name, function(data){
				inputSuccess = data.name;
			});
			
			if(inputSuccess!==""||inputSuccess!=='null')
				this.friends.add(friend_model);
			else
				console.log('Something went wrong!');
		}
		// This function will display the newly entered text and also display
		// the results of the api call
		,render: function(model){
			console.log(model.attributes.name);
			if( model.attributes.name === 'null' 
			||  model.attributes.name === '' 
			|| !model.attributes.name)
				return false;
			else{
				// The parameter passed is a reference to the model that was added
				$('#friends-list')
				.append($('<li />',{
					class	: 'friendClass'
				})
				// Use .get to receive attributes of the model
				.html(model.get('name'))
				);
			}
		}
	});
	var appView = new AppView;
}($));