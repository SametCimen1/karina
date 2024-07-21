"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh } from "three";
import * as THREE from 'three'

function MeshComponent() {
  const fileUrl = "/test14.gltf";
  const mesh = useRef<Mesh>(null!);
  const gltf = useLoader(GLTFLoader, fileUrl);


  let mixer = new THREE.AnimationMixer(gltf.scene);


  useFrame((state) => {
    mesh.current.rotation.set(0, 1.05 * state.pointer.x, 0)
  })

  useEffect(() => {
    mesh.current.position.set(0, -1.55, 4.60);

    mixer = new THREE.AnimationMixer(gltf.scene);

    gltf.animations.forEach(clip => {
      // const action = mixer.clipAction(clip)
      // console.log("INSIDE ACTION")
      // console.log(action)
      // action.play();
    });


  }, [gltf]);


  useFrame((state, delta) => {
    mixer?.update(delta)
  })

  return (
    <mesh ref={mesh} >
      <primitive object={gltf.scene} />
    </mesh>
  );
}

export function Face() {
  return (
    <div className='flex justify-center items-center h-screen  '>
      <Canvas className='h-2xl w-2xl'>
        {/* <OrbitControls /> */}
        <ambientLight />
        <pointLight position={[10,10,10]} />
        <MeshComponent/>
      </Canvas>
    </div>
  );
}
