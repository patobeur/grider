import * as THREE from 'three';
import { _formulas } from '../fonctions/formulas.js';
import { _scene } from "/three/js/scene/scene.js";
import { _namer } from "/three/js/fonctions/namer.js";
export class Inputs {
	name = _namer.getName('Inputs')
	conslog = true;
	mouse;
	zooming;
	_preventDefaultRightClick = false; // dev mod
	KEYS = {
		arrowLeft: { defaultkey: 'ArrowLeft', key: 'ArrowLeft', keycode: '37', name: "left" },
		arrowUp: { defaultkey: 'ArrowUp', key: 'ArrowUp', keycode: '38', name: "forward" },
		arrowRight: { defaultkey: 'ArrowRight', key: 'ArrowRight', keycode: '39', name: "right" },
		arrowDown: { defaultkey: 'ArrowDown', key: 'ArrowDown', keycode: '40', name: "backward" },

		shoot1: { defaultkey: '1', key: '&', keycode: '49', name: "shoot1" },
		shoot2: { defaultkey: 'é', key: '&', keycode: '50', name: "shoot2" },
		shoot3: { defaultkey: '"', key: '', keycode: '51', name: "shoot3" },
		shoot4: { defaultkey: "'", key: '', keycode: '52', name: "shoot4" },
		shoot5: { defaultkey: '(', key: '', keycode: '53', name: "shoot5" },
		shoot6: { defaultkey: '-', key: '', keycode: '54', name: "shoot6" },
		shoot7: { defaultkey: 'è', key: '', keycode: '55', name: "shoot7" },
		shoot8: { defaultkey: '_', key: '', keycode: '56', name: "shoot8" },
		shoot9: { defaultkey: 'ç', key: '', keycode: '57', name: "shoot9" },
		shoot10: { defaultkey: 'à', key: '', keycode: '48', name: "shoot10" },
		// shoot11: { defaultkey: ')', key: '', keycode: '169', name: "shoot11" },
		// shoot12: { defaultkey: '=', key: '', keycode: '61', name: "shoot12" },

		turnleft: { defaultkey: 'a', key: 'a', keycode: '65', name: "turnleft" },
		turnright: { defaultkey: 'e', key: 'e', keycode: '69', name: "turnright" },
		backward: { defaultkey: 's', key: 's', keycode: '83', name: "backward" },
		forward: { defaultkey: 'z', key: 'z', keycode: '90', name: "forward" },

		right: { defaultkey: 'q', key: 'q', keycode: '81', name: "right" },
		left: { defaultkey: 'd', key: 'd', keycode: '68', name: "left" },
	}
	KEY_MAP = {
		"&": () => this.shoot1 = true,
		"é": () => this.shoot2 = true,
		'"': () => this.shoot3 = true,
		"'": () => this.shoot4 = true,
		"(": () => this.shoot5 = true,
		"-": () => this.shoot6 = true,
		"è": () => this.shoot7 = true,
		"_": () => this.shoot8 = true,
		"ç": () => this.shoot9 = true,
		"à": () => this.shoot10 = true,
		// ")": () => this.shoot11 = true,
		// "=": () => this.shoot11 = true,
		"ArrowLeft": () => this.left = true,
		"q": () => this.left = true,
		"a": () => this.sleft = true,
		"ArrowRight": () => this.right = true,
		"d": () => this.right = true,
		"e": () => this.sright = true,
		"ArrowUp": () => this.up = true,
		"z": () => this.up = true,
		"ArrowDown": () => this.down = true,
		"s": () => this.down = true,
		" ": () => this.space = true,
		"Space": () => this.space = true,
	};
	KEY_MAP_OFF = {
		"&": () => this.shoot1 = false,
		"é": () => this.shoot2 = false,
		'"': () => this.shoot3 = false,
		"'": () => this.shoot4 = false,
		"(": () => this.shoot5 = false,
		"-": () => this.shoot6 = false,
		"è": () => this.shoot7 = false,
		"_": () => this.shoot8 = false,
		"ç": () => this.shoot9 = false,
		"à": () => this.shoot10 = false,
		// ")": () => this.shoot11 = false,
		// "=": () => this.shoot11 = false,
		"ArrowLeft": () => this.left = false,
		"q": () => this.left = false,
		"a": () => this.sleft = false,
		"ArrowRight": () => this.right = false,
		"d": () => this.right = false,
		"e": () => this.sright = false,
		"ArrowUp": () => this.up = false,
		"z": () => this.up = false,
		"ArrowDown": () => this.down = false,
		"s": () => this.down = false,
		" ": () => this.space = false,
		"Space": () => this.space = false,
	};
	// Properties
	zooming = false
	oldintersect = null;
	mouse = new THREE.Vector2();
	thetaDeg = 0;
	shoot1 = false;
	shoot2 = false;
	shoot3 = false;
	shoot4 = false;
	shoot5 = false;
	space = false; // same ??
	jump = false; // same ??
	falling = false;
	up = false;
	left = false;
	right = false;
	down = false;
	sleft = false;
	sright = false;
	constructor() {
		this.conslog = false
	}
	init() {
		this._setupDeviceControls();
	}
	_setupDeviceControls() {
		this.detectDevice = this._isTouchDevice();
		if (this.detectDevice.isMousePointer) {
			this._touchDeviceActive = false;
			console.log('------------> Keyboard\'n\'mouse on ! 🖱️ + ⌨️');
			this._addKeyboardListeners();
			this._addMouseListeners();
		}
		else if (!this.detectDevice.isMousePointer && (this.detectDevice.touchEvent || this.detectDevice.ontouchstart || this.detectDevice.maxTouchPoints)) {
			this._touchDeviceActive = true;
			console.log('------------> Tactil device on ! 📱');
			this._TouchM = new TouchMe(this);
		}

		else if (this.detectDevice.isMousePointer && this.detectDevice.maxTouchPoints === false) {
			this._touchDeviceActive = false;
			console.log('------------> Keyboard\'n\'mouse on ! 🖱️ + ⌨️');
			this._addKeyboardListeners();
			this._addMouseListeners();
		}
		else if (this.detectDevice.isMousePointer && this.detectDevice.maxTouchPoints) {
			this._touchDeviceActive = true;
			console.log('------------> Keyboard\'n\'Pad on, Sorry you need to conect a Mouse and refresh [5] ! ⌨️');
			this._addKeyboardListeners();
			this._addMouseListeners();
		}
	}
	_isTouchDevice() {
		const ontouchstart = 'ontouchstart' in window;
		const maxTouchPoints = (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
		const isMousePointer = window.matchMedia('(pointer:fine)').matches;

		let touchEvent = false;
		try {
			touchEvent = document.createEvent("TouchEvent");
		} catch (e) { }

		const detectedDevice = { touchEvent, ontouchstart, maxTouchPoints, isMousePointer };

		// console.table(detectedDevice);

		// _waveLock.tryKeepScreenAlive(10);
		// _wakeLock.requestWakeLock();

		return detectedDevice;
	}
	_addMouseListeners() {

		const svg = document.getElementById('target')
		const mire = document.createElement('div');
		mire.className = 'mire';
		document.body.appendChild(mire);

		const target = document.createElement('div');
		target.className = 'target';
		target.style.position = 'absolute';

		if (svg) {
			svg.remove()
			svg.id = null;
			target.append(svg)
		}

		document.body.appendChild(target);

		document.body.onmousemove = event => {
			this._handleMouseMove(event, target);
		};

		document.documentElement.oncontextmenu = event => {
			if (this.conslog) console.log('right click');
			if (this._preventDefaultRightClick) event.preventDefault();
			this.shoot2 = true;
		};

		document.documentElement.onclick = () => {
			if (this.conslog) console.log('left click');
			this.shoot1 = true;
		};
		document.documentElement.onwheel = event => {
			// event.preventDefault();
			this._handleMouseWheel(event);
		};

		// document.getElementById('game').onmousemove = event => {
		// 	this._handleMouseMove(event, target);
		// };
	}
	_handleMouseWheel(event) {
		if (event.ctrlKey === false && event.altKey === false) {
			// if (this.conslog) console.info(event)
			this.zooming = event.deltaY > 0 ? 'out' : 'in'
		}
	}
	_handleMouseMove(event, target) {
		target.style.left = `${event.clientX - 9}px`;
		target.style.top = `${event.clientY - 3}px`;
		this.thetaDeg = _formulas.get_DegreeWithTwoPos(window.innerWidth / 2, window.innerHeight / 2, event.clientX, event.clientY);
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		this._get_intersectionColorChange()
	}
	_addKeyboardListeners() {
		document.onkeydown = event => this._handleKeyDown(event);
		document.onkeyup = event => this._handleKeyUp(event);
	}
	_ChangeKeys() {

		for (const key in this._sets) {
			if (Object.hasOwnProperty.call(this._sets, key)) {
				this._sets[key](this);
				console.log(key)
			}
		}

	}
	_handleKeyDown(event) {
		if (this.KEY_MAP[event.key]) {
			if (this._preventDefaultRightClick) event.preventDefault();
			if (event.key === "'") event.preventDefault();
			this.KEY_MAP[event.key]();
		}
		if (this.conslog) console.log('EVENT', event);
		if (this.conslog) console.log('EVENT', event.key, event.charCode, event.keyCode);

		// console.log(String.fromCharCode(event.keyCode))
	}
	_handleKeyUp(event) {
		if (this.KEY_MAP_OFF[event.key]) this.KEY_MAP_OFF[event.key]();
	}
	_get_intersectionColorChange() {
		this.raycaster = new THREE.Raycaster();
		this.raycaster.setFromCamera(this.mouse, _scene.camera);
		let intersects = this.raycaster.intersectObject(_scene.scene, true);
		// console.log('length', intersects.length)

		if (intersects.length > 1) {
			if (intersects[0].object.name != "floor" && intersects[0].object.name != "") {
				// console.log('on ', intersects[0].object.name)
				// if old intersect
				if (this.oldintersect) {
					if (this.oldintersect.uuid != intersects[0].object.uuid) {
						this.oldintersect.material.color.setHex(this.oldintersect.currentHex);
						this.oldintersect = null;
					}
				}
				else {
					// new intersect
					this.oldintersect = intersects[0].object;
					this.oldintersect.currentHex = this.oldintersect.material.color.getHex();
					this.oldintersect.uuid = intersects[0].object.uuid;
					this.oldintersect.material.color.setHex(0xFF0000);
				}
			}
			else {
				// sol
				if (this.oldintersect) {
					if (this.conslog) console.log('floor', this.oldintersect.name)
					this.oldintersect.material.color.setHex(this.oldintersect.currentHex);
					this.oldintersect = null;
				}
			}
		}
		else {
			// there are no intersections
			if (intersects.length < 1) {
				if (this.conslog) console.log('no intersection', this.oldintersect)
				this.oldintersect = null;
			}
		}
	}
}
