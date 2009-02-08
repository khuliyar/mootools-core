/*
Script: Fx.Morph.js
	Formerly Fx.Styles, effect to transition any number of CSS properties for an element using an object of rules,
		or CSS based selector rules.

License:
	MIT-style license.
*/

Fx.Morph = new Class({

	Extends: Fx.CSS,

	initialize: function(element, options){
		this.element = this.subject = $(element);
		this.parent(options);
	},

	set: function(now){
		if (typeOf(now) == 'string') now = this.search(now);
		for (var p in now) this.render(this.element, p, now[p], this.getOption('unit'));
		return this;
	},

	compute: function(from, to, delta){
		var now = {};
		for (var p in from) now[p] = this.parent(from[p], to[p], delta);
		return now;
	},

	start: function(properties){
		if (!this.check(arguments.callee, properties)) return this;
		if (typeOf(properties) == 'string') properties = this.search(properties);
		var from = {}, to = {};
		for (var p in properties){
			var parsed = this.prepare(this.element, p, properties[p]);
			from[p] = parsed.from;
			to[p] = parsed.to;
		}
		return this.parent(from, to);
	}

});

Element.addSetter('morph', function(options){
	var morph = this.retrieve('morph');
	if (morph) morph.cancel();
	return this.dump('morph').store('morph:options', Object.append({link: 'cancel'}, options));
});

Element.addGetter('morph', function(options){
	if (options || !this.retrieve('morph')){
		if (options || !this.retrieve('morph:options')) this.set('morph', options);
		this.store('morph', new Fx.Morph(this, this.retrieve('morph:options')));
	}
	return this.retrieve('morph');
});

Element.implement({

	morph: function(props){
		this.get('morph').start(props);
		return this;
	}

});
