import * as THREE from 'three';
import { _dataz } from "/three/js/dataz.js";
import { _namer } from "/three/js/fonctions/namer.js";
export let _cameras = {
	name: _namer.getName('_cameras'),
	id: new Number(0),
	camerasById: {}, // toutes les cameras par uuid
	camerasByName: {}, // uuid des cameras par nom
	counter: new Number(0),
	currentId: new Number(0),
	add: function (name = false) {
		if (this.counter < 1 && this.id < 1) {
			this.currentId = 0;
			this.addCamera('main')
		}
		else {
			this.addCamera(name)
		}
	},
	addCamera: function (name = false) {
		let conf = _dataz.get_ByCategoryThenName('cameras', name)
		if (typeof conf === 'object') {
			let camera = new THREE.PerspectiveCamera(
				(typeof conf.fov === 'number') ? conf.fov : 40,
				_dataz.sizes.width / _dataz.sizes.height,
				conf.near,
				conf.far
			)
			camera.name = conf.name
			// camera.position.z = conf.position.z
			camera.position.set(conf.position.x, conf.position.y, conf.position.z)
			this.camerasById[this.id] = camera
			this.camerasByName[conf.name] = camera
			this.id++
			this.counter++
			console.log("adding " + conf.name + "'s camera id:" + (this.id - 1),)
		}
	},
	getCurrentCamera: function () {
		return this.cameras[this.currentId]
	},
	getCameraByName: function (name = 'main') {
		return this.camerasByName[name]
	},
	// updateCameraPositionAndLookAt(obj) {
	//     // Ajuster la position de la caméra pour suivre un object
	//     const offset = new THREE.Vector3(0, -10, 30);
	//     const cameraPosition = obj.position.clone().add(offset);
	//     this.currentPack.groupe.position.copy(cameraPosition);
	//     this.currentPack.camera.lookAt(obj.position);
	// },
	// updateCameraPosition:function(camNum=0){
	//     if (this.id>0) {
	//         let cameraPack = (camNum >= 0 && this.cameras[camNum]) ? this.cameras[camNum] : this.cameras[0];
	//         if (cameraPack.groupe.position.z > 100) {
	//             cameraPack.moveDirection = -1;
	//         } 
	//         if (cameraPack.groupe.position.z < 10) {
	//             cameraPack.moveDirection = 1;
	//         }
	//         cameraPack.groupe.position.z += cameraPack.speed * cameraPack.moveDirection;
	//         console.log(
	//             cameraPack.groupe.position.z,
	//             (cameraPack.moveDirection > 0 ? 'up' : 'down'),
	//             cameraPack.moveDirection,cameraPack.speed
	//         )
	//         cameraPack.camera.updateProjectionMatrix();
	//     }
	// },
	init: function () {
		// this.addMainCamera();
		this.add()
	},
};
