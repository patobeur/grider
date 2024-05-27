import * as THREE from "three";
let _OrbitControls = {
	active: false,
	player: undefined,
	camera: undefined,
	// ------------------------
	// CAMERA PIVOTS 
	// ------------------------
	cubepitch: new THREE.Mesh(new THREE.BoxGeometry(.15, .05, .25), new THREE.MeshPhongMaterial({ color: 0xFF0000 })),
	cubeyaw: new THREE.Mesh(new THREE.BoxGeometry(.05, .15, .25), new THREE.MeshPhongMaterial({ color: 0x00FF00 })),
	cuberoll: new THREE.Mesh(new THREE.BoxGeometry(.05, .15, .25), new THREE.MeshPhongMaterial({ color: 0x0000ff })),
	// ------------------------
	// INIT
	// ------------------------
	init: function (camera, renderer, _Player) {
		this.camera = camera
		this.player = _Player
		this.groupe = new THREE.Group()
		this.groupe.position.y = 0
		this.groupe.position.x = 0
		this.groupe.position.z = -.75
		this.cubeyaw.position.x = .25
		this.cubepitch.position.x = -.25
		this.groupe.add(this.cubeyaw, this.cubepitch, this.cuberoll)
		_Player.playerTurret.add(this.groupe)

		_Player.playerTurret.add(camera)
		camera.position.z = -8;
		camera.rotation.z = -Math.PI
		camera.position.y = 2;
		camera.lookAt(new THREE.Vector3(0, 0, 5))
		this.active = true
	},
	update: function () {
		if (this.active === true) {
			// to do
			_OrbitControls.cuberoll.rotation.y = this.player.playerTankMesh.rotation.y + 0
		}
	},
	//-----------------
	onDocumentMouseMove: function (e) {
		_OrbitControls.cubeyaw.rotation.y -= e.movementX * 0.002;
		_OrbitControls.cubepitch.rotation.x += e.movementY * 0.002;
		_OrbitControls.player.playerTurret.rotation.y = _OrbitControls.cubeyaw.rotation.y;
		return false;
	},
	onDocumentMouseWheel: function (e) {
		if (1 === 1) {
			_OrbitControls.camera.translateZ((e.deltaY >= 0) ? 1 : -1)
		}
		const hauteur = _OrbitControls.camera.position.y + e.deltaY * 0.001;
		if (hauteur >= 0 && hauteur <= 5) {
			_OrbitControls.camera.position.y = hauteur;
		}
		return false;
	}
}
export { _OrbitControls }
