"use strict";
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
let _player = {
	keys: {},
	playerModel: undefined,
	init: function (_GLTFLoader, scene) {
		// this.playerModel = _GLTFLoader.models
		_GLTFLoader.addModelsToScene(scene)
		let tempoMesh = _GLTFLoader.models.tank2
		this.playerModel = clone(tempoMesh)

		// SkeletonUtils.clone(), 
		// this.playerModel.name = 'playerOne'
		console.log(this.playerModel)
		// this.playerModel.children[0].material.color.r = 0
		// this.playerModel.children[0].material.color.g = 0
		// this.playerModel.children[0].material.color.b = 0.2
		// this.playerModel.children[0].children[3].material.color.r = 1
		// this.playerModel.children[0].children[3].material.color.g = 1
		// this.playerModel.children[0].children[3].material.color.b = 1
		this.playerModel.position.set(0, 0, 0)
		scene.add(this.playerModel)
		console.log('playerModel', this.playerModel)
	},
	moveManager: function () {
		this.vectorV = new THREE.Vector3();
		this.inputVelocity = new THREE.Vector3();
		this.euler = new THREE.Euler();
		this.quaternion = new THREE.Quaternion();
		this.onDocumentMouseMove = (e) => {
			this.yaw.rotation.y -= e.movementX * 0.002;
			const v = this.pitch.rotation.x - e.movementY * 0.002;
			if (v > -1 && v < 0.1) {
				this.pitch.rotation.x = v;
			}
			return false;
		}
		this.onDocumentMouseWheel = (e) => {
			console.log(_scene.camera)
			const v = _scene.camera.position.z + e.deltaY * 0.005;
			if (v >= 2 && v <= 10) {
				_scene.camera.position.z = v;
			}
			return false;
		}
		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.keyMap = {};
		this.onDocumentKey = (e) => {
			this.keyMap[e.code] = e.type === "keydown";
			if (this.pointerLocked) {
				this.moveForward = this.keyMap["KeyW"];
				this.moveBackward = this.keyMap["KeyS"];
				this.moveLeft = this.keyMap["KeyA"];
				this.moveRight = this.keyMap["KeyD"];
			}
		};

	},
};
export { _player }
