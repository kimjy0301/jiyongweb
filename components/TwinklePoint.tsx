import { MeshProps, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { MathUtils, Mesh } from "three";
import { useStore } from "./useStore";

const TwinklePoint = (props: MeshProps) => {
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    let previousPosition = ref.current.position.x;
    let nextPosition = useStore.getState().twinklePosition[0];

    if (previousPosition !== nextPosition) {
      ref.current.position.x = MathUtils.lerp(
        ref.current.position.x,
        nextPosition,
        0.1
      );
    }
  });

  return (
    <mesh {...props} ref={ref}>
      <sphereGeometry args={[1, 32, 32]}></sphereGeometry>
      <meshPhongMaterial
        color={"red"}
        specular={"0x009900"}
        shininess={30}
        flatShading={true}
      ></meshPhongMaterial>
    </mesh>
  );
};

export default TwinklePoint;
