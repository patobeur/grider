
"use strict";
import * as THREE from "three";

let _sphereBleue = {
	playerTankMesh: undefined,
	_physics: undefined,
	_scene: undefined,
	mesh: undefined,
	sphereRigidBody: undefined,
	init: function (player, _physics, _scene) {
		this.playerTankMesh = player.playerTankMesh;
		this._physics = _physics;
		this._scene = _scene;
		this.addTransparentSphere();
	},
	// Add the blue transparent sphere
	addTransparentSphere: function () {
		let sphereConfig = {
			datasSizes: {
				v3: new THREE.Vector3(1.4, 1.5, 1.8),
				datas: {
					mat: {
						transparent: true,
						opacity: 0.5,
						shininess: 100
					}
				}
			},
			pos: new THREE.Vector3(
				this.playerTankMesh.position.x,
				this.playerTankMesh.position.y + 2,
				this.playerTankMesh.position.z
			),
			mass: 1,
			color: 0xffffff,
			rotation_q: new THREE.Quaternion(0, 0, 0, 1),  // Pas de rotation
			categorie: 'Box',
			name: 'sphereBleue',
			tag: 'sphereBleue'
		};

		let sphereMesh = this._physics.createMesh(
			sphereConfig.datasSizes,
			sphereConfig.pos,
			sphereConfig.mass,
			sphereConfig.color,
			sphereConfig.rotation_q,
			sphereConfig.categorie,
			sphereConfig.name,
			sphereConfig.tag
		);

		this.mesh = sphereMesh;
		this.sphereRigidBody = sphereMesh.userData.physicsBody;

		// Add the sphere to the scene
		this._scene.scene.add(sphereMesh);

		// Add the rigid body of the sphere to the physics world
		this._physics.physicsWorld.addRigidBody(this.sphereRigidBody);
	},
	addRandomSphere: function (_scene) {
		let max = 10;
		let hauteurDeDepart = 12;
		for (let index = 0; index < max; index++) {
			let RandomConfig = {
				datasSizes: {
					v3: new THREE.Vector3(1, 32, 32),// Taille de la sphère
					datas: {
						mat: {
							transparent: true,
							opacity: 0.5,
							shininess: 100
						}
					} // Future Taille de la sphère
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
				name: 'sphere_' + Math.random().toString(36).substring(7), // Nom aléatoire
				tag: 'plot', // Nom aléatoire
			}
			// material = new THREE.MeshPhongMaterial({
			// 	color: color,
			// 	transparent: true,
			// 	opacity: 0.5,
			// 	shininess: 100  // Adding shininess for the sphere
			// });
			let newSphere = this._physics.createMesh(
				RandomConfig.datasSizes,
				RandomConfig.pos,
				RandomConfig.mass,
				RandomConfig.color,
				RandomConfig.rotation_q,
				RandomConfig.categorie,
				RandomConfig.name,
				RandomConfig.tag
			);

			this._physics.meshsByName[RandomConfig.name] = newSphere;
			this._scene.scene.add(newSphere);
		}
	},
	update: function () {

		if (this.sphereRigidBody) {
			let sphereTransform = new Ammo.btTransform();
			this.sphereRigidBody.getMotionState().getWorldTransform(sphereTransform);

			// Mettre à jour la position
			let sphereOrigin = sphereTransform.getOrigin();
			sphereOrigin.setX(this.playerTankMesh.position.x);
			sphereOrigin.setZ(this.playerTankMesh.position.z);

			// Mettre à jour la rotation
			let tankRotation = this.playerTankMesh.quaternion;
			let sphereRotation = new Ammo.btQuaternion(tankRotation.x, tankRotation.y, tankRotation.z, tankRotation.w);

			sphereTransform.setOrigin(sphereOrigin);
			sphereTransform.setRotation(sphereRotation);

			this.sphereRigidBody.setWorldTransform(sphereTransform);
			this.sphereRigidBody.activate();  // S'assurer que la sphère est active dans le monde physique
		}


	}
}
export { _sphereBleue }
