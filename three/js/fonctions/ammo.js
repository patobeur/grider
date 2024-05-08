import * as THREE from "three";
import { _dataz } from "/three/js/dataz.js";
import { _namer } from "/three/js/fonctions/namer.js";
export let _ammo = {
	name: _namer.getName('_ammo'),
	// Ammo.js
	tmpTransformation: undefined,
	rigidBody_List: new Array(),
	physicsUniverse: undefined,
	clock: undefined,
	ammo: undefined,
	init: function () {
		// _ammo.ammo.then(
		this.ammoStart()
		// );
	},
	ammoStart: function () {
		console.log('ff', Ammo)
		console.log('ok')
		// this.tmpTransformation = new _ammo.ammo.btTransform();
		this.tmpTransformation = new Ammo.btTransform();

		this.initPhysicsUniverse();

		// base
		this.createCube(40, new THREE.Vector3(10, -30, 10), 0);

		// falling cubes
		this.createCube(4, new THREE.Vector3(0, 10, 0), 1, null);
		this.createCube(2, new THREE.Vector3(10, 30, 0), 1, null);
		this.createCube(4, new THREE.Vector3(10, 20, 10), 1, null);
		this.createCube(6, new THREE.Vector3(5, 40, 20), 1, null);
		this.createCube(8, new THREE.Vector3(25, 100, 5), 1, null);
		this.createCube(8, new THREE.Vector3(20, 60, 25), 1, null);
		this.createCube(4, new THREE.Vector3(20, 100, 25), 1, null);
		this.createCube(2, new THREE.Vector3(20, 200, 25), 1, null);
		console.log(this.rigidBody_List)
		// render();
	},
	// ------ Phisics World setup ------
	initPhysicsUniverse: function () {
		var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
		var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
		var overlappingPairCache = new Ammo.btDbvtBroadphase();
		var solver = new Ammo.btSequentialImpulseConstraintSolver();

		this.physicsUniverse = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
		this.physicsUniverse.setGravity(new Ammo.btVector3(0, -75, 0));
	},
















	// // ------ Phisics World setup ------
	// initPhysicsUniverse: function () {

	// 	var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
	// 	var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
	// 	var overlappingPairCache = new Ammo.btDbvtBroadphase();
	// 	var solver = new Ammo.btSequentialImpulseConstraintSolver();

	// 	this.physicsUniverse = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
	// 	this.physicsUniverse.setGravity(new Ammo.btVector3(0, -75, 0));
	// 	console.log('initPhysicsUniverse ok')
	// },
	createCube: function (scale, position, mass, rot_quaternion) {
		let quaternion = undefined;
		if (rot_quaternion == null) {
			quaternion = { x: 0, y: 0, z: 0, w: 1 };
		}
		else {
			quaternion = rot_quaternion;
		}

		// ------ Graphics Universe - Three.JS ------
		let newcube = new THREE.Mesh(new THREE.BoxGeometry(scale, scale, scale), new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff }));
		newcube.position.set(position.x, position.y, position.z);
		this.scene.add(newcube);

		// ------ Physics Universe - Ammo.js ------
		let transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
		transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
		let defaultMotionState = new Ammo.btDefaultMotionState(transform);

		let structColShape = new Ammo.btBoxShape(new Ammo.btVector3(scale * 0.5, scale * 0.5, scale * 0.5));
		structColShape.setMargin(0.05);

		let localInertia = new Ammo.btVector3(0, 0, 0);
		structColShape.calculateLocalInertia(mass, localInertia);

		let RBody_Info = new Ammo.btRigidBodyConstructionInfo(mass, defaultMotionState, structColShape, localInertia);
		let RBody = new Ammo.btRigidBody(RBody_Info);

		this.physicsUniverse.addRigidBody(RBody);

		newcube.userData.physicsBody = RBody;
		this.rigidBody_List.push(newcube);
	}
};

