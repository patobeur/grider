import * as THREE from 'three'

// import ammo from 'three/addons/libs/ammo.wasm.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// import { ConvexObjectBreaker } from 'three/addons/misc/ConvexObjectBreaker.js';
// import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';


// import { _dataz } from "/three/js/dataz.js";
import { _cameras } from "/three/js/scene/cameras.js";
import { _formulas } from "/three/js/fonctions/formulas.js";
import { _renderer } from "/three/js/scene/renderer.js";
import { _floors } from "/three/js/scene/floors.js";
import { _namer } from "/three/js/fonctions/namer.js";
import { _soleil } from "/three/js/plustard/soleil.js";
import { Inputs } from "/three/js/Class/Inputs.js";
// import { _physics } from "/three/js/scene/physics.js";


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
	clock: new THREE.Clock(),
	inputs: new Inputs(),
	init: function (Ammo, target = false) {
		this.ammo = Ammo
		if (target != false) this.targetDiv = document.getElementById(target);


		this._initPhysicsWorld()
		this._initGraphicsWorld()

		this.inputs.init()
		// this.addACube()

		// base
		this.createCube(new THREE.Vector3(40, .5, 40), new THREE.Vector3(0, .25, 0), 0, 0xffffff, null);

		// falling cubes
		for (let index = 1; index < 101; index++) {
			let x = 0
			let y = 20 + index
			let z = 0
			let mass = 0.1
			let pos = new THREE.Vector3(x, y, z)
			let scales = new THREE.Vector3(1, 1, 1)
			let color = Math.random() * 0xffffff
			this.createCube(scales, pos, mass, color, null);
		}



	},
	actions: function (t) {
		let deltaTime = this.clock.getDelta();
		this.updatePhysicsUniverse(deltaTime);
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

	},













	// ------ Physics World setup ------

	_initPhysicsWorld: function () {
		this.tmpTransformation = new this.ammo.btTransform();

		var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
		var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
		var overlappingPairCache = new Ammo.btDbvtBroadphase();
		var solver = new Ammo.btSequentialImpulseConstraintSolver();

		this.physicsUniverse = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
		this.physicsUniverse.setGravity(new Ammo.btVector3(0, -75, 0));
	},
	updatePhysicsUniverse: function (deltaTime) {

		this.physicsUniverse.stepSimulation(deltaTime, 10);
		for (let i = 0; i < this.rigidBody_List.length; i++) {

			let Graphics_Obj = this.rigidBody_List[i];
			let Physics_Obj = Graphics_Obj.userData.physicsBody;

			let motionState = Physics_Obj.getMotionState();

			if (motionState) {

				motionState.getWorldTransform(this.tmpTransformation);
				let new_pos = this.tmpTransformation.getOrigin();
				let new_qua = this.tmpTransformation.getRotation();
				Graphics_Obj.position.set(new_pos.x(), new_pos.y(), new_pos.z());
				Graphics_Obj.quaternion.set(new_qua.x(), new_qua.y(), new_qua.z(), new_qua.w());
			}
		}
	},
	createCube: function (scale, position, mass, color, rotation_q) {

		const geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z)
		const material = new THREE.MeshPhongMaterial({ color: color })

		let quaternion = undefined;
		if (rotation_q == null) {
			quaternion = { x: 0, y: 0, z: 0, w: 1 };
		}
		else {
			quaternion = rotation_q;
		}

		// ------ Graphics Universe - Three.JS ------
		let newcube = new THREE.Mesh(geometry, material);
		newcube.position.set(position.x, position.y, position.z);
		newcube.name = 'cube'
		newcube.castShadow = true;
		newcube.receiveShadow = true;


		// ------ Physics Universe - Ammo.js ------
		// let transform = this.physics.get_btTransform()
		let transform = new this.ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new this.ammo.btVector3(position.x, position.y, position.z));
		transform.setRotation(new this.ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));

		let defaultMotionState = new this.ammo.btDefaultMotionState(transform);

		let structColShape = new this.ammo.btBoxShape(new this.ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
		structColShape.setMargin(0.05);

		let localInertia = new this.ammo.btVector3(0, 0, 0);
		structColShape.calculateLocalInertia(mass, localInertia);

		let RBody_Info = new this.ammo.btRigidBodyConstructionInfo(mass, defaultMotionState, structColShape, localInertia);
		let RBody = new this.ammo.btRigidBody(RBody_Info);

		this.physicsUniverse.addRigidBody(RBody);

		newcube.userData.physicsBody = RBody;

		this.rigidBody_List.push(newcube);

		_scene.scene.add(newcube)
	},

};

