/* eslint-disable react/no-unknown-property */
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

import styles from "./STLViewer.module.css";
import ZoomControls from "../ZoomControls/ZoomControls";

const STLModel = ({ url }) => {
  const stl = useLoader(STLLoader, url);
  return (
    <mesh rotation={[0, 0, Math.PI]}>
      <primitive object={stl} attach="geometry" />
      <meshStandardMaterial
        color="lightgray"
        metalness={0.1} // Slightly metallic for a slicer-like appearance
        roughness={0.5} // Slightly rough for better lighting
      />
    </mesh>
  );
};

const CameraController = ({ cameraRef, resetKey }) => {
  const { camera, gl } = useThree();

  useEffect(() => {
    cameraRef.current = camera; // Store the camera reference
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableRotate = true;

    // Reset camera position when resetKey changes
    camera.position.set(0, 0, 100); // Reset to default camera position
    controls.update(); // Update the controls to reflect the new camera position

    return () => {
      controls.dispose();
    };
  }, [camera, gl, cameraRef, resetKey]); // Re-run effect when resetKey changes

  return null;
};

const STLViewer = ({ stlUrl, cart = false, zoomScale = 1 }) => {
  const cameraRef = useRef();
  const [resetKey, setResetKey] = useState(0); // Use a key to force re-render

  const adjustZoom = useCallback((delta) => {
    if (cameraRef.current) {
      cameraRef.current.position.z += delta;
    }
  }, []);

  const handleReset = () => setResetKey((prev) => prev + 1); // force re-render

  return (
    <div className={styles.stl_body}>
      <Canvas
        camera={{ position: [0, 0, 100], fov: 50 / zoomScale }}
        className={styles.stl_canvas}
      >
        {/* Add lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />

        {/* Add the STL model */}
        <STLModel url={stlUrl} />

        {/* Add camera controls */}
        <CameraController cameraRef={cameraRef} resetKey={resetKey} />
      </Canvas>
      {!cart && (
        <>
          <ZoomControls
            onZoomIn={() => adjustZoom(-10)}
            onZoomOut={() => adjustZoom(10)}
          />
          <button onClick={handleReset} className={styles.reset}>
            Reset View
          </button>
        </>
      )}
    </div>
  );
};

export default STLViewer;
