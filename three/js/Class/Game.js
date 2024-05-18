import { _scene } from "/three/js/scene/scene.js";
import Stats from 'three/addons/libs/stats.module.js';
import { _namer } from "/three/js/fonctions/namer.js";

export class Game {
	_previousREFRESH = null;
	namer = _namer.getName('Game');
	init = function (datas) {

		// this.name = _namer.getName('Game');
		let { callBackFunction } = datas
		this.callBackFunction = callBackFunction;

		this.stats = new Stats();
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.top = '0px';
		document.body.appendChild(this.stats.domElement);

		_scene.init();

		this._START();
	};
	_START() {
		this.callBackFunction.start('game STARTED')
		this._REFRESH();
	}
	_REFRESH = () => {
		requestAnimationFrame((t) => {
			// ----------
			if (this._previousREFRESH === null) this._previousREFRESH = t;
			this._STEP(t - this._previousREFRESH);
			this._previousREFRESH = t;
			this._REFRESH();
			// ----------
			this.stats.update();
		});
	};
	_STEP = (timeElapsed) => {
		timeElapsed = timeElapsed * 0.001;
		_scene.actions(timeElapsed)
	};
}
