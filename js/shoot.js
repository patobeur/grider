
"use strict";
import * as THREE from "three";

let _shoot = {
	active: false,
	shootIncline: 0, // Inclinaison du tir en radians (réglable)
	lastShootTime: 0, // Temps du dernier tir
	size: .25,
	projectileType: 'basic',
	projectiles: [], // Ajouter un tableau pour suivre les projectiles actifs
	init: function (playerTankMesh, _scene, _physics) {
		this.playerTankMesh = playerTankMesh;
		this.turret = this.playerTankMesh.children[0].children[3];
		this._physics = _physics;
		this._scene = _scene;
		this.active = true;
	},
	projectileModels: {
		models: {
			'basic': {
				mass: 10,
				shootIncline: 0, // Inclinaison du tir en radians (réglable)
				shootSpeed: 30, // Vitesse initiale du projectile (réglable)
				localShootCooldown: 1, // Délai minimum entre les tirs en secondes
				projectileGeometry: new THREE.BoxGeometry(.25, .25, .25),
				projectileMaterial: new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }),
			},
			'basic_Lv2': {
				mass: 10,
				shootIncline: 0, // Inclinaison du tir en radians (réglable)
				shootSpeed: 30, // Vitesse initiale du projectile (réglable)
				localShootCooldown: 0.4,
				projectileGeometry: new THREE.SphereGeometry(.125, 32, 32),
				projectileMaterial: new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }),
			},
			'basic_Lv3': {
				mass: 10,
				shootIncline: 0, // Inclinaison du tir en radians (réglable)
				shootPower: 0, // Puissance du tir (réglable)
				shootSpeed: 30, // Vitesse initiale du projectile (réglable)
				localShootCooldown: 0.2,
				projectileGeometry: new THREE.SphereGeometry(.25, 32, 32),
				projectileMaterial: new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }),
			}
		},
		getModelDatas: function (modelName) {
			let model = this.models[modelName];
			let clone = new THREE.Mesh(model.projectileGeometry, model.projectileMaterial);
			model.mesh = clone.clone();
			return model;
		}
	},
	update: function () {
		if (this.active === true) {
			// Vérifier les projectiles et les supprimer s'ils ont dépassé leur temps de vie
			let now = performance.now() / 1000;
			this.projectiles = this.projectiles.filter(proj => {
				if (now - proj.startTime >= 5) {
					// Supprimer le projectile du monde graphique et physique
					this._scene.scene.remove(proj.mesh);
					this._physics.physicsWorld.removeRigidBody(proj.body);
					return false;
				}
				return true;
			});
		}
	},
	shoot: function (type = 'basic') {
		this.projectileType = type;
		let modelDatas = this.projectileModels.getModelDatas(this.projectileType);

		// Test du délai
		let now = performance.now() / 1000; // Temps actuel en secondes
		if (now - this.lastShootTime < modelDatas.localShootCooldown) {
			return false; // Si le délai minimum n'est pas écoulé, ne pas tirer
		}
		// Si délai ok on réinitialise
		this.lastShootTime = now; // Mettre à jour le temps du dernier tir

		// Position du tank
		// let tankPosition = this.playerTankMesh.position.clone();

		// Position globale de la tourelle
		let turretWorldPosition = new THREE.Vector3();
		this.turret.getWorldPosition(turretWorldPosition);

		// Direction initiale (z avant dans le repère local)
		let direction = new THREE.Vector3(0, 0, 1);

		// Rotation combinée du tank et de la tourelle
		let combinedQuaternion = this.playerTankMesh.quaternion.clone().multiply(this.turret.quaternion);
		direction.applyQuaternion(combinedQuaternion).normalize();

		// Position de départ du projectile
		let shootPosition = turretWorldPosition.clone();

		// Positionner le projectile
		modelDatas.mesh.position.copy(shootPosition);

		// Ajouter le projectile à la scène
		this._scene.scene.add(modelDatas.mesh);

		// Ajouter le projectile au monde physique
		let projectileShape = new Ammo.btSphereShape(0.5);
		let transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(shootPosition.x, shootPosition.y, shootPosition.z));

		let localInertia = new Ammo.btVector3(0, 0, 0);
		projectileShape.calculateLocalInertia(modelDatas.mass, localInertia);

		let motionState = new Ammo.btDefaultMotionState(transform);
		let rbInfo = new Ammo.btRigidBodyConstructionInfo(modelDatas.mass, motionState, projectileShape, localInertia);
		let body = new Ammo.btRigidBody(rbInfo);

		this._physics.physicsWorld.addRigidBody(body);

		modelDatas.mesh.userData.physicsBody = body;
		this._physics.rigidBody_List.push(modelDatas.mesh);

		// Appliquer la force initiale
		let force = direction.clone().multiplyScalar(modelDatas.shootSpeed);
		body.setLinearVelocity(new Ammo.btVector3(force.x, force.y, force.z));

		// Ajouter le projectile au tableau des projectiles actifs
		this.projectiles.push({
			mesh: modelDatas.mesh,
			body: body,
			startTime: now
		});

		return true;
	},
}
export { _shoot }
