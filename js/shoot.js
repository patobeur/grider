import * as THREE from "three";
let _shoot = {
	active: false,
	// ------------------------
	// INIT
	// ------------------------
	init: function (playerTankMesh, _scene, _physics) {
		this.playerTankMesh = playerTankMesh
		this._physics = _physics
		this._scene = _scene
		this.active = true
	},
	update: function () {
		if (this.active === true) {
			// to do
		}
	},
	shoot: function (name) {
		if (this.active === true) {
			// to do
			console.log('shoot', name)
		}
		else {
			console.log('shoot', 'unarmed')
		}
	},
}
export { _shoot }
