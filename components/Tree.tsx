import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const Tree = () => {
  const fbx = useLoader(FBXLoader, "/objs/tree.fbx");
  return <primitive object={fbx} />;
};

export default Tree;
