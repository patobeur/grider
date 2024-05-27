import * as THREE from "three";

let _physics = {
	// Ammo.js
	gravity: new THREE.Vector3(0, -9.810, 0),
	inertia: new THREE.Vector3(0, 0, 0),
	tmpTransformation: undefined,
	physicsWorld: undefined,
	rigidBody_List: new Array(),
	playerTankBox: undefined,

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
	iii: 0,
	infomax: 0,
	updateWorldPhysics: function (deltaTime) {
		this.physicsWorld.stepSimulation(deltaTime, 10);
		for (let i = 0; i < this.rigidBody_List.length; i++) {
			let Graphics_Obj = this.rigidBody_List[i];
			let Physics_Obj = Graphics_Obj.userData.physicsBody;
			// if (i === 2 && this.iii < 3) { console.log(Graphics_Obj); this.iii++ }
			let motionState = Physics_Obj.getMotionState();

			// Graphics_Obj.userData.update(Graphics_Obj, deltaTime)


			if (motionState) {

				if (this.infomax < this.rigidBody_List.length) {
					console.log('G', Graphics_Obj.name); this.infomax++;
				}
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
	add_MarkerTo: (mesh, scale) => {
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
	createMesh: function (datasSizes, position, mass, color, rotation_q, categorie, name = 'vide') {
		let scale = datasSizes.v3
		let geometry, material, shape;
		if (categorie === 'Box') {
			geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z);
			material = new THREE.MeshPhongMaterial({ color: color });
			shape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
		} else if (categorie === 'Sphere') {
			geometry = new THREE.SphereGeometry(scale.x / 2, 8, 8);
			material = new THREE.MeshBasicMaterial({ color: color });
			shape = new Ammo.btSphereShape(scale.x * 0.5);
		}//  else if (categorie === 'Cylinder') {
		// 	geometry = new THREE.CylinderGeometry(scale.x / 2, scale.x / 2, 1, 1);
		// 	material = new THREE.MeshBasicMaterial({ color: color });
		// 	shape = new Ammo.btCylinderShape(scale.x * 0.5);
		// } else if (categorie === 'Dodecahedron') {
		// 	geometry = new THREE.DodecahedronGeometry(scale.x / 2);
		// 	material = new THREE.MeshBasicMaterial({ color: color });
		// 	shape = new Ammo.btDodecahedronShape(scale.x * 0.5);
		// }

		// 			geo = new THREE.CylinderGeometry(0.5, 0.5, 1, 1)
		let mesh = new THREE.Mesh(geometry, material);
		this.add_MarkerTo(mesh, scale, name)
		mesh.position.set(position.x, position.y, position.z);
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		let transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
		shape.calculateLocalInertia(mass, this.inertia);
		let motionState = new Ammo.btDefaultMotionState(transform);
		let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, this.inertia);
		let body = new Ammo.btRigidBody(rbInfo);

		this.physicsWorld.addRigidBody(body);
		mesh.userData.physicsBody = body;
		mesh.name = 'Phys_' + name
		mesh.userData.update = (mesh, time) => {
			mesh.children[0].position.y += Math.sin(time) * 0.1
			// console.log(mesh.children[0].position)
		}
		this.rigidBody_List.push(mesh);

		if (name === "TankBox") {
			mesh.material.transparent = true
			mesh.material.opacity = .5

			this.playerTankBox = mesh;
		}

		return mesh;
	},

	updatePlayerPhysics: function (playerTankMesh) {
		let tankPosition = playerTankMesh.position;
		let tankQuaternion = playerTankMesh.quaternion;
		let physicsBody = this.playerTankBox.userData.physicsBody;

		let motionState = physicsBody.getMotionState();
		if (motionState) {
			let transform = new Ammo.btTransform();
			motionState.getWorldTransform(transform);

			transform.setOrigin(new Ammo.btVector3(tankPosition.x, tankPosition.y, tankPosition.z));
			transform.setRotation(new Ammo.btQuaternion(tankQuaternion.x, tankQuaternion.y, tankQuaternion.z, tankQuaternion.w));

			motionState.setWorldTransform(transform);
			this.playerTankBox.position.copy(tankPosition);
			this.playerTankBox.quaternion.copy(tankQuaternion);

		}
	},
};
let _physicsHydrate = {
	meshsByName: {},
	objs: [
		{ datasSizes: { v3: new THREE.Vector3(1.4, 1.5, 1.8), datas: false }, pos: new THREE.Vector3(0, 2.6, 0), mass: 1, color: 0xffffff, rotation_q: null, categorie: 'Box', name: 'TankBox' },
		{ datasSizes: { v3: new THREE.Vector3(45, .5, 45), datas: false }, pos: new THREE.Vector3(0, -.25, 0), mass: 0, color: 0xffffff, rotation_q: null, categorie: 'Box', name: 'Floor_Lv0' },
		{ datasSizes: { v3: new THREE.Vector3(1, 1, 1), datas: false }, pos: new THREE.Vector3(-5, 2, 5), mass: 1, color: 0x00ffff, rotation_q: null, categorie: 'Box', name: 'plot_NW' },
		{ datasSizes: { v3: new THREE.Vector3(1, 1, 1), datas: false }, pos: new THREE.Vector3(-5, 22, -5), mass: 1, color: 0xffff00, rotation_q: null, categorie: 'Box', name: 'plot_SW' },
		{ datasSizes: { v3: new THREE.Vector3(1, 1, 1), datas: false }, pos: new THREE.Vector3(5, 0.5, -5), mass: 1, color: 0xffff00, rotation_q: null, categorie: 'Box', name: 'plot_SE' },
		{ datasSizes: { v3: new THREE.Vector3(1, 1, 1), datas: false }, pos: new THREE.Vector3(5, 0.5, 5), mass: 1, color: 0xffff00, rotation_q: null, categorie: 'Box', name: 'plot_NE' },

		{ datasSizes: { v3: new THREE.Vector3(40, 1, .5), datas: false }, pos: new THREE.Vector3(0, 0.5, -19.75), mass: 0, color: 0x101010, rotation_q: null, categorie: 'Box', name: 'wall_south' },
		{ datasSizes: { v3: new THREE.Vector3(40, 1, .5), datas: false }, pos: new THREE.Vector3(0, 0.5, 19.75), mass: 0, color: 0x101010, rotation_q: null, categorie: 'Box', name: 'wall_north' },
		{ datasSizes: { v3: new THREE.Vector3(.5, 1, 39), datas: false }, pos: new THREE.Vector3(19.75, 0.5, 0), mass: 0, color: 0x101010, rotation_q: null, categorie: 'Box', name: 'wall_est' },
		{ datasSizes: { v3: new THREE.Vector3(.5, 1, 39), datas: false }, pos: new THREE.Vector3(-19.75, 0.5, 0), mass: 0, color: 0x101010, rotation_q: null, categorie: 'Box', name: 'wall_west' },
	],
	addThemAll: function (_scene) {
		for (let index = 0; index < this.objs.length; index++) {
			const element = this.objs[index];
			let newcube = _physics.createMesh(element.datasSizes, element.pos, element.mass, element.color, element.rotation_q, element.categorie, element.name)
			this.meshsByName[element.name] = newcube
			_scene.scene.add(newcube)
		}
	},
	addRandomSphere: function (_scene) {
		let max = 60;
		let hauteurDeDepart = 12;
		for (let index = 0; index < max; index++) {
			let RandomConfig = {
				datasSizes: {
					v3: new THREE.Vector3(1, 16, 16),// Taille de la sphère
					datas: false // Future Taille de la sphère
				},
				pos: new THREE.Vector3(
					(Math.random() - 0.5) * 5, // Position X aléatoire
					hauteurDeDepart + Math.random() * 5, // Position Y aléatoire
					(Math.random() - 0.5) * 5 // Position Z aléatoire
				),
				mass: 1,
				color: Math.random() * 0xffffff,
				rotation_q: new THREE.Quaternion(Math.random(), Math.random(), Math.random(), Math.random()).normalize(), // Vecteur de rotation aléatoire
				categorie: 'Sphere',
				name: 'sphere_' + Math.random().toString(36).substring(7) // Nom aléatoire
			}
			let newSphere = _physics.createMesh(
				RandomConfig.datasSizes,
				RandomConfig.pos,
				RandomConfig.mass,
				RandomConfig.color,
				RandomConfig.rotation_q,
				RandomConfig.categorie,
				RandomConfig.name
			);

			this.meshsByName[RandomConfig.name] = newSphere;
			_scene.scene.add(newSphere);
		}
	},
	init: function (_scene) {
		this.addThemAll(_scene)
		this.addRandomSphere(_scene)
	}
}
export { _physics, _physicsHydrate }
