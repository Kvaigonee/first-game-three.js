import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';

import {player} from './player.js';
import {world} from './world.js';
import {background} from './background.js';

import {ground} from './ground.js';




class BasicWorldDemo {
  constructor() {
    this._Initialize();

    this._gameStarted = false;
    document.getElementById('game-menu').onclick = (msg) => this._OnStart(msg);
  }

  _OnStart(msg) {
    document.getElementById('game-menu').style.display = 'none';
    document.getElementById('game-menu1').style.display = 'none';
    this._gameStarted = true;
  }

  _Initialize() {
 
    this.threejs_ = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.threejs_.outputEncoding = THREE.sRGBEncoding;
    this.threejs_.gammaFactor = 2.2;
    
    this.threejs_.shadowMap.enabled = true;
    
    this.threejs_.setPixelRatio(window.devicePixelRatio);
    this.threejs_.setSize(window.innerWidth, window.innerHeight);

    document.getElementById('container').appendChild(this.threejs_.domElement);

    window.addEventListener('resize', () => {
      this.OnWindowResize_();
    }, false);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 20000.0;
    this.camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera_.position.set(-15, 7, 10);
    this.camera_.lookAt(120, -20, 10);


    this.scene_ = new THREE.Scene();


    const color = 0xFFFFFF;
    const intensity = 0.6;
    const light = new THREE.AmbientLight(color, intensity);
    light.position.x = 1200
    light.position.y = 3

    console.log(light.position)
    this.scene_.add(light);
    



    this.scene_.background = new THREE.Color(0x000000);

  
  
    this.scene_.fog = new THREE.FogExp2(0x000000, 0.00125);


    this.ground = new ground.Ground({scene: this.scene_});

    this.world_ = new world.WorldManager({scene: this.scene_});

    this.player_ = new player.Player({scene: this.scene_, world: this.world_});
   console.log(player);
   var pos = player.position_;
   console.log(pos);
    this.background_ = new background.Background({scene: this.scene_});

    this.gameOver_ = false;
    this.previousRAF_ = null;
    this.RAF_();
    this.OnWindowResize_();
  }


  OnWindowResize_() {
    this.camera_.aspect = window.innerWidth / window.innerHeight;
    this.camera_.updateProjectionMatrix();
    this.threejs_.setSize(window.innerWidth, window.innerHeight);
  }

  RAF_() {
    requestAnimationFrame((t) => {
      if (this.previousRAF_ === null) {
        this.previousRAF_ = t;
      }

      this.RAF_();

      this.Step_((t - this.previousRAF_) / 1000.0);
      this.threejs_.render(this.scene_, this.camera_);
      this.previousRAF_ = t;
    });
  }

  Step_(timeElapsed) {
    if (this.gameOver_ || !this._gameStarted) {
      return;
    }


    this.ground.Update(timeElapsed);
    this.player_.Update(timeElapsed);
    this.world_.Update(timeElapsed);
    this.background_.Update(timeElapsed);

    if (this.player_.gameOver && !this.gameOver_) {
      this.gameOver_ = true;
      document.getElementById('game-over').classList.toggle('active');
    }
  }
}


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new BasicWorldDemo();
});



