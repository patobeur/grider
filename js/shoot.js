import * as THREE from "three";
let _shoot = {
	active: false,

	shootPower: 5, // Puissance du tir (réglable)
	shootIncline: Math.PI / 24, // Inclinaison du tir en radians (réglable)
	shootSpeed: 20, // Vitesse initiale du tir (réglable)
	shootCooldown: 0.1, // Délai minimum entre les tirs en secondes
	lastShootTime: 0, // Temps du dernier tir

	init: function (playerTankMesh, _scene, _physics) {
		this.playerTankMesh = playerTankMesh
		this._physics = _physics
		this._scene = _scene
		this.active = true
	},
	update: function () {
		if (this.active === true) {
			// to do
		}
	},
	shoot: function () {
		let now = performance.now() / 1000; // Temps actuel en secondes
		if (now - this.lastShootTime < this.shootCooldown) {
			return; // Si le délai minimum n'est pas écoulé, ne pas tirer
		}
		this.lastShootTime = now; // Mettre à jour le temps du dernier tir

		let position = this.playerTankMesh.position.clone();
		let direction = new THREE.Vector3(0, Math.sin(this.shootIncline), Math.cos(this.shootIncline));
		direction.applyQuaternion(this.playerTankMesh.quaternion).normalize();

		let shootPosition = position.clone().add(direction.clone().multiplyScalar(2)); // Position de départ de la sphère
		let sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
		let sphereMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
		let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

		// Positionner la sphère
		sphereMesh.position.copy(shootPosition);

		// Ajouter la sphère à la scène
		this._scene.scene.add(sphereMesh);

		// Ajouter la sphère au monde physique
		let sphereShape = new Ammo.btSphereShape(0.5);
		let transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(shootPosition.x, shootPosition.y, shootPosition.z));

		let mass = 1;
		let localInertia = new Ammo.btVector3(0, 0, 0);
		sphereShape.calculateLocalInertia(mass, localInertia);

		let motionState = new Ammo.btDefaultMotionState(transform);
		let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, sphereShape, localInertia);
		let body = new Ammo.btRigidBody(rbInfo);

		this._physics.physicsWorld.addRigidBody(body);

		sphereMesh.userData.physicsBody = body;
		this._physics.rigidBody_List.push(sphereMesh);

		// Appliquer la force initiale
		let force = direction.clone().multiplyScalar(this.shootSpeed);
		body.setLinearVelocity(new Ammo.btVector3(force.x, force.y, force.z));
	},
	shoot99: function () {
		let position = this.playerTankMesh.position.clone();
		let direction = new THREE.Vector3(0, Math.sin(this.shootIncline), Math.cos(this.shootIncline));
		direction.applyQuaternion(this.playerTankMesh.quaternion);

		let shootPosition = position.clone().add(direction.clone().multiplyScalar(2)); // Position de départ de la sphère
		let sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
		let sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
		let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

		// Positionner la sphère
		sphereMesh.position.copy(shootPosition);

		// Ajouter la sphère à la scène
		this._scene.scene.add(sphereMesh);

		// Ajouter la sphère au monde physique
		let sphereShape = new Ammo.btSphereShape(0.5);
		let transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(shootPosition.x, shootPosition.y, shootPosition.z));

		let mass = 1;
		let localInertia = new Ammo.btVector3(0, 0, 0);
		sphereShape.calculateLocalInertia(mass, localInertia);

		let motionState = new Ammo.btDefaultMotionState(transform);
		let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, sphereShape, localInertia);
		let body = new Ammo.btRigidBody(rbInfo);

		this._physics.physicsWorld.addRigidBody(body);

		sphereMesh.userData.physicsBody = body;
		this._physics.rigidBody_List.push(sphereMesh);

		// Appliquer la force initiale
		let force = direction.clone().multiplyScalar(this.shootPower);
		body.setLinearVelocity(new Ammo.btVector3(force.x, force.y, force.z));
	},
	shoot2: function () {
		// 	if (this.active === true) {
		let position = this.playerTankMesh.position.clone();
		let direction = new THREE.Vector3(0, Math.sin(this.shootIncline), Math.cos(this.shootIncline));
		direction.applyQuaternion(this.playerTankMesh.quaternion);

		let shootPosition = position.clone().add(direction.clone().multiplyScalar(2)); // Position de départ de la sphère
		let sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
		let sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
		let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

		// Positionner la sphère
		sphereMesh.position.copy(shootPosition);

		// Ajouter la sphère à la scène
		this._scene.scene.add(sphereMesh);

		// Ajouter la sphère au monde physique
		let sphereShape = new Ammo.btSphereShape(0.5);
		let transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(shootPosition.x, shootPosition.y, shootPosition.z));

		let mass = 1;
		let localInertia = new Ammo.btVector3(0, 0, 0);
		sphereShape.calculateLocalInertia(mass, localInertia);

		let motionState = new Ammo.btDefaultMotionState(transform);
		let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, sphereShape, localInertia);
		let body = new Ammo.btRigidBody(rbInfo);

		this._physics.physicsWorld.addRigidBody(body);

		sphereMesh.userData.physicsBody = body;
		this._physics.rigidBody_List.push(sphereMesh);

		// Appliquer la force initiale
		let force = direction.clone().multiplyScalar(this.shootPower);
		body.setLinearVelocity(new Ammo.btVector3(force.x, force.y, force.z));
		// 	else {
		// 		console.log('shoot', 'unarmed')
		// 	}
	},
}
export { _shoot }
