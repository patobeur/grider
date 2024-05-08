import * as THREE from 'three';
import { _namer } from "/three/js/fonctions/namer.js";
export const _formulas = {
	name: _namer.getName('_formulas'),
	getDistanceXY: (from, destination) => {
		let AB = (destination.position.x) - (from.position.x)
		let AC = (destination.position.y) - (from.position.y)
		let distance = Math.sqrt((AB * AB) + (AC * AC))
		return distance
	},
	getDistanceXYZ: (A, B) => {
		{
			if (!B) { B = { position: { x: 0, y: 0, z: 0 } } }
			let AB = (B.position.x) - (A.position.x)
			let AC = (B.position.y) - (A.position.y)
			let BC = (B.position.z) - (A.position.z)
			let distance = Math.floor(Math.sqrt((AB * AB) + (AC * AC) + (BC * BC)))
			return distance
		}
	},
	rand: (min, max) => { return Math.floor(Math.random() * (max - min + 1) + min) },
	degToRad: (deg) => { return deg * (Math.PI / 180); },
	radToDeg: (rad) => { return rad * (180 / Math.PI); },
	faireTournerAutourDuCentre: (soleil, sensDeRotation) => {
		const centreScene = new THREE.Vector3(0, 0, 0);
		const positionInitiale = soleil.position.clone();
		const circonference = 2 * Math.PI * positionInitiale.distanceTo(centreScene);
		const vitesseRotation = (2 * Math.PI) / 60; // 2 * Pi radian par minute
		function upDate() {
			const angleRotation = vitesseRotation * (1 / 60);
			const rotationMatrix = new THREE.Matrix4().makeRotationAxis(sensDeRotation, angleRotation);
			const nouvellePosition = positionInitiale.clone().applyMatrix4(rotationMatrix);
			soleil.position.copy(nouvellePosition);
		}
	},
	get_aleaPosOnScreen: (size) => {
		let maxX = window.innerWidth;
		let maxY = window.innerHeight;
		let pos = {
			x: this.rand(0, maxX - (size.x / 2)),
			y: this.rand(0, maxY - (size.y / 2)),
			z: 0
		}
		return pos
	},
	get_aleaPosOnFloor: (floorSize) => {
		let pos = {
			x: this.rand(0, floorSize.x) - (floorSize.x / 2),
			y: this.rand(0, floorSize.y) - (floorSize.y / 2),
			z: 0
		}
		return pos
	},
	get_DegreeWithTwoPos: (fromX, fromY, destX, destY,) => {
		var nextY = fromY - destY;
		var nextX = fromX - destX;
		var theta = Math.atan2(nextX, nextY); // 0° = east
		theta = (theta * 180 / Math.PI); // radians to degrees
		// if (theta < 0) theta += 360;
		return theta;
	},
	generateToken: (length) => {
		var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		var token = '';
		for (var i = 0; i < length; i++) token += chars[Math.floor(Math.random() * chars.length)];
		return token;
	}
}
