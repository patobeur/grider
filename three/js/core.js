import { Game } from "/three/js/Class/Game.js";
import { _namer } from "/three/js/fonctions/namer.js";
// import { Login } from "/locat/js/class/Login.js";
export let _core = {
	name: _namer.getName('_core', 1),
	ammo: null,
	// LOGIN: new Login(), // gère la connection 
	GAME: new Game(),
	init() {
		let datas = {
			callBackFunction: {
				sendPlayerDatas: (player) => {
					//todo
				},
				start: (data) => {
					console.log('start', data)
				}
			}
		}
		this.GAME.init(datas);
	},
}
