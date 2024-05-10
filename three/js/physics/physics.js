import * as THREE from "three";
import { _namer } from "/three/js/fonctions/namer.js";

export let _physics = {
	name: _namer.getName('_physics'),

	// Ammo.js
	gravity: new THREE.Vector3(0, -1, 0),
	inertia: new THREE.Vector3(0, 0, 0),
	tmpTransformation: undefined,
	physicsWorld: undefined,
	rigidBody_List: new Array(),

	// ------ Physics World setup ------
	_initPhysicsWorld: function () {
		this.tmpTransformation = new Ammo.btTransform();
		var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
		var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
		var overlappingPairCache = new Ammo.btDbvtBroadphase();
		var solver = new Ammo.btSequentialImpulseConstraintSolver();

		this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
		this.physicsWorld.setGravity(new Ammo.btVector3(this.gravity.x, this.gravity.y, this.gravity.z));
	},
	updatePhysicsWorld: function (deltaTime) {

		this.physicsWorld.stepSimulation(deltaTime, 10);
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
	// SHAPE > BOX
	MeshesAndShapes: {
		get_aBox: (scale, position, mass, color, rotation_q) => {
			// ------ Graphics World - Three.JS ------
			const geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z)
			const material = new THREE.MeshPhongMaterial({ color: color })

			let box = new THREE.Mesh(geometry, material);
			box.position.set(position.x, position.y, position.z);
			box.rotateY(Math.Pi / 4);
			box.castShadow = true;
			box.receiveShadow = true;

			const geometry2 = new THREE.BoxGeometry(.2, .2, .2)
			const material2 = new THREE.MeshPhongMaterial({ color: 0x000000 })
			let newMesh2 = new THREE.Mesh(geometry2, material2);
			newMesh2.castShadow = true;
			newMesh2.receiveShadow = true;
			box.add(newMesh2)
			newMesh2.position.y = scale.y / 2;

			return box
		},
		get_aBoxShape: function (scale, position, mass, color, rotation_q, localInertia) {
			let structColShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
			structColShape.setMargin(0.05);
			structColShape.calculateLocalInertia(mass, localInertia);
			return structColShape
		},
	},
	// communs
	_localInertia: function (rotation_q) {
		return new Ammo.btVector3(this.inertia.x, this.inertia.y, this.inertia.z);
	},
	_transform: function (position, quaternion) {
		let transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
		transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
		return transform
	},
	_quaternion: function (rotation_q) {

		let quaternion = undefined;
		if (rotation_q == null) {
			quaternion = { x: 0, y: 0, z: 0, w: 1 };
		}
		else {
			quaternion = rotation_q;
		}
		return quaternion
	},
	// communs
	// ---------------------------------------------------
	createMesh: function (scale, position, mass, color, rotation_q, categorie) {
		// console.log(categorie)
		let catMesh = undefined
		let catShape = undefined
		let types = ['Box', 'Floor', 'Sphere']
		if (types.includes(categorie)) {
			catMesh = 'get_a' + categorie
			catShape = catMesh + 'Shape'

			let quaternion = this._quaternion(rotation_q)
			// ------ Physics World - Ammo.js ------
			let transform = this._transform(position, quaternion)
			let localInertia = this._localInertia()
			// ------ Graphics World - Three.JS ------

			// BOX
			let newMesh = this.MeshesAndShapes[catMesh](scale, position, mass, color, rotation_q)
			let structColShape = this.MeshesAndShapes[catShape](scale, position, mass, color, rotation_q, localInertia)


			// --
			let defaultMotionState = new Ammo.btDefaultMotionState(transform);

			let RBody_Info = new Ammo.btRigidBodyConstructionInfo(mass, defaultMotionState, structColShape, localInertia);
			let RBody = new Ammo.btRigidBody(RBody_Info);

			this.physicsWorld.addRigidBody(RBody);
			newMesh.userData.physicsBody = RBody;

			this.rigidBody_List.push(newMesh);
			return newMesh
		}
	},
};
