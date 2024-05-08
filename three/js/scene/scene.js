import * as THREE from 'three'

// import ammo from 'three/addons/libs/ammo.wasm.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// import { ConvexObjectBreaker } from 'three/addons/misc/ConvexObjectBreaker.js';
// import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';


// import { _dataz } from "/three/js/dataz.js";
import { _cameras } from "/three/js/scene/cameras.js";
import { _renderer } from "/three/js/scene/renderer.js";
import { _floors } from "/three/js/scene/floors.js";
import { _namer } from "/three/js/fonctions/namer.js";
import { _soleil } from "/three/js/plustard/soleil.js";
import { Inputs } from "/three/js/Class/Inputs.js";


export let _scene = {
	name: _namer.getName('_scene'),
	// ------------------------------
	// Ammo.js
	tmpTransformation: undefined,
	rigidBody_List: new Array(),
	physicsUniverse: undefined,
	clock: undefined,
	// Three.js
	scene: new THREE.Scene(),
	camera: null,
	renderer: null,
	clock: undefined,
	inputs: new Inputs(),
	actions: function () {
		// this.cube.rotation.x += 0.01
		// this.cube.rotation.y += 0.01
		// this.scene.rotation.y -= 0.01
		// _soleil.rotation()
		// let deltaTime = this.clock.getDelta();
		// this.updatePhysicsUniverse(deltaTime);
		_soleil.animate()
		_renderer.renderer.render(_scene.scene, _scene.camera)
	},
	init: function (target = false) {
		if (target != false) this.targetDiv = document.getElementById(target);

		this._initGraphicsWorld()

		this.inputs.init()
		this.addACube()
	},
	_initGraphicsWorld: function () {
		this._sets = {
			clock: () => {
				this.clock = new THREE.Clock();
			},
			renderer: () => {
				_renderer.init(this.targetDiv)
				// this.renderer = _renderer.renderer
			},
			cameras: () => {
				_cameras.init('main');
				_cameras.add('test');
				this.camera = _cameras.getCameraByName('main')
				_renderer.renderer.render(this.scene, this.camera);
				// console.log(_cameras.camerasByName)
			},
			controls: () => {
				this.controls = new OrbitControls(this.camera, _renderer.renderer.domElement)
			},
			loader: () => {
				this.loader = new GLTFLoader()
			},
			// addCube: () => {
			// 	// Cube
			// 	const geometry = new THREE.BoxGeometry(1, 1, 1)
			// 	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
			// 	this.cube = new THREE.Mesh(geometry, material)
			// 	this.cube.position.y = .5
			// 	this.cube.name = 'cube'
			// 	this.cube.castShadow = true;
			// 	this.cube.receiveShadow = true;
			// 	this.scene.add(this.cube)
			// },
			floor: () => {
				_floors.init(this.scene)
			},
			lights: () => {
				const ambientLight = new THREE.AmbientLight(0xbbbbbb);
				this.scene.add(ambientLight);

				_soleil.init()

			},
			// vr: () => {
			// 	_vr.init()
			// 	_vr.renderCamera();
			// 	// this.controller = _renderer.renderer.xr.getController(0);
			// 	// // this.controller.addEventListener('select', onSelect);
			// 	// this.scene.add(this.controller);
			// }

			addEventsListeners: () => {
				window.addEventListener("resize", () => {

					const newWidth = window.innerWidth;
					const newHeight = window.innerHeight;

					this.camera.aspect = newWidth / newHeight;
					this.camera.updateProjectionMatrix();
					_renderer.renderer.setSize(newWidth, newHeight);
				});
			},
		};
		for (const key in this._sets) {
			if (Object.hasOwnProperty.call(this._sets, key)) {
				this._sets[key](this);
			}
		}

	},
	actions: function () {
		_soleil.animate()
		_renderer.renderer.render(_scene.scene, _scene.camera)
	},
	addACube: function () {
		const geometry = new THREE.BoxGeometry(1, 1, 1)
		// const material = new THREE.MeshBasicMaterial({ color: color })
		const material = new THREE.MeshPhongMaterial({ color: 0xFF0000 })
		let cube = new THREE.Mesh(geometry, material)
		cube.position.y = .5
		cube.name = 'cube'
		cube.castShadow = true;
		cube.receiveShadow = true;
		this.scene.add(cube)

	}
};

