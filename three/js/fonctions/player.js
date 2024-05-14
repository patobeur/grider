import * as THREE from 'three';
import { _namer } from "/three/js/fonctions/namer.js";
import { _renderer } from "/three/js/scene/renderer.js";
import { _scene } from "/three/js/scene/scene.js";
import { _cameras } from "/three/js/scene/cameras.js";
import { _physics } from "/three/js/physics/physics.js";
export const _player = {
	isAGroupe: false,
	name: _namer.getName('_player'),
	set_playerEyes: function () {
		this.playerEyes = new THREE.Group()
		const geometry = new THREE.BoxGeometry(.13, .13, .1)
		const material = new THREE.MeshPhongMaterial({ color: 0x000000 })
		let EyeLeft = new THREE.Mesh(geometry, material);
		EyeLeft.castShadow = true;
		EyeLeft.receiveShadow = true;
		let EyeRight = new THREE.Mesh(geometry, material);
		EyeRight.castShadow = true;
		EyeRight.receiveShadow = true;
		this.playerEyes.add(EyeLeft, EyeRight)
		EyeLeft.position.set(.20, 0, .5);
		EyeRight.position.set(-.20, 0, .5);
	},
	set_camera: function () {
		this.pivot = new THREE.Object3D();
		// this.pivot.position.set(0, 1, 3);
		// this.pivot.position = _scene.camera.positions
		this.yaw = new THREE.Object3D();
		this.pitch = new THREE.Object3D();
		this.pivot.add(this.yaw);
		this.yaw.add(this.pitch);
		this.pitch.add(_scene.camera);
		_scene.scene.add(this.pivot)
	},
	createPlayer: function () {
		this.playerMesh = _physics.createMesh(new THREE.Vector3(1, 1, 1), new THREE.Vector3(0, 10, 0), 0.1, 0x00ffff, null, 'Box');
		this.set_playerEyes()
		this.playerMesh.add(this.playerEyes)
		this.playerMesh.name = 'PLAYER'

		this.set_camera()

		if (this.isAGroupe) {
			this.TARGET = new THREE.Group()
			this.TARGET.add(this.playerMesh)
		}
		else {
			this.TARGET = this.playerMesh
		}
		console.log(this.TARGET)
		_scene.scene.add(this.TARGET)

	},
	moveManager: function () {
		this.vectorV = new THREE.Vector3();
		this.inputVelocity = new THREE.Vector3();
		this.euler = new THREE.Euler();
		this.quaternion = new THREE.Quaternion();
		this.onDocumentMouseMove = (e) => {
			this.yaw.rotation.y -= e.movementX * 0.002;
			const v = this.pitch.rotation.x - e.movementY * 0.002;
			if (v > -1 && v < 0.1) {
				this.pitch.rotation.x = v;
			}
			return false;
		}
		this.onDocumentMouseWheel = (e) => {
			console.log(_scene.camera)
			const v = _scene.camera.position.z + e.deltaY * 0.005;
			if (v >= 2 && v <= 10) {
				_scene.camera.position.z = v;
			}
			return false;
		}
		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.keyMap = {};
		this.onDocumentKey = (e) => {
			this.keyMap[e.code] = e.type === "keydown";
			if (this.pointerLocked) {
				this.moveForward = this.keyMap["KeyW"];
				this.moveBackward = this.keyMap["KeyS"];
				this.moveLeft = this.keyMap["KeyA"];
				this.moveRight = this.keyMap["KeyD"];
			}
		};

	},
	pointerManager: function () {
		this.pointerLocked = false;
		document.addEventListener("pointerlockchange", () => {
			if (document.pointerLockElement === _renderer.renderer.domElement) {
				this.pointerLocked = true;

				this.startButton.style.display = "none";
				this.menuPanel.style.display = "none";

				document.addEventListener("keydown", this.onDocumentKey, false);
				document.addEventListener("keyup", this.onDocumentKey, false);

				_renderer.renderer.domElement.addEventListener("mousemove", this.onDocumentMouseMove, false);
				_renderer.renderer.domElement.addEventListener("wheel", this.onDocumentMouseWheel, false);
			} else {
				this.pointerLocked = false;

				this.menuPanel.style.display = "block";

				document.removeEventListener("keydown", this.onDocumentKey, false);
				document.removeEventListener("keyup", this.onDocumentKey, false);

				_renderer.renderer.domElement.removeEventListener(
					"mousemove",
					this.onDocumentMouseMove,
					false
				);
				_renderer.renderer.domElement.removeEventListener(
					"wheel",
					this.onDocumentMouseWheel,
					false
				);

				setTimeout(() => {
					this.startButton.style.display = "block";
				}, 1000);
			}
		});
	},
	panelManager: function () {
		this.menuPanel = document.getElementById("menuPanel");
		this.startButton = document.getElementById("startButton");
		this.startButton.addEventListener(
			"click",
			() => {
				_renderer.renderer.domElement.requestPointerLock();
			},
			false
		);
	},
	init: function () {
		this.createPlayer();
		this.moveManager();
		this.pointerManager();
		this.panelManager();
	},
	animate: function (deltaTime) {

		this.inputVelocity.set(0, 0, 0);

		if (this.moveForward) {
			this.TARGET.rotation.y = this.yaw.rotation.y;
			this.inputVelocity.z = -10 * deltaTime;
		}
		if (this.moveBackward) {
			this.TARGET.rotation.y = this.yaw.rotation.y;
			this.inputVelocity.z = 10 * deltaTime;
		}

		if (this.moveLeft) {
			this.inputVelocity.x = -10 * deltaTime;
		}
		if (this.moveRight) {
			this.inputVelocity.x = 10 * deltaTime;
		}

		// apply camera rotation to inputVelocity
		this.euler.y = this.yaw.rotation.y;
		this.quaternion.setFromEuler(this.euler);
		this.inputVelocity.applyQuaternion(this.quaternion);

		// this.TARGET.position.add(this.inputVelocity);




		// Mettre à jour la position de _scene.player à travers son corps rigide
		let playerPhysicsBody = this.TARGET.userData.physicsBody;
		let ms = playerPhysicsBody.getMotionState();
		if (ms) {
			let transform = new Ammo.btTransform();
			ms.getWorldTransform(transform);
			let position = transform.getOrigin();
			position.setX(position.x() + this.inputVelocity.x);
			position.setY(position.y() + this.inputVelocity.y);
			position.setZ(position.z() + this.inputVelocity.z);


			transform.setOrigin(position);

			let rotation = new Ammo.btQuaternion(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w);
			transform.setRotation(rotation);


			ms.setWorldTransform(transform);
			playerPhysicsBody.setMotionState(ms);
		}


		this.TARGET.getWorldPosition(this.vectorV);

		this.pivot.position.lerp(this.vectorV, 0.1);

	}
}
