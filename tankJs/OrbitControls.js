"use strict";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
export let orbitControls = {
	active: false,
	controls: undefined,
	init: function (camera, renderer) {
		this.controls = new OrbitControls(camera, renderer.domElement)
		this.controls.enablePan = false;
		this.controls.maxPolarAngle = Math.PI / 2;
		this.controls.minDistance = 2;
		this.controls.maxDistance = camera.position.z * 2;
		// plus de vitesse ou de smooth
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.09;
		// this.controls.autoRotate = true;
		// this.controls.enableRotate = false;
		this.active = true;
		// this.controls.update();
	},
	update: function () { this.controls.update(); }
}
