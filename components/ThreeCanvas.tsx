import {
  GizmoHelper,
  GizmoViewport,
  Html,
  OrbitControls,
  Sampler,
  TransformFn,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  BoxGeometry,
  CylinderGeometry,
  Mesh,
  MeshBasicMaterial,
  TorusGeometry,
  Vector3,
} from "three";
import { MeshSurfaceSampler } from "../node_modules/three/examples/jsm/math/MeshSurfaceSampler";
import { OBJLoader } from "../node_modules/three/examples/jsm/loaders/OBJLoader";
import Points from "./Points";
import TwinklePoint from "./TwinklePoint";
import { useStore } from "./useStore";

const Cube = (props: JSX.IntrinsicElements["mesh"]) => {
  const instances = useRef();
  const meshRef = useRef();

  const transformInstance: TransformFn = ({
    dummy,
    sampledMesh,
    position,
    normal,
  }) => {
    const worldPosition = sampledMesh.localToWorld(position);
    dummy.position.copy(worldPosition);
    dummy.lookAt(normal.clone().add(position));
    dummy.rotation.y += Math.random() - 0.5 * (Math.PI * 0.5);
    dummy.rotation.z += Math.random() - 0.5 * (Math.PI * 0.5);
    dummy.rotation.x += Math.random() - 0.5 * (Math.PI * 0.5);
  };

  return (
    <>
      <Sampler
        transform={transformInstance} // a function that transforms each instance given a sample. See the examples for more.
      >
        <mesh>
          <sphereGeometry args={[2]} />
        </mesh>

        <instancedMesh args={[null, null, 500]}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color={"red"} />
        </instancedMesh>
      </Sampler>
    </>
  );
};

function Box(props: JSX.IntrinsicElements["mesh"]) {
  // This reference will give us direct access to the THREE.Mesh object
  const ref = useRef<THREE.Mesh>(null!);
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Rotate mesh every frame, this is outside of React without overhead

  useFrame((state, delta) => (ref.current.rotation.x += 0.01));

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

const instanceCount = 10000;
const ThreeCanvas = () => {
  const increaseTwinklePositionX = useStore(
    (state) => state.increaseTwinklePositionX
  );
  const decreaseTwinklePositionX = useStore(
    (state) => state.decreaseTwinklePositionX
  );

  const surfacePositions = useStore((state) => state.surfacePositions);
  const setSurfacePositions = useStore((state) => state.setSurfacePositions);
  const setTwinkleMove = useStore((state) => state.setTwinkleMove);

  useEffect(() => {
    const tempPositions = [];
    const tempPosition = new Vector3();
    for (let i = 0; i < instanceCount; i++) {
      tempPosition.set(
        Math.random() * 15,
        Math.random() * 15,
        Math.random() * 15
      );

      tempPositions.push(tempPosition.clone());
    }

    setSurfacePositions(tempPositions);

    console.log(surfacePositions);
  }, []);

  const onClickCreate = () => {
    const geometry = new BoxGeometry(13, 13, 13);
    const material = new MeshBasicMaterial({
      color: 0x66ccff,
      wireframe: true,
    });
    const cube = new Mesh(geometry, material);

    const sampler = new MeshSurfaceSampler(cube).build();

    const tempPositions = [];
    const tempPosition = new Vector3();

    for (let i = 0; i < instanceCount; i++) {
      sampler.sample(tempPosition);
      tempPositions.push(tempPosition.clone());
    }
    setSurfacePositions(tempPositions);
    setTwinkleMove(true);
  };
  const onClickCreate2 = () => {
    const geometry = new CylinderGeometry(10, 10, 10);
    const material = new MeshBasicMaterial({
      color: 0x66ccff,
      wireframe: true,
    });
    const cube = new Mesh(geometry, material);

    const sampler = new MeshSurfaceSampler(cube).build();

    const tempPositions = [];
    const tempPosition = new Vector3();

    for (let i = 0; i < instanceCount; i++) {
      sampler.sample(tempPosition);
      tempPositions.push(tempPosition.clone());
    }
    setSurfacePositions(tempPositions);
    setTwinkleMove(true);
  };

  const onClickCreate3 = () => {
    let elephant: Mesh = null;
    new OBJLoader().load("/objs/Mesh_Elephant.obj", (obj) => {
      console.log("onload");
      elephant = obj.children[0];
      elephant.geometry.scale(0.1, 0.1, 0.1);
      elephant.material = new MeshBasicMaterial({
        wireframe: true,
        color: 0x000000,
        transparent: true,
        opacity: 1,
      });

      const sampler = new MeshSurfaceSampler(elephant).build();

      const tempPositions = [];
      const tempPosition = new Vector3();

      for (let i = 0; i < instanceCount; i++) {
        sampler.sample(tempPosition);
        tempPositions.push(tempPosition.clone());
      }
      setSurfacePositions(tempPositions);
      setTwinkleMove(true);
    });
  };

  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{
        position: [13, 13, 13],
        fov: 100,
      }}
    >
      <GizmoHelper
        alignment="bottom-right" // widget alignment within scene
        margin={[80, 80]} // widget margins (X, Y)
      >
        <GizmoViewport
          axisColors={["red", "green", "blue"]}
          labelColor="black"
        />
      </GizmoHelper>
      <OrbitControls></OrbitControls>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {/* <TwinklePoint position={[0, 0, 0]} scale={0.5}></TwinklePoint> */}

      <Points></Points>
      <Html fullscreen>
        <div className="w-screen h-screen absolute left-0 top-0">
          {/* <div
            onClick={increaseTwinklePositionX}
            className="bg-white p-3 rounded cursor-pointer w-10 inline-block mx-3"
          >
            +
          </div>
          <div
            onClick={decreaseTwinklePositionX}
            className="bg-white p-3 rounded cursor-pointer w-10 inline-block mx-3"
          >
            -
          </div> */}
          <div className="m-2">
            {/* <input type={"text"}></input> */}
            <div
              onClick={onClickCreate}
              className="bg-white p-3 rounded cursor-pointer w-18 inline-block mx-3"
            >
              Box
            </div>{" "}
            <div
              onClick={onClickCreate2}
              className="bg-white p-3 rounded cursor-pointer w-18 inline-block mx-3"
            >
              Cylinder
            </div>
            <div
              onClick={onClickCreate3}
              className="bg-white p-3 rounded cursor-pointer w-18 inline-block mx-3"
            >
              Elephant
            </div>
          </div>
        </div>
      </Html>
    </Canvas>
  );
};

export default ThreeCanvas;
