import * as THREE from "three";
import { _namer } from "/three/js/fonctions/namer.js";

export let _physics = {
	name: _namer.getName('_physics'),

	// Ammo.js
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
		this.physicsWorld.setGravity(new Ammo.btVector3(0, -75, 0));
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

		// ------ Graphics World - Three.JS ------
		let newcube = new THREE.Mesh(geometry, material);
		newcube.position.set(position.x, position.y, position.z);
		newcube.name = 'cube'
		newcube.castShadow = true;
		newcube.receiveShadow = true;


		// ------ Physics World - Ammo.js ------
		// let transform = this.physics.get_btTransform()
		let transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
		transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));

		let defaultMotionState = new Ammo.btDefaultMotionState(transform);

		let structColShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
		structColShape.setMargin(0.05);

		let localInertia = new Ammo.btVector3(0, 0, 0);
		structColShape.calculateLocalInertia(mass, localInertia);

		let RBody_Info = new Ammo.btRigidBodyConstructionInfo(mass, defaultMotionState, structColShape, localInertia);
		let RBody = new Ammo.btRigidBody(RBody_Info);

		_physics.physicsWorld.addRigidBody(RBody);

		newcube.userData.physicsBody = RBody;

		_physics.rigidBody_List.push(newcube);

		return newcube
	},
};
