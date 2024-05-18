import * as THREE from "three";
import { _namer } from "/three/js/fonctions/namer.js";
import { _dataz } from "/three/js/dataz.js";
export let _floors = {
	name: _namer.getName('_floors'),
	// floors: {},
	floor: null,
	conf: _dataz.floorsByName,
	init: function (scene) {

		this.scene = scene

		this.cubeside = 1;
		this.divisions = this.conf.main.floorSizes.x / this.cubeside

		const floorGeometry = new THREE.BoxGeometry(
			this.conf.main.floorSizes.x,
			this.conf.main.floorSizes.y,
			this.conf.main.floorSizes.z
		);

		//const floorMaterial = new THREE.MeshPhongMaterial({ color: this.conf.main.color });
		const floorMaterial = new THREE.MeshBasicMaterial({ color: this.conf.main.color });

		this.floor = new THREE.Mesh(floorGeometry, floorMaterial);

		this.floor.position.set(0, - (this.conf.main.floorSizes.z / 2), 0)

		this.floor.size = { x: this.conf.main.floorSizes.x, y: this.conf.main.floorSizes.y, z: this.conf.main.floorSizes.z }


		this.floor.name = this.conf.main.name;
		this.floor.castShadow = this.conf.main.receiveShadow;
		this.floor.receiveShadow = this.conf.main.receiveShadow;

		this.floor.rotateX(Math.PI / 2)
		this.scene.add(this.floor);

		// this.floorGridHelper()
	},

	floorGridHelper: function () {

		this.gridHelper = new THREE.GridHelper(
			this.conf.main.floorSizes.x,
			this.divisions,
			this.conf.main.helper.color,
			this.conf.main.helper.colorGrid
		);
		this.gridHelper.name = 'floorgridHelper';

		this.gridHelper.position.set(0, this.conf.main.floorSizes.z, 0)

		// this.gridHelper.rotateX(Math.PI / 2)

		this.scene.add(this.gridHelper);
		this.gridHelper.dispose()
	},
};

