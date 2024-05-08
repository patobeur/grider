import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// import { ConvexObjectBreaker } from 'three/addons/misc/ConvexObjectBreaker.js';
// import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';

import { Inputs } from "/three/js/Class/Inputs.js";
import { _cameras } from "/three/js/scene/cameras.js";
import { _renderer } from "/three/js/scene/renderer.js";
import { _floors } from "/three/js/scene/floors.js";
import { _soleil } from "/three/js/scene/soleil.js";
import { _namer } from "/three/js/fonctions/namer.js";
import { _formulas } from "/three/js/fonctions/formulas.js";
import { _physics } from "/three/js/scene/physics.js";


export let _scene = {
	name: _namer.getName('_scene'),
	// ------------------------------
	clock: new THREE.Clock(),

	// Three.js
	scene: new THREE.Scene(),
	camera: null,
	renderer: null,
	inputs: new Inputs(),
	init: function (target = false) {
		if (target != false) this.targetDiv = document.getElementById(target);


		_physics._initPhysicsWorld()
		this._initGraphicsWorld()

		this.inputs.init()




	},
	actions: function (deltaTime) {
		_physics.updatePhysicsWorld(deltaTime);
		_soleil.animate()
		_renderer.renderer.render(_scene.scene, _scene.camera)
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
			addCube: () => {
				// 	// Cube
				// 	const geometry = new THREE.BoxGeometry(1, 1, 1)
				// 	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
				// 	this.cube = new THREE.Mesh(geometry, material)
				// 	this.cube.position.y = .5
				// 	this.cube.name = 'cube'
				// 	this.cube.castShadow = true;
				// 	this.cube.receiveShadow = true;
				// 	this.scene.add(this.cube)

				let floorCube = _physics.createCube(new THREE.Vector3(40, .5, 40), new THREE.Vector3(0, .25, 0), 0, 0xffffff, null);
				this.scene.add(floorCube)

				let frontCube = _physics.createCube(new THREE.Vector3(40, 1, .5), new THREE.Vector3(0, 1, -19.75), 0, 0xffffff, null);
				let backCube = _physics.createCube(new THREE.Vector3(40, 1, .5), new THREE.Vector3(0, 1, 19.75), 0, 0xffffff, null);
				let leftCube = _physics.createCube(new THREE.Vector3(.5, 1, 39), new THREE.Vector3(19.75, 1, 0), 0, 0xffffff, null);
				let rightCube = _physics.createCube(new THREE.Vector3(.5, 1, 39), new THREE.Vector3(-19.75, 1, 0), 0, 0xffffff, null);
				this.scene.add(frontCube, backCube, leftCube, rightCube)

				// falling cubes
				for (let index = 1; index < 1001; index++) {
					let x = 0
					let y = 20 + index
					let z = 0
					let mass = 0.1
					let pos = new THREE.Vector3(x, y, z)
					let scales = new THREE.Vector3(1, 1, 1)
					let color = Math.random() * 0xffffff
					let newcube = _physics.createCube(scales, pos, mass, color, null);
					this.scene.add(newcube)
				}
			},
			floor: () => {
				// _floors.init(this.scene)
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

	}
};

