import * as THREE from "three";
import { _dataz } from "/three/js/dataz.js";
import { _namer } from "/three/js/fonctions/namer.js";

export let _renderer = {
	name: _namer.getName('_renderer'),
	renderer: null,
	// targetDiv: document.body,
	init: function (target) {
		this.targetDiv = document.body;

		if (typeof target != 'undefined') this.targetDiv = target;

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});

		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

		this.renderer.setSize(_dataz.sizes.width, _dataz.sizes.height);

		this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

		// Set background color.
		this.renderer.setClearColor(0x000010, 1.0);

		// add Renderer to target
		this.targetDiv.prepend(this.renderer.domElement)

	},
};

