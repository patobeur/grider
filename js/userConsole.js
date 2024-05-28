
import { _player } from '/js/player.js';
let _userConsole = function () {
	// Exemple de fonction pour manipuler le tank via la console
	window.setcolor = function (r = 0, g = 0, b = 0) {
		let Skin = _player.playerTankMesh.children[0].children[0]
		Skin.material.color.r = r
		Skin.material.color.g = g
		Skin.material.color.b = b
	};
	window.setcolor2 = function (r = 0, g = 0, b = 0) {
		let Skin = _player.playerTankMesh.children[0].children[3]
		Skin.material.color.r = r
		Skin.material.color.g = g
		Skin.material.color.b = b
	};
	window.moveTankForward = function () {
		_player.moveForward = true;
		_player.moveBackward = false;
	};

	window.moveTankBackward = function () {
		_player.moveForward = false;
		_player.moveBackward = true;
	};

	window.stopTank = function () {
		_player.moveForward = false;
		_player.moveBackward = false;
	};
}

export { _userConsole }
