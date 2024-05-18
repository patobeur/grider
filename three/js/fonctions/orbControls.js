import * as THREE from "three";
import { _renderer } from "/three/js/scene/renderer.js";
import { _scene } from "/three/js/scene/scene.js";
import { _namer } from "/three/js/fonctions/namer.js";
import { _dataz } from "/three/js/dataz.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
export let _orbControls = {
	name: _namer.getName('_floors'),
	// floors: {},
	_orbControls: undefined,
	conf: _dataz.floorsByName,
	init: function () {

		this._orbControls = new OrbitControls(_scene.camera, _renderer.renderer.domElement)
		this._orbControls.enablePan = false;
		// this._orbControls.enableRotate = false;
		this._orbControls.maxPolarAngle = Math.PI / 2;
		this._orbControls.minDistance = 2;
		this._orbControls.maxDistance = _scene.camera.position.z * 2;

		// plus de vitesse ou de smooth
		this._orbControls.enableDamping = true;
		this._orbControls.dampingFactor = 0.09;
		// this._orbControls.autoRotate = true;

		this.update();

	},
	update: function () {
		this._orbControls.update();
	}
}
