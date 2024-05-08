export let _namer = {
	id: 0,
	byId: new Array(),
	names: {},
	charactersForImmat: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	setAleaName: function (obj, name = false) {
		let newName = (typeof name === 'string') ? name + '_' : "";
		// ---------------------------------
		for (let i = 0; i < 7; i++) {
			newName = newName + (
				i === 5 ? "_" : this.charactersForImmat.charAt(Math.floor(Math.random() * this.charactersForImmat.length))
			);
		}
		if (name != 'undefined' && typeof name === 'string') {
			newName = name + newName
		}
		obj.name = newName
		this.byId.push({
			name: newName,
			id: this.id
		})
		this.names[newName] = {
			name: newName,
			id: this.id
		}
	},
	getName: function (name = false) {
		let newName = (typeof name === 'string') ? name : "unknown";
		// ---------------------------------
		this.byId.push({
			name: newName,
			id: this.id
		})
		this.names[newName] = {
			name: newName,
			id: this.id
		}
		this.id++;
		return newName
	},
	displayNames: function () {
		console.log(this.byId)
		console.log(this.names)
	}
}
