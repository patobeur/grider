
"use strict";
import * as THREE from "three";
import { _GLTFLoader, _TextureLoader, _scene, _consoleOn, _formulas } from '/js/loaders.js'
import { clone } from 'three/addons/utils/SkeletonUtils.js';
import { _OrbitControls } from '/js/OrbitControls.js';
import { _shoot } from '/js/shoot.js';
import { _physics } from '/js/physics.js';
import { _sphereBleue } from '/js/sphereBleue.js';

let _player = {
	playerTankMesh: undefined,
	playerTurret: undefined,
	// ----------------
	pointerLocked: true,
	// ----------------
	inputVelocity: new THREE.Vector3(),
	euler: new THREE.Euler(),
	quaternion: new THREE.Quaternion(),
	mooving: false,
	rotating: false,
	moveForward: false,
	moveBackward: false,
	turnLeft: false,
	turnRight: false,
	shoot: false,
	lastShootTime: 0, // Temps du dernier tir
	shootCooldown: 0.6, // Délai minimum entre les tirs en secondes
	shootTypes: ['basic', 'basic_Lv2', 'basic_Lv3'],
	currentShootIndex: 0,
	isReversing: false,
	keyMap: {
		KeyW: false,
		KeyS: false,
		KeyA: false,
		KeyD: false,
		Space: false,
		KeyQ: false,
	},
	switchShootType: function () {
		this.currentShootIndex = (this.currentShootIndex + 1) % this.shootTypes.length;
	},
	onDocumentMouseDown: function (event) {
		if (event.button === 0) { // 0 = bouton gauche de la souris
			_player.shoot = true;
		}
	},
	onDocumentMouseUp: function (event) {
		if (event.button === 0) { // 0 = bouton gauche de la souris
			_player.shoot = false;
		}
	},
	onDocumentKey: function (e) {
		// console.log('e.code', e.code)
		if (e.type === "keydown" || e.type === "keyup") {
			_player.keyMap[e.code] = e.type === "keydown";
		}
		if (_player.pointerLocked) {
			_player.moveForward = _player.keyMap["KeyW"];
			_player.moveBackward = _player.keyMap["KeyS"];
			_player.turnLeft = _player.keyMap["KeyA"];
			_player.turnRight = _player.keyMap["KeyD"];
			// _player.shoot = _player.keyMap["Space"] || _player.keyMap["KeyQ"];

			// Condition pour changer le type de tir avec la barre d'espace
			if (e.code === "Space" && e.type === "keydown") {
				_player.switchShootType();
			}

		}
	},
	pointerManager: function () {
		document.addEventListener("pointerlockchange", () => {
			if (document.pointerLockElement === _scene.renderer.domElement) {
				_player.pointerLocked = true;

				_player.startButton.style.display = "none";
				_player.menuPanel.style.display = "none";
				this.instructionsPanel.style.display = "none";

				document.addEventListener("keydown", _player.onDocumentKey, false);
				document.addEventListener("keyup", _player.onDocumentKey, false);

				_scene.renderer.domElement.addEventListener("mousemove", _OrbitControls.onDocumentMouseMove, false);
				_scene.renderer.domElement.addEventListener("wheel", _OrbitControls.onDocumentMouseWheel, false);


				_scene.renderer.domElement.addEventListener("mousedown", _player.onDocumentMouseDown, false);
				_scene.renderer.domElement.addEventListener("mouseup", _player.onDocumentMouseUp, false);
			} else {

				_player.pointerLocked = false;

				_player.menuPanel.style.display = "block";

				document.removeEventListener("keydown", _player.onDocumentKey, false);
				document.removeEventListener("keyup", _player.onDocumentKey, false);


				_scene.renderer.domElement.removeEventListener("mousedown", _player.onDocumentMouseDown, false);
				_scene.renderer.domElement.removeEventListener("mouseup", _player.onDocumentMouseUp, false);

				_scene.renderer.domElement.removeEventListener(
					"mousemove",
					_OrbitControls.onDocumentMouseMove,
					false
				);
				_scene.renderer.domElement.removeEventListener(
					"wheel",
					_OrbitControls.onDocumentMouseWheel,
					false
				);

				setTimeout(() => {
					_player.startButton.style.display = "block";
					this.instructionsPanel.style.display = "block";
				}, 1000);
			}
		});
	},
	panelManager: function () {
		this.instructionsPanel = document.getElementById('instructions')
		this.menuPanel = document.createElement('div')
		this.startButton = document.createElement('div')
		this.menuPanel.id = 'menuPanel'
		this.startButton.id = 'startButton'
		this.startButton.textContent = 'startButton'
		this.menuPanel.appendChild(this.startButton)
		document.body.appendChild(this.menuPanel)
		this.startButton.addEventListener(
			"click",
			() => {
				_scene.renderer.domElement.requestPointerLock();
			},
			false
		);
	},
	checkMoves: function (delta) {
		this.inputVelocity = new THREE.Vector3(0, 0, 0);
		this.directionMultiplier = this.moveBackward ? -1 : 1;

		if (this.turnLeft) {
			this.playerTankMesh.rotation.y += delta * this.directionMultiplier;
			this.rotating = true;
		} else if (this.turnRight) {
			this.playerTankMesh.rotation.y -= delta * this.directionMultiplier;
			this.rotating = true;
		}
		if (this.moveBackward) {
			this.mooving = true;
			this.inputVelocity.z = -5 * delta;
		} else if (this.moveForward) {
			this.mooving = true;
			this.inputVelocity.z = 5 * delta;
		}
		if (this.shoot) {
			let done = _shoot.shoot(this.shootTypes[this.currentShootIndex]);
		}
		if (this.mooving === true || this.rotating === true) {
			this.playerTankMesh.translateZ(this.inputVelocity.z);
		}
		if (_sphereBleue.sphereRigidBody) {
			_sphereBleue.update();
		}
		else {
			console.log('BUG')
		}
	},
	init: function () {
		// this._physics = _physics
		_GLTFLoader.addModelsToScene(_scene.scene)

		this.playerTankMesh = clone(_GLTFLoader.models.tank1)
		this.playerTankMesh.position.set(0, .5, 0)
		this.playerSkin = this.playerTankMesh.children[0].children[0]
		this.playerTurret = this.playerTankMesh.children[0].children[3]
		// this.playerSkin.material.color.r = 1
		// this.playerSkin.material.color.g = 1
		// this.playerSkin.material.color.b = 1
		// this.playerTurret.material.color.r = 1
		// this.playerTurret.material.color.g = 1
		// this.playerTurret.material.color.b = 0

		_scene.scene.add(this.playerTankMesh)

		this.panelManager()
		this.pointerManager()
		// orbitControls.set_cameraPivot()


	}
}
export { _player }
