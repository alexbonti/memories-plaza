import React, { useRef, useState, Suspense } from "react";
//R3F
import { Canvas, useFrame, extend } from "react-three-fiber";
// Deai - R3F
import { useGLTFLoader, PositionalAudio, Box, softShadows, useTextureLoader, MeshWobbleMaterial, MeshDistortMaterial, shaderMaterial, OrbitControls, FlyControls, Html } from "drei";
import { three, MeshBasicMaterial, TextureLoader, Material } from 'three'
//Components
// Styles
import "./App.scss";
// React Spring
import { useSpring, a } from "react-spring/three";

// soft Shadows
softShadows();

// generate 3d model
function  Testmy() {
  const { nodes, materials } = useGLTFLoader('models/suzanne.glb',true)

  console.log(nodes)
  return <mesh material={materials['Material.001']} geometry={nodes.Suzanne.geometry} scale={[0.5,0.5,0.5]}/>
}

const handleTouchCube=()=>{
  alert('cube')
}

const generateUniverse = () => {

}
const _getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}
//const texture = useTextureLoader('lensflare0.png')

const SpinningMesh = ({ position, color, speed, args }) => {
  //ref to target the mesh
  const mesh = useRef();

  //useFrame allows us to re-render/update rotation on each frame
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.001));
  //

  //Basic expand state
  const [expand, setExpand] = useState(false);


  // React spring expand animation
  const props = useSpring({
    scale: expand ? [4, 4, 4] : [1, 1, 1],
  });
  const loader = new TextureLoader();
  //let imageString='image/'+_getRndInteger(0,13)+'.jpg';
  const material = new MeshBasicMaterial({
    map: loader.load('images/' + _getRndInteger(0, 13) + '.jpg'),

    //map: loader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg'),
  });
  return (
    <a.mesh
      position={position}
      ref={mesh}
      //onClick={() => setExpand(!expand)}
      onClick={handleTouchCube}
      scale={props.scale}
      material={material}
    >
      <boxBufferGeometry attach='geometry' args={args} />
      {/*<MeshWobbleMaterial
        color={color}
        speed={speed}
        attach='material'
        factor={0.6}
      />*/}
    </a.mesh>

    //Using Drei box if you want
    // <Box {...props} ref={mesh} castShadow>
    //   <MeshWobbleMaterial
    //     {...props}
    //     attach='material'
    //     factor={0.6}
    //     Speed={1}
    //   />
    // </Box>
  );
};

const App = () => {
  ///const MyMaterial=shaderMaterial({map:null,})
  /* const material = MeshBasicMaterial({
     map: useTextureLoader('https://threejsfundamentals.org/threejs/resources/images/wall.jpg'),
   });
 */
  // audio

  const audioArgs = [
    {
      position: [0, 0, 20],
      url: 'music/1.mp3',
    },
    {
      position: [0, 0, 0],
      url: 'music/2.mp3',
    },
    {
      position: [0, 0, -20],
      url: 'music/3.mp3',
    }
  ]

  let d=20
  let cubes = []
  const createObject = () => {

    let object = {
      speed: _getRndInteger(1, 3),
      position: [
        _getRndInteger(-d, d),
        _getRndInteger(-d, d),
        _getRndInteger(-d, d),
      ],
      color: 'pink'
    }
    cubes.push(object)

  }
  for (let i = 0; i < 300; i++) {
    createObject()
  }
  //console.log(cubes)

  return (
    <>
      {/* Our Scene & Camera is already built into our canvas */}

      <Canvas
        colorManagement
        shadowMap
        camera={{ position: [-5, 2, 10], fov: 60 }}>
        {/* This light makes things look pretty */}
        <ambientLight intensity={0.3} />
        {/* Our main source of light, also casting our shadow */}
        <directionalLight
          castShadow
          position={[0, 10, 0]}
          intensity={1.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* A light to help illumnate the spinning boxes */}
        <pointLight position={[-10, 0, -20]} intensity={0.5} />
        <pointLight position={[0, -10, 0]} intensity={1.5} />
        <Suspense fallback={null}>

          <group>
            <Testmy />
        
            {audioArgs.map(({ position, url }) => (

              <mesh position={position}>
                <boxBufferGeometry attach='geometry' args={[2, 2, 2]} />
                <meshBasicMaterial wireframe attach="material" color="hotpink" />
                <PositionalAudio url={url} distance={0.06} />


              </mesh>
            ))}
            {/* This mesh is the plane (The floor) */}
            {/*<mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -3, 0]}
            receiveShadow>
            <planeBufferGeometry attach='geometry' args={[100, 100]} />
            <shadowMaterial attach='material' opacity={0.3} />
          </mesh>*/}
            {
              cubes.map((cube) => {
                //console.log(cube)
                return (
                  <SpinningMesh
                    position={cube.position}
                    color='lightblue'
                    args={[1, 1, 1]}
                    speed={cube.speed}
                  />
                )

              })
            }
            {/*<SpinningMesh
            position={[0, 1, 0]}
            color='lightblue'
            args={[3, 2, 1]}
            speed={2}
          />
          <SpinningMesh position={[-2, 1, -5]} color='pink' speed={6} />
          <SpinningMesh position={[5, 1, -2]} color='pink' speed={6} />*/}
          </group>
        </Suspense>

        {/* Allows us to move the canvas around for different prespectives */}
        <FlyControls
          movementSpeed={2}
          dragToLook={false}
          rollSpeed={Math.PI / 15} //6
        />


      </Canvas>

    </>
  );


};




export default App;