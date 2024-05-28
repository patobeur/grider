import * as THREE from "three";

let _physics = {
	// Ammo.js
	gravity: new THREE.Vector3(0, -9.810, 0),
	inertia: new THREE.Vector3(0, 0, 0),
	tmpTransformation: undefined,
	physicsWorld: undefined,
	rigidBody_List: new Array(),
	playerTankBox: undefined,
	friction: 0.5, // Friction ajoutée
	restitution: 0.1,  // Restitution ajoutée

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
	updateWorldPhysics2: function (deltaTime) {
		this.physicsWorld.stepSimulation(deltaTime, 10);
		for (let i = 0; i < this.rigidBody_List.length; i++) {
			let Graphics_Obj = this.rigidBody_List[i];
			let Physics_Obj = Graphics_Obj.userData.physicsBody;
			let motionState = Physics_Obj.getMotionState();
			// console.log(Graphics_Obj.userData.update)
			// Activer les objets physiques pour qu'ils réagissent correctement
			Physics_Obj.activate();

			if (Graphics_Obj.userData.update) Graphics_Obj.userData.update(Graphics_Obj, deltaTime)

			if (motionState) {
				motionState.getWorldTransform(this.tmpTransformation);
				let new_pos = this.tmpTransformation.getOrigin();
				let new_qua = this.tmpTransformation.getRotation();
				Graphics_Obj.position.set(new_pos.x(), new_pos.y(), new_pos.z());
				Graphics_Obj.quaternion.set(new_qua.x(), new_qua.y(), new_qua.z(), new_qua.w());
			}

		}
	},
	updateWorldPhysics: function (deltaTime) {
		this.physicsWorld.stepSimulation(deltaTime, 10);
		for (let i = 0; i < this.rigidBody_List.length; i++) {
			let Graphics_Obj = this.rigidBody_List[i];
			let Physics_Obj = Graphics_Obj.userData.physicsBody;
			let motionState = Physics_Obj.getMotionState();

			// Activer les objets physiques pour qu'ils réagissent correctement
			if (Graphics_Obj.userData.update) Graphics_Obj.userData.update(Graphics_Obj, deltaTime)

			Physics_Obj.activate();



			if (motionState) {
				motionState.getWorldTransform(this.tmpTransformation);
				let new_pos = this.tmpTransformation.getOrigin();
				let new_qua = this.tmpTransformation.getRotation();
				Graphics_Obj.position.set(new_pos.x(), new_pos.y(), new_pos.z());
				Graphics_Obj.quaternion.set(new_qua.x(), new_qua.y(), new_qua.z(), new_qua.w());
			}
		}
	},
	// ---------------------------------------------------
	// MESHS CREATION
	// ---------------------------------------------------
	add_MarkerTo: (mesh, scale, name = 'vide') => {
		const markerGeometry = new THREE.BoxGeometry(.2, .2, .2)
		const markerMaterial = new THREE.MeshPhongMaterial({ color: ((name === 'vide') ? 0x000000 : 0x00ff00) })
		let markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
		markerMesh.name = 'marker'
		markerMesh.rotation.y = Math.PI / 4
		markerMesh.castShadow = true;
		markerMesh.receiveShadow = true;
		mesh.add(markerMesh)
		markerMesh.position.y = (scale.y / 2) + (.1);
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
	createMesh: function (datasSizes, position, mass, color, rotation_q, categorie, name = 'vide') {
		let quaternion = this._quaternion(rotation_q);
		let mesh = undefined
		let scale = datasSizes.v3;
		let geometry, material, shape;
		if (categorie === 'Box') {
			geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z);
			material = new THREE.MeshPhongMaterial({
				color: color,
			});
			shape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
			mesh = new THREE.Mesh(geometry, material);
			this.add_MarkerTo(mesh, scale, name);
			mesh.position.set(position.x, position.y, position.z);
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			mesh.userData.update = (mesh, time) => {
				mesh.children[0].position.y += Math.sin(time * 1) * 0.1;
			};


		} else if (categorie === 'Sphere') {
			geometry = new THREE.SphereGeometry(scale.x / 2, 8, 8);
			material = new THREE.MeshBasicMaterial({ color: color });
			shape = new Ammo.btSphereShape(scale.x * 0.5);
			mesh = new THREE.Mesh(geometry, material);
		}

		mesh.name = 'Phys_' + name;

		let transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
		transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));

		let localInertia = new Ammo.btVector3(0, 0, 0);
		shape.calculateLocalInertia(mass, localInertia);

		let motionState = new Ammo.btDefaultMotionState(transform);
		let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
		let body = new Ammo.btRigidBody(rbInfo);


		this.physicsWorld.addRigidBody(body);
		mesh.userData.physicsBody = body;


		if (name === "TankBox" || name === "sphereBleue") {
			if (typeof datasSizes.datas !== 'undefined') {
				if (datasSizes.datas.mat.transparent && datasSizes.datas.mat.opacity) {
					mesh.material.transparent = true;
					mesh.material.opacity = datasSizes.datas.mat.opacity;
				}
			}
			this.playerTankBox = mesh;
			// Ajouter des propriétés physiques supplémentaires
			body.setFriction(1);
			body.setRestitution(1);
		}
		else {
			// Ajouter des propriétés physiques supplémentaires
			body.setFriction(this.friction);
			body.setRestitution(this.friction);

		}


		this.rigidBody_List.push(mesh);

		return mesh;
	},
	meshsByName: {},
	objs: [
		// { datasSizes: { v3: new THREE.Vector3(1.4, 1.5, 1.8), datas: false }, pos: new THREE.Vector3(0, 0.75, 0), mass: 10, color: 0xffffff, rotation_q: null, categorie: 'Box', name: 'TankBox', tag: 'player' },
		{ datasSizes: { v3: new THREE.Vector3(45, .5, 45), datas: false }, pos: new THREE.Vector3(0, -.25, 0), mass: 0, color: 0xffffff, rotation_q: null, categorie: 'Box', name: 'Floor_Lv0', tag: 'floor' },
		{ datasSizes: { v3: new THREE.Vector3(1, 1, 1), datas: false }, pos: new THREE.Vector3(-5, 2, 5), mass: 1, color: 0x00ffff, rotation_q: null, categorie: 'Box', name: 'plot_NW', tag: 'plot' },
		{ datasSizes: { v3: new THREE.Vector3(1, 1, 1), datas: false }, pos: new THREE.Vector3(-5, 22, -5), mass: 1, color: 0xffff00, rotation_q: null, categorie: 'Box', name: 'plot_SW', tag: 'plot' },
		{ datasSizes: { v3: new THREE.Vector3(1, 1, 1), datas: false }, pos: new THREE.Vector3(5, 0.5, -5), mass: 1, color: 0xffff00, rotation_q: null, categorie: 'Box', name: 'plot_SE', tag: 'plot' },
		{ datasSizes: { v3: new THREE.Vector3(1, 1, 1), datas: false }, pos: new THREE.Vector3(5, 0.5, 5), mass: 1, color: 0xffff00, rotation_q: null, categorie: 'Box', name: 'plot_NE', tag: 'plot' },
		{ datasSizes: { v3: new THREE.Vector3(40, 50, .5), datas: false }, pos: new THREE.Vector3(0, 25, -19.75), mass: 0, color: 0xffffff, rotation_q: null, categorie: 'Box', name: 'wall_south', tag: 'wallext' },
		{ datasSizes: { v3: new THREE.Vector3(40, 50, .5), datas: false }, pos: new THREE.Vector3(0, 25, 19.75), mass: 0, color: 0xffffff, rotation_q: null, categorie: 'Box', name: 'wall_north', tag: 'wallext' },
		{ datasSizes: { v3: new THREE.Vector3(.5, 50, 39), datas: false }, pos: new THREE.Vector3(19.75, 25, 0), mass: 0, color: 0xffffff, rotation_q: null, categorie: 'Box', name: 'wall_est', tag: 'wallext' },
		{ datasSizes: { v3: new THREE.Vector3(.5, 50, 39), datas: false }, pos: new THREE.Vector3(-19.75, 25, 0), mass: 0, color: 0xffffff, rotation_q: null, categorie: 'Box', name: 'wall_west', tag: 'wallext' },
	],
	addThemAll: function (_scene) {
		for (let index = 0; index < this.objs.length; index++) {
			const element = this.objs[index];
			let newcube = _physics.createMesh(element.datasSizes, element.pos, element.mass, element.color, element.rotation_q, element.categorie, element.name)
			this.meshsByName[element.name] = newcube
			_scene.scene.add(newcube)
		}
	},
}
export { _physics }
