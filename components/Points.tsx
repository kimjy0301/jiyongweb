import { GroupProps, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { InstancedMesh, Matrix4, Object3D, Vector3 } from "three";
import { useStore } from "./useStore";

const tempSphereList = [];
const tempSphere = new Object3D();
const instanceCount = 10000;
const Points = (props: GroupProps) => {
  const ref = useRef<InstancedMesh>(null);

  const setTwinkleMove = useStore((state) => state.setTwinkleMove);
  useEffect(() => {
    console.log(ref.current);
    let surfacePositions = useStore.getState().surfacePositions;
    for (let i = 0; i < instanceCount; i++) {
      const tempSphere = new Object3D();

      tempSphere.position.set(
        surfacePositions[i].x,
        surfacePositions[i].y,
        surfacePositions[i].z
      );
      ref.current.setMatrixAt(i, tempSphere.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);

  let mat4: Matrix4 = new Matrix4();
  let prePosition = new Vector3();
  useFrame(({ clock }) => {
    let surfacePositions = useStore.getState().surfacePositions;
    let twinkleMove = useStore.getState().twinkleMove;

    let counter = 0;
    const t = clock.oldTime * 0.001;
    if (twinkleMove) {
      for (let x = 0; x < instanceCount; x++) {
        ref.current.getMatrixAt(x, mat4);
        const id = counter++;
        // let previousPosition = tempSphereList[x].position;
        prePosition.setFromMatrixPosition(mat4);
        let nextPosition = surfacePositions[x];
        if (prePosition.distanceTo(nextPosition) > 0.0025) {
          // tempSphereList[x].position.lerp(surfacePositions[x], 0.1);

          //tempSphereList[x].position.lerp(surfacePositions[x], 0.1);

          prePosition.y = prePosition.y + Math.sin(Math.random() / 100);
          prePosition.x = prePosition.x + Math.sin(Math.random() / 100);
          prePosition.z = prePosition.z + Math.sin(Math.random() / 100);

          prePosition.lerp(surfacePositions[x], 0.08);
          // tempSphere.position.x = MathUtils.lerp(
          //   previousPosition.x,
          //   nextPosition.x,
          //   0.1
          // );
          // tempSphere.position.y = MathUtils.lerp(
          //   previousPosition.y,
          //   nextPosition.y,
          //   0.1
          // );
          // tempSphere.position.z = MathUtils.lerp(
          //   previousPosition.z,
          //   nextPosition.z,
          //   0.1
          // );
          // tempSphereList[x].position.set(
          //   surfacePositions[x].x,
          //   surfacePositions[x].y,
          //   surfacePositions[x].z
          // );
          // tempSphere.position.set(
          //   surfacePositions[x].x,
          //   surfacePositions[x].y,
          //   surfacePositions[x].z
          // );

          // tempSphereList[x].updateMatrix();

          mat4.setPosition(prePosition);
          ref.current.setMatrixAt(id, mat4);
        } else {
          console.log(prePosition.distanceTo(nextPosition));
          setTwinkleMove(false);
        }

        ref.current.instanceMatrix.needsUpdate = false;
      }

      // ref.current.position.x = tempSphere.rotation.y = t;
    }

    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <group position={[0, 0, 0]} {...props}>
        <instancedMesh ref={ref} args={[null, null, instanceCount]}>
          <sphereGeometry args={[0.05]} />
          <meshPhongMaterial color={"yellow"} />
        </instancedMesh>
      </group>
    </>
  );
};

export default Points;
