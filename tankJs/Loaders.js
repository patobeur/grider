"use strict";
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
let _GLTFLoader = {
	// ------------------------
	// GLTFLoader for GLTF MESH
	// ------------------------
	active: false,
	callback: () => { console.log('no call back function for _GLTFLoader') },
	gltfLoader: undefined,
	models: {},
	modelsActive: {},
	loadCounter: 0,
	list: [
		{ name: 'tank0', file: '/assets/gltf/tank/BW/tank_1_bw.glb', position: { x: -2, y: 0, z: -4 } },
		{ name: 'tank1', file: '/assets/gltf/tank/GREEN/tank_1_green.glb', position: { x: 0, y: 0, z: -4 } },
		{ name: 'tank2', file: '/assets/gltf/tank/A/tankk.gltf', position: { x: 2, y: 0, z: -4 } },
	],
	addModelsToScene: function (scene) {
		for (const key in this.models) {
			scene.add(this.models[key]
			);
		}
		// this.modelsActive['tank0'] = this.models['tank0'].clone()
		// scene.add(this.modelsActive['tank0']);
		// this.modelsActive['tank1'] = this.models['tank1'].clone()
		// scene.add(this.modelsActive['tank1']);
		// this.modelsActive['tank2'] = this.models['tank2'].clone()
		// scene.add(this.modelsActive['tank2']);
	},
	rotTankBase: function (name = 'tank2') {
		this.models.tank0.children[0].children[3].rotation.y += 0.01
		this.models.tank0.children[0].rotation.y -= 0.01

		this.models.tank2.children[0].children[3].rotation.y += 0.01
		this.models.tank2.children[0].rotation.y += 0.009

		this.models.tank1.children[0].children[3].rotation.y -= 0.01
	},
	init: function (callbackFunction = this.callback) {
		// if (typeof callbackFunction === 'function') callbackFunction = this.callback;
		this.gltfLoader = new GLTFLoader();
		this.list.forEach(element => {
			this.gltfLoader.load(
				element.file,
				(gltf) => {
					this.loadCounter++;
					const model = gltf.scene;
					model.position.x = element.position.x;
					model.position.z = element.position.z;
					model.position.y = element.position.y;
					model.traverse((node) => {
						if (node.isMesh) {
							node.receiveShadow = true
							node.castShadow = true;
						}
					});
					this.models[element.name] = model
					console.log('Model ' + element.name + ' loaded', model);
					if (this.loadCounter === this.list.length) callbackFunction();
				}, undefined, (error) => {
					console.error('_GLTFLoader', error);
				}
			);
		});
	}
}
let _TextureLoader = {
	callback: () => { console.log('no call back function for _TextureLoader') },
	textures: {},
	counter: 0,
	textureLoader: new THREE.TextureLoader(),
	files: [
		{ name: 'floor2', path: '/assets/textures/', fileName: 'sol_hr.jpg' }
	],
	init: function (callbackFunction = this.callback) {
		this.callbackFunction = callbackFunction
		this.counter = 0
		// Chargement des textures pour chaque objet
		this.files.forEach(file => {
			this.addToStack(file)
		});
	},
	checkEnd: function () {
		if (this.counter === this.files.length) {
			this.callbackFunction('FINITO textureLoader')
			// this.clearModal()
		}
	},
	addToStack: function (file) {
		this.loadTexture(file, (map) => {
			this.counter++;
			map.name = file.name
			this.textures[file.name] = { map: map, name: file.name }
			console.log('texture loaded', file.fileName, this.counter + '/' + this.files.length)
			this.checkEnd()
		});
	},
	loadTexture: function (file, callback) {
		// Chargement de la texture
		let fileurl = file.path + file.fileName
		this.textureLoader.load(
			fileurl,
			(texture) => {
				// La texture a été chargée avec succès !!!
				callback(texture);
			},
			(xhr) => {
				// Progression du chargement de la texture (optionnel)
				const percentLoaded = (xhr.loaded / xhr.total) * 100;
				// this.texturesDivByName[file.name].style.width = (100 - percentLoaded) + '%'
				console.log('Texture chargée :' + `${percentLoaded}% ${file.fileName} `);
			},
			(error) => {
				console.error('Erreur de chargement de la texture :', error);
			}
		);
	},
};
export { _GLTFLoader, _TextureLoader }
