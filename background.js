import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.122/build/three.module.js';

import {math} from './math.js';

import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.122/examples/jsm/loaders/GLTFLoader.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';


export const background = (() => {



  class BackgroundCrap {
    constructor(params) {
      this.params_ = params;
      this.position_ = new THREE.Vector3();
      this.quaternion_ = new THREE.Quaternion();
      this.scale_ = 1.0;
      this.mesh_ = null;

      this.LoadModel_();
      this.LoadModel2_()
    }

    LoadModel_() {
    

      const loader = new FBXLoader();
   
      loader.load('palma.fbx', (glb) => {

        glb.scale.setScalar(0.0046);
        this.mesh_ = glb;
        this.mesh_.position.x = math.rand_range(30, 500);
        this.mesh_.position.z = 25;
        this.params_.scene.add(this.mesh_);

      });

    }

    
    LoadModel2_() {

      const loader2 = new FBXLoader();
   
      loader2.load('palma.fbx', (glb2) => {

        glb2.scale.setScalar(0.0046);

        this.mesh2_ = glb2;
        this.mesh2_.position.x = math.rand_range(30, 500);
        this.mesh2_.position.z = -3;

        this.params_.scene.add(this.mesh2_);

  
      });

    }

    Update(timeElapsed) {

      this.mesh_.position.x -= timeElapsed * 50;
      this.mesh2_.position.x -= timeElapsed * 50;
      if (this.mesh_.position.x  < -100) {
        this.mesh_.position.x = math.rand_range(30, 500);
      }

      if (this.mesh2_.position.x  < -100) {
        this.mesh2_.position.x = math.rand_range(30, 500);
      }

    }

  };


  class Background {
    constructor(params) {
      this.params_ = params;
      this.clouds_ = [];
      this.crap_ = [];

    //  this.SpawnClouds_();
      this.SpawnCrap_();
    }



    SpawnCrap_() {
      for (let i = 0; i < 10; ++i) {
        const crap = new BackgroundCrap(this.params_);

        this.crap_.push(crap);
      }
    }

    Update(timeElapsed) {
      for (let c of this.clouds_) {
        c.Update(timeElapsed);
      }
      for (let c of this.crap_) {
        c.Update(timeElapsed);
      }
    }
  }

  return {
      Background: Background,
  };
})();