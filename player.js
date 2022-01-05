import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';

import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';

export const player = (() => {

  class Player {
    constructor(params) {
      var pos = this.position_ = new THREE.Vector3(0, 20, 10);

      console.log(pos);

      this.velocity_ = 0.0;


      this.playerBox_ = new THREE.Box3();

      this.params_ = params;

      this.LoadModel_();
      this.InitInput_();
      

    }

    

    LoadModel_() {
      const loader = new FBXLoader();
     
      loader.load('mark2n.fbx', (fbx) => {
        fbx.scale.setScalar(0.0026);
        fbx.quaternion.setFromAxisAngle(
            new THREE.Vector3(0, 1, 0), Math.PI / 1);

        this.mesh_ = fbx;
        this.params_.scene.add(this.mesh_);


    
      });
    }

    InitInput_() {
      this.keys_ = {
          spacebar: false,
      };
      this.oldKeys = {...this.keys_};

      document.addEventListener('keydown', (e) => this.OnKeyDown_(e), false);
      document.addEventListener('keyup', (e) => this.OnKeyUp_(e), false);
    }

    OnKeyDown_(event) {
      switch(event.keyCode) {
       
        case 68:
          this.keys_.right = true;
          break;

        case 65:
          this.keys_.left = true;
          break;

          case 87:
          this.keys_.up = true;
          break;

          case 83:
          this.keys_.down = true;
          break;
      }
    }

    OnKeyUp_(event) {
      switch(event.keyCode) {
       
          case 68:
            this.keys_.right = false;
            break;
  
          case 65:
            this.keys_.left = false;
            break;

            case 87:
              this.keys_.up = false;
              break;
    
              case 83:
              this.keys_.down = false;
              break;
      }
    }

    CheckCollisions_() {
      const colliders = this.params_.world.GetColliders();

      this.playerBox_.setFromObject(this.mesh_);

      for (let c of colliders) {
        const cur = c.collider;

        if (cur.intersectsBox(this.playerBox_)) {
          this.gameOver = true;
        }
      }
    }
   


    Update(timeElapsed) {
   
      if (this.keys_.right && this.position_.z < 20 ) {
        this.position_.z += 0.12;
        
      }
      if (this.keys_.left && this.position_.z > 0  ) {
        this.position_.z -= 0.12;
      }

      if (this.keys_.up && this.position_.x < 30  ) {
        this.position_.x +=  0.15;
      
      }
      if (this.keys_.down && this.position_.x > -5  ) {
        this.position_.x -= 0.15;
      }
   

      const acceleration = -75 * timeElapsed;

      this.position_.y += timeElapsed * (
          this.velocity_ + acceleration * 0.5);
      this.position_.y = Math.max(this.position_.y, 0.0);

      this.velocity_ += acceleration;
      this.velocity_ = Math.max(this.velocity_, -100);

      if (this.mesh_) {
        
        this.mesh_.position.copy(this.position_);
        this.CheckCollisions_();
      }
    }
  };

  return {
      Player: Player
      
  };
})();