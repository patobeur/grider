"use strict";
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { BoxLineGeometry } from 'three/addons/geometries/BoxLineGeometry.js';
let _consoleOn = false
let _GLTFLoader = {
	// ------------------------
	// GLTFLoader for GLTF MESH
	// ------------------------
	root: undefined,
	demoActive: false,
	_consoleOn: false,
	callback: () => { if (this._consoleOn) console.log('no call back function for _GLTFLoader') },
	gltfLoader: undefined,
	models: {},
	modelsActive: {},
	loadCounter: 0,
	list: [
		{ name: 'tank0', file: '/assets/gltf/tank/tank_black.gltf', position: { x: -2, y: 0, z: -4 } },
		{ name: 'tank1', file: '/assets/gltf/tank/tank_white.gltf', position: { x: 0, y: 0, z: -4 } },
		{ name: 'tank2', file: '/assets/gltf/tank/tank_red.gltf', position: { x: 2, y: 0, z: -4 } },
		{ name: 'tank3', file: '/assets/gltf/tank/tank_green.gltf', position: { x: 4, y: 0, z: -4 } },
	],
	addModelsToScene: function (scene) {
		for (const key in this.models) {
			scene.add(this.models[key]);
		}
		this.demoActive = true
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
	init: function (root = '', callbackFunction = this.callback) {
		this.root = root
		// if (typeof callbackFunction === 'function') callbackFunction = this.callback;
		this.gltfLoader = new GLTFLoader();
		this.list.forEach(element => {
			element.file = this.root + element.file
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
					if (this._consoleOn) console.log('Model ' + element.name + ' loaded', model);
					if (this.loadCounter === this.list.length) callbackFunction();
				}, undefined, (error) => {
					console.error('_GLTFLoader', error);
				}
			);
		});
	}
}
let _TextureLoader = {
	root: undefined,
	callback: () => { if (this._consoleOn) console.log('no call back function for _TextureLoader') },
	textures: {},
	counter: 0,
	textureLoader: new THREE.TextureLoader(),
	files: [
		{ name: 'floor2', path: '/assets/textures/', fileName: 'sol_hr.jpg' }
	],
	init: function (root = '', callbackFunction = this.callback) {
		this.root = root
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
			if (this._consoleOn) console.log('texture loaded', file.fileName, this.counter + '/' + this.files.length)
			this.checkEnd()
		});
	},
	loadTexture: function (file, callback) {
		// Chargement de la texture
		let fileurl = this.root + file.path + file.fileName
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
				if (this._consoleOn) console.log('Texture chargée :' + `${percentLoaded}% ${file.fileName} `);
			},
			(error) => {
				console.error('Erreur de chargement de la texture :', error);
			}
		);
	},
};
let _scene = {
	// ------------------------
	// SCENE CREATION
	// ------------------------
	set_scene: function () {
		this.scene = new THREE.Scene();
		this.scene.name = 'lv0';
		if (_consoleOn) console.log('0', this.scene)
	},
	// ------------------------
	// CAMERA
	// ------------------------
	set_camera: function () {
		this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.name = 'first'
		this.camera2 = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera2.name = 'secour'
	},
	// ------------------------
	// RENDERER
	// ------------------------
	set_renderer: function () {
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
		this.renderer.setClearColor(0x000010, 1.0);
		document.body.appendChild(this.renderer.domElement);
	},
	// ------------------------
	// ROOM (décor)
	// ------------------------
	set_decoration: function () {
		this.room = new THREE.LineSegments(
			new BoxLineGeometry(100, 100, 100, 20, 20, 20),
			new THREE.LineBasicMaterial({ color: 0xbcbcbc })
		);
		this.scene.add(this.room);
	},
	// ------------------------
	// SUN light
	// ------------------------
	set_sun: function () {
		this.SUN = new THREE.DirectionalLight(0xffffff, 2);
		this.SUNhelper = new THREE.DirectionalLightHelper(this.SUN, 10, 0xffff00);
		this.SUN.name = 'SUN';
		this.SUN.userData.d = 10;
		this.SUN.userData.amplitude = { range: 3, sens: 1 }
		this.SUN.position.set(0, 3, 0);
		this.SUN.shadow.mapSize.width = 1024; // default
		this.SUN.shadow.mapSize.height = 1024; // default
		this.SUN.shadow.camera.near = 2; // default
		this.SUN.shadow.camera.far = 50; // default
		this.SUN.shadow.camera.left = -this.SUN.userData.d;
		this.SUN.shadow.camera.right = this.SUN.userData.d;
		this.SUN.shadow.camera.top = this.SUN.userData.d;
		this.SUN.shadow.camera.bottom = -this.SUN.userData.d;
		this.SUN.castShadow = true

		const SunCubeGeometry = new THREE.BoxGeometry(.3, .3, .3);
		const SunCubeMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFF00 });
		this.SUNCube = new THREE.Mesh(SunCubeGeometry, SunCubeMaterial);
		this.SUN.add(this.SUNCube)
		this.SUN.add(this.SUNhelper)

		this.SUN.animate = () => {
			let sungo = setInterval(() => {
				this.SUN.move()
			}, 100)
		}
		this.SUN.move = () => {
			if (this.SUN.position.x >= this.SUN.userData.amplitude.range) this.SUN.userData.amplitude.sens = -1;
			if (this.SUN.position.x <= -this.SUN.userData.amplitude.range) this.SUN.userData.amplitude.sens = 1;
			this.SUN.position.x = this.SUN.position.x + (this.SUN.userData.amplitude.sens * 0.01)

		}
		this.SUN.starter = function () {
			// this.animate()
			if (_consoleOn) console.log(this)
			return this
		}
	},
	// ------------------------
	// POINT light
	// ------------------------
	set_lights: function () {
		const pointLight1 = new THREE.PointLight(0xff0000, 3, 100);
		pointLight1.position.set(2, 1, 2);
		const pointLight2 = new THREE.PointLight(0xffffff, 3, 100);
		pointLight2.position.set(-2, 1, -2);
		this.scene.add(pointLight2);
		this.scene.add(pointLight1);
		this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 1); // soft white light
		this.scene.add(this.ambientLight);
	},
	set_messUp: function () {
		const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
		const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xEAEAEA });
		const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		cube.position.set(-5, 0, 5);
		cube.castShadow = true;
		cube.receiveShadow = true
		cube.rotation.y = -Math.PI / 4;
		const cube2 = cube.clone()
		const cube3 = cube.clone()
		const cube4 = cube.clone()
		cube2.position.set(-5, 0, -5);
		cube3.position.set(5, 0, -5);
		cube4.position.set(5, 0, 5);
		this.scene.add(cube, cube2, cube3, cube4);


		this.groupCamera = new THREE.Group()
		// this.groupCamera = new THREE.Mesh(new THREE.BoxGeometry(5, 1, .1), new THREE.MeshPhongMaterial({ color: 0xFF0000 }));

		// // const cube2 = cube.clone();
		// const cube2Geometry = new THREE.BoxGeometry(.3, .3, .3);
		// const cube2 = new THREE.Mesh(cube2Geometry, cubeMaterial);
		// cube2.castShadow = true;
		// cube2.receiveShadow = true
		// cube2.position.y = 1.7;
		// scene.add(cube, cube2);
	},
	set_4: function () { },
	init: function () {
		this.set_scene()
		this.set_camera()
		this.set_renderer()
		this.set_decoration()
		this.set_sun()
		this.set_messUp()
		this.set_lights()

		this.scene.add(this.SUN.starter());
	}
}
export { _GLTFLoader, _TextureLoader, _scene, _consoleOn }
