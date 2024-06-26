import * as THREE from "three";
import { _scene } from "/three/js/scene/scene.js";
import { _dataz } from "/three/js/dataz.js";
import { _floors } from "/three/js/scene/floors.js";
export let _soleil = {
	sun: null,
	sunGroupe: null,
	config: _dataz.suns.main,
	init: function () {
		// this.config.position = new THREE.Vector3(
		// 	0,
		// 	15,
		// 	0
		// )
		// this.config.position.x = 0//this.config.radius
		// this.config.position.y = 15//this.config.radius
		// this.config.position.z = 0//this.config.radius
		this.floorSize = _dataz.floorsByName.main.floorSizes
		this.add();
	},
	add: function () {
		this.sunGroupe = new THREE.Group()
		this.sunGroupe.name = 'grp_sun'
		this.sunGroupe.position.set(
			this.config.position.x,
			this.config.position.y,
			this.config.position.z,
		);

		// -------------------------------------------------
		// une sphere là ou est le soleil
		const sphereGeometry = new THREE.SphereGeometry(this.config.size.x, 32, 32);
		const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00, transparent: true, opacity: .5 });
		const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.castShadow = false;
		sphere.receiveShadow = false;
		this.sunGroupe.add(sphere);

		// une autre sphere pour le soleil
		const soleilGeometry = new THREE.SphereGeometry(this.config.size.x * .6, 16, 16);
		const soleilMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: 0xffff00 });
		const soleilAvatar = new THREE.Mesh(soleilGeometry, soleilMaterial);
		soleilAvatar.castShadow = false;
		soleilAvatar.receiveShadow = false;
		this.sunGroupe.add(soleilAvatar);

		// -------------------------------------------------
		// le vrai soleil
		this.sun = new THREE.DirectionalLight(
			this.config.color,
			this.config.power
		);
		this.sun.shadow.mapSize.width = 1024; // default
		this.sun.shadow.mapSize.height = 1024; // default

		this.sun.shadow.camera.near = 2; // default
		this.sun.shadow.camera.far = 50; // default

		this.sun.name = 'sun'
		const d = 14;
		this.sun.shadow.camera.left = -d;
		this.sun.shadow.camera.right = d;
		this.sun.shadow.camera.top = d;
		this.sun.shadow.camera.bottom = -d;

		// this.sun.direction = { x: 0, y: 0, z: 0 }
		this.sunGroupe.add(this.sun);

		this.sun.castShadow = true;
		this.sun.receiveShadow = false;

		// // Add helper for the shadow camera
		// const helper = new THREE.CameraHelper(this.sun.shadow.camera);
		// _scene.scene.add(helper);

		_scene.scene.add(this.sunGroupe);
		this.animate()
	},
	rotation(centerV3 = (0, 0, 0)) {
		var center = new THREE.Vector3(centerV3)
		var relative = new THREE.Vector3(
			this.sunGroupe.position.x - center.x,
			this.sunGroupe.position.y - center.y,
			this.sunGroupe.position.z - center.z
		);
		var newPos = new THREE.Vector3(
			(relative.x * Math.cos(this.config.rotationSpeed)) - (relative.z * Math.sin(this.config.rotationSpeed)),
			0,//relative.y * Math.sin(this.config.rotationSpeed) - relative.x * Math.cos(this.config.rotationSpeed),
			0,// relative.x * Math.sin(this.config.rotationSpeed) + relative.z * Math.cos(this.config.rotationSpeed)
		);
		this.sunGroupe.position.x = newPos.x + center.x;
		this.sunGroupe.position.y = newPos.y + center.y;
		// this.sunGroupe.position.z = newPos.z + center.z;
	},
	// -----------------------------
	rotateAroundPoint: (obj, center, radius, angleIncrement) => {
		// Augmenter l'angle pour la rotation
		obj.userData.angle = (obj.userData.angle || 0) + angleIncrement;

		// Calculer les nouvelles coordonnées de l'objet
		const x = center.x + radius * Math.cos(obj.userData.angle);
		const y = center.y + radius * Math.sin(obj.userData.angle);
		const z = center.z + radius * Math.sin(obj.userData.angle)//obj.position.z; // Garder la même hauteur

		// Appliquer les nouvelles coordonnées
		obj.position.set(x, y, z);
	},

	// Appeler cette fonction dans la boucle de rendu (animation loop)
	animate: function () {
		// Faire tourner la sphère autour du centre (0,0,0) avec un rayon de 10 et un petit angle increment
		this.rotateAroundPoint(
			this.sunGroupe,
			new THREE.Vector3(0, 0, 0),
			this.config.radius,
			this.config.rotationSpeed
		);
	}
};

