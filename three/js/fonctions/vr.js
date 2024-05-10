import * as THREE from "three";
import { _renderer } from "/three/js/scene/renderer.js";
import { _cameras } from "/three/js/scene/cameras.js";
import { _scene } from "/three/js/scene/scene.js";
import { VRButton } from 'three/addons/webxr/VRButton.js';
export let _vr = {
	controller0: null,
	controller1: null,
	init: function () {
		_renderer.renderer.xr.enabled = true; // Turn on VR support
		this.setControllers()
	},
	setControllers: function () {
		this.controller0 = _renderer.renderer.xr.getController(0);
		this.controller1 = _renderer.renderer.xr.getController(1);
		this.controller0.addEventListener('select', this.onSelect0);
		this.controller1.addEventListener('select', this.onSelect1);
		_scene.scene.add(this.controller0);
		_scene.scene.add(this.controller1);
		console.log('vr controllers ok')
	},
	onselect0: function () {
		// select
		console.log('onselect0')
	},
	onselect1: function () {
		// select
		console.log('onselect1')
	},
	renderCamera: function () {
		_renderer.renderer.xr.updateCamera(_scene.camera);
	},
	addVRButton: function () {
		let a = VRButton.createButton(_renderer.renderer)
		a.target = '_blank'
		document.body.appendChild(a);
	}
};

