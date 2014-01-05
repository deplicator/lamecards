/* Models */
var Recipient = Backbone.Model.extend ({
    initialize: function(){
        this.on('all', function(e) {
            console.log("Recipient Model: " + e);
        });
    },
    url: function() {
        return '/sandbox/ecards/api/' + this.get('recipient');
    }
});

var Card = Backbone.Model.extend({
    initialize: function(){
        this.on('all', function(e) {
            
            console.log("Card Model: " + e);
        });
        this.generateDate();
    },
    url: function() {
        return '/sandbox/ecards/api/' + this.get('recipient') + '/' + this.get('cardId');
    },
    generateDate: function () {
        var months = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];

        //var now = new Date();
        var happened = new Date(this.get('date'));
        var year = happened.getFullYear();
        var month = months[happened.getMonth()];
        var date = happened.getDate();
        this.set('hdate', month + " " + date + ", " + year);
    }
});


/* Views */
var ParentView = Backbone.View.extend ({
    initialize: function() {
        recipient = location.href;
    },
    render: function() {
        var template = _.template($("#navigation-template").html(), {recipient: this.model});
        this.$el.append(template);
        this.$el.append('<div id="recipient"></div>');
    },
    el: "#wrapper",
    displayRecipient: function(model) {
        viewRecipient = new RecipientView({model: model});
    },
    displayAbout: function() {
        
        viewAbout = new AboutView({previous: recipient});
    }
});

var RecipientView = Backbone.View.extend ({
    initialize: function() {
        this.model.bind("change", _.bind(this.render, this));
        this.model.fetch({
            success: this.getCards
        });
        
    },
    render: function() {
        var template = _.template($("#recipient-template").html(), {recipient: this.model});
        this.$el.html(template);
        $('#recipient').append('<div id="cardlist" class="row"></div>');
        
    },
    el: "#recipient",
    getCards: function(model, response) {
        _.each(response, function(card) {
            new CardView({model: new Card(card)});
        });
        $('#nav-recipient a').html(viewRecipient.model.get('recipient') + '\'s Cards');
    },
    events: {
        "click .card": "showCard"
    },
    showCard: function(evt) {
        var id = $(evt.currentTarget).attr('id').slice(-1);
        console.log("card clicked: " + id)
    }
});

var CardView = Backbone.View.extend ({
    initialize: function() {
        this.model.bind("change", _.bind(this.render, this));
        this.model.fetch();
    },
    render: function() {
        var template = _.template($("#card-template").html(), {card: this.model});
        this.$el.append(template);
    },
    el: "#cardlist"
});

var AboutView = Backbone.View.extend ({
    initialize: function() {
        this.render();
    },
    render: function() {
        var template = _.template($("#about").html());
        this.$el.html(template);
        $('#nav-recipient').html('');
    },
    el: "#recipient"
});





$(document).ready(function() {
    //Backbone.emulateHTTP = true;
    //Backbone.emulateJSON = true;

    AppRouter = Backbone.Router.extend({
        routes: {
            "about": "about",
            ":name": "getRecipient",
            ":name/": "getRecipient",
            "*action": "showDefault"
        },
        showDefault: function(action) {
            console.log('route: default, input=' + action);
            about = new AboutView();
        },
        getRecipient: function(name) {
            console.log('route: recipient=' + name);
            
            parentView.displayRecipient(new Recipient({
                recipient: name
            }));
        },
        about: function() {
            console.log('route: about');
            parentView.displayAbout();
        }
    });
    
    // Instantiate the router
    app_router = new AppRouter;
    parentView = new ParentView();
    parentView.render();
    
    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start({pushState: true, root: '/sandbox/ecards'})
    
    // Show single cards with hash.
    function showSingleCard() {
        $('#cardModal' + location.hash.slice(1)).modal('show');
        console.log("hash checked");
    }
    window.onhashchange = showSingleCard;
    setTimeout(showSingleCard, 250);

});