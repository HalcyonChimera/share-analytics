import Ember from 'ember';

export default Ember.Controller.extend({

    queryParams: [
        {'id': {scope: "controller"}},
        {'scholar': {scope: "controller"}},
        {'query': {scope: "controller"}},
        {'q': {scope: "controller"}},
        {'institution': {scope: "controller"}},
        {'tag': {scope: "controller"}},
        {'tags': {scope: "controller"}},
        {'topic': {scope: "controller"}},
        {'all': {scope: "controller"}},
        {'sources': {scope: "controller"}},
        {'publishers': {scope: "controller"}},
        {'type': {scope: "controller"}},
        {'funders': {scope: "controller"}},
        {'contributors': {scope: "controller"}},
    ],

    updateParams: Ember.observer('queryParams', function() {
        //this.set("parameters", Ember.computed.apply(this, this.get('queryParams').concat(() => {
        //    return this.get('queryParams').map((param) => {
        //        return this.get(param);
        //    })
        //})));
    }),

    currentUser: Ember.inject.service(),

    // Initialize the dashboard with no widgets.
    widgets: [],

    // Initialize the list of additional charts that the user can add
    addableList: [],
    storedDashboards: [],

    configureQuery: function()  {
    }.on('init'),

    init() {
        let ret = this._super();
                return ret;
    },

    actions: {

        changeQ: function(query) {
            this.set('q',query);
        },

        changeGte: function(g) {
            g = new Date(g);
            this.set('gte', g.toISOString().split('T')[0]); // Elasticsearch doesn't accept timezone information.
        },

        changeLte: function(l) {
            l = new Date(l);
            this.set('lte',l.toISOString().split('T')[0]);
        },

        sortEndAction: function() {

        },

        removeChart: function(targetWidget) {
            this.set('widgets', this.get('widgets').filter(function(widget) {
                return widget !== targetWidget;
            }).slice());
        },

        addChart: function(widget) {
            this.set('widgets', this.get('widgets').concat({isPlaceholder: true}));
        },

        dashboardSaveWidget: function(widget) {
            this.get('currentUser').load().then((c) => {
                widget.author = c.get('fullName');
                this.set('widgets', this.get('widgets').addObject(widget));
                widget = this.store.createRecord('widget', widget);
                widget.save();
                // TODO: This should not be an alert, but a growl-style notification.
                // alert("Chart has been successfully saved!");
            }, function(r){
                // TODO: This should not be an alert, but a growl-style notification.
                alert("Widgets may not be saved anonymously. Log in to save a widget.");
            });
        }

    },

});
