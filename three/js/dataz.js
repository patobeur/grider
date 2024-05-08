import * as THREE from "three";
import { _namer } from "/three/js/fonctions/namer.js";
export let _dataz = {
	name: _namer.getName('_dataz'),
	sizes: {
		width: window.innerWidth,
		height: window.innerHeight
	},
	suns: {
		main: {
			name: 'soleil',
			color: 0x5050FF,
			power: 3,
			radius: 25,
			rotationSpeed: 0.01,
			position: new THREE.Vector3(0, 0, 0),
			size: { x: .5, y: .5, z: .5 },
			mat: {
				color: 0xFFFFFF00,
				emissive: 0xFF00FF,
				emissiveIntensity: 2,
			},
		}
	},
	floorsByName: {
		main: {
			name: 'floor',
			floorSizes: {
				x: 101,
				y: 101,
				z: 0.1
			},
			helper: {
				color: 0x000000,
				colorGrid: 0x000000,
				// colorGrid: 0x33ff33,
			},
			castShadow: true,
			receiveShadow: true,
			color: 0xEAEAEA,
		}
	},
	camerasByName: {
		main: {
			position: new THREE.Vector3(0, 10, 35),
			fov: 40,
			near: .1,
			far: 1000,
			idealLookAt: new THREE.Vector3(0, 0, 0),
			name: 'main'
		},
		test: {
			position: new THREE.Vector3(3, 0, 3),
			fov: 40,
			near: .1,
			far: 1000,
			idealLookAt: new THREE.Vector3(0, 0, 0),
			name: 'test'
		}
	},
	get_ByCategoryThenName: function (category = false, name = false) {
		if (category && name) {
			let finalCategory = category + 'ByName'
			try {
				let conf = this[finalCategory][name];
				if (typeof conf === 'object') {
					return conf
				}
			} catch (error) {
				return false;
			}
		}
		return false;
	}
};
