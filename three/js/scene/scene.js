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
import { _vr } from "/three/js/fonctions/vr.js";
import { _namer } from "/three/js/fonctions/namer.js";
import { _formulas } from "/three/js/fonctions/formulas.js";
import { _physics } from "/three/js/physics/physics.js";


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
		this.OrbControls.update();
		_renderer.renderer.render(_scene.scene, _scene.camera)
	},
	_initGraphicsWorld: function () {
		this._sets = {
			clock: () => {
				_renderer.init(this.targetDiv)

				_cameras.init('main');
				_cameras.add('test'); // only for futurs tests of sliding to camera to camera
				this.camera = _cameras.getCameraByName('main')

				_renderer.renderer.render(this.scene, this.camera);

				this.OrbControls = new OrbitControls(this.camera, _renderer.renderer.domElement)
				this.OrbControls.enablePan = false;
				// this.OrbControls.enableRotate = false;
				this.OrbControls.maxPolarAngle = Math.PI / 2;
				this.OrbControls.minDistance = 2;
				this.OrbControls.maxDistance = this.camera.position.z * 2;

				// plus de vitesse ou de smooth
				this.OrbControls.enableDamping = true;
				this.OrbControls.dampingFactor = 0.09;

				this.loader = new GLTFLoader()
			},
			addCube: () => {

				let floorCube = _physics.createMesh(new THREE.Vector3(40, .5, 40), new THREE.Vector3(0, -.25, 0), 0, 0xffffff, null, 'Box');
				this.scene.add(floorCube)


				// let floorCube2 = _physics.createMesh(new THREE.Vector3(40, 1, 40), new THREE.Vector3(0, -1, 0), 0, 0x000000, null, 'Box');
				// this.scene.add(floorCube2)


				let hauteurdesmurs = 1
				let frontCube = _physics.createMesh(new THREE.Vector3(40, hauteurdesmurs, .5), new THREE.Vector3(0, hauteurdesmurs / 2, -19.75), 0, 0xffffff, null, 'Box');
				let backCube = _physics.createMesh(new THREE.Vector3(40, hauteurdesmurs, .5), new THREE.Vector3(0, hauteurdesmurs / 2, 19.75), 0, 0xffffff, null, 'Box');
				let leftCube = _physics.createMesh(new THREE.Vector3(.5, hauteurdesmurs, 39), new THREE.Vector3(19.75, hauteurdesmurs / 2, 0), 0, 0xffffff, null, 'Box');
				let rightCube = _physics.createMesh(new THREE.Vector3(.5, hauteurdesmurs, 39), new THREE.Vector3(-19.75, hauteurdesmurs / 2, 0), 0, 0xffffff, null, 'Box');
				this.scene.add(frontCube, backCube, leftCube, rightCube)


				let kubes = this.addcubes;
				kubes.init()
			},
			floor: () => {
				// _floors.init(this.scene)
			},
			lights: () => {
				const ambientLight = new THREE.AmbientLight(0xbbbbbb);
				this.scene.add(ambientLight);

				_soleil.init()

			},
			vr: () => {
				_vr.init()
				_vr.renderCamera();
				_vr.addVRButton()
				// this.controller = _renderer.renderer.xr.getController(0);
				// // this.controller.addEventListener('select', onSelect);
				// this.scene.add(this.controller);
			},

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

	addcubes: {
		// falling cubes
		i: 0,
		max: 25,
		mass: 0.1,
		scales: new THREE.Vector3(1, 1, 1),
		color: Math.random() * 0xffffff,
		// color: this.getRaggaeColors(),
		init: function () {
			this.setInterval = setInterval(() => { this.add() }, 100);
		},
		getRaggaeColors: function () {
			let rand = _formulas.rand(0, 2)
			console.log(rand)
			return [0xff0000, 0xffff00, 0x00ff00][rand]
		},
		add: function () {
			console.log('addcubes')
			this.color = this.getRaggaeColors()//Math.random() * 0xffffff;
			this.pos = new THREE.Vector3(
				_formulas.rand(-15, 15),
				10,
				_formulas.rand(-15, 15)
			);
			let newcube = _physics.createMesh(this.scales, this.pos, this.mass, this.color, null, 'Box')

			_scene.scene.add(newcube)

			this.i++
			if (this.i >= this.max) {
				clearInterval(this.setInterval)
				console.log('End cubes')
			};
		},
	},

};

