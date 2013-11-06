(function($){
	/*========================================================
	 * Backbone Models test
	 *========================================================
	
	Mate = Backbone.Model.extend({
		defaults: {
			'name': 'Darrell Bent'
		}
		,updateName: function(newName){this.set('name', newName);}
	});
	
	firstMate = new Mate();
	
	console.log(firstMate.toJSON());
	
	firstMate.on('change:name', function(){
		console.log('You\'ve updated the name');
		console.log(this.get('name'));
	});
	 */
	
	//firstMate.updateName('Jim Broad');
	
	/*========================================================
	 * Backbone Collections test
	 *========================================================
	 */
	 
	 Mate = Backbone.Model.extend();
	 
	 Mates = Backbone.Collection.extend({
		 Model: Mate
		,url: '#'
	 });
	 
	 
	 mates = new Mates([
		 {name:'Bob Cantelli'}
		,{name:'Susan Blisett'}
		,{name:'Bob Monroe'}
	 ]);
	 
	 mates.on('add remove', function(){
		console.log('You\'ve changed the collection');
	 });
	 
	 var firstMate = new Mate({
		name:'Marco Polo'
	 });
	 
	 mates.add(firstMate);
	 
	 mates.each(function(model){
		console.log(model.get('name'));
	 });
	 
	/*========================================================
	 * Backbone Views test
	 *========================================================
	 */
	 
	 HomeView = Backbone.View.extend({
		 
		 el:'.backboneSandbox' 
		 
		,initialize: function(){
			this.render();
		 }
		 
		,render: function(){
		
			this.$el.empty();
			
			this.$el.append($('<h2 />', {
								 'class':'h1Class'
								,'style':'color:red;'
								}).html('Backbone Sandbox')
							);
			
			this.listView = new ListView();
			this.$el.append(this.listView.render().el);
			
			return this;
		}
	 });

	 ListView = Backbone.View.extend({
		 tagName: 'ul'
		
		,initialize: function(){
			this.template = _.template($('#item-container').html());
		}

		,render: function(){
			var  el = this.$el
				,template = this.template;
			
			el.empty();
			
			mates.each(function(mate){
				el.append(template(mate.toJSON()));
			});
			
			return this;
		}
	 });
	 
	 $(document).ready(function(){
		mateApp = new HomeView();
	 });
	
	
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
			if(friend_name){
				$.get('/api/addfriend/'+friend_name, function(data){
					inputSuccess = data.name;
				});
				if(inputSuccess!==""||inputSuccess!=='null')
					this.friends.add(friend_model);
				else
					console.log('Something went wrong!');
			}
			
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
}(jQuery));