"use client"

import { Center, Environment, Float, OrbitControls, useGLTF } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import type { Group } from "three"

function HelmetModel() {
  const helmetRef = useRef<Group>(null)
  const gltf = useGLTF("/models/New_Project_512026.glb") as any
  const scene = useMemo(() => gltf?.scene?.clone(true), [gltf?.scene])

  // Center, normalize scale, and tweak materials for a cleaner PBR look
  useMemo(() => {
    if (!scene) return

    scene.traverse((child: any) => {
      if (!child.isMesh) return

      child.castShadow = false
      child.receiveShadow = false

      if (!child.material) return

      const material = child.material
      if (typeof material.roughness !== "undefined") material.roughness = Math.min(0.45, Math.max(0.08, material.roughness))
      if (typeof material.metalness !== "undefined") material.metalness = Math.min(1, Math.max(0.15, material.metalness))
      if (typeof material.envMapIntensity !== "undefined") material.envMapIntensity = Math.max(0.8, material.envMapIntensity || 1)
      if (typeof material.clearcoat !== "undefined") material.clearcoat = Math.max(0, material.clearcoat || 0)
      material.needsUpdate = true
    })
  }, [scene])

  useFrame((state) => {
    if (!helmetRef.current) return
    // slower rotation for a more premium, relaxed look
    helmetRef.current.rotation.y = state.clock.elapsedTime * 0.12
    helmetRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.04
  })

  return (
    <group ref={helmetRef} scale={2.25} position={[0, 0.18, 0]}>
      <Center top={false} bottom={false} left={false} right={false} front={false} back={false}>
        {scene ? <primitive object={scene} dispose={null} /> : null}
      </Center>
    </group>
  )
}

export function HelmetScene() {
  return (
    <div className="relative h-[480px] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.14),rgba(2,6,23,0.98)_58%)] shadow-[0_30px_120px_rgba(2,6,23,0.55)] md:h-[580px]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_20%,transparent_80%,rgba(255,255,255,0.06)_100%)]" />
      <Canvas camera={{ position: [0, 0.1, 4.6], fov: 40 }} shadows={false} dpr={[1, 1.2]}>
        <color attach="background" args={["#020617"]} />
        <fog attach="fog" args={["#020617", 7, 14]} />
        <ambientLight intensity={0.85} />
        <directionalLight position={[4, 6, 4]} intensity={2.0} color="#dbeafe" />
        <spotLight position={[-4, 5, 2]} intensity={18} angle={0.28} penumbra={0.4} color="#38bdf8" />
        <spotLight position={[4, 1.5, -2]} intensity={12} angle={0.38} penumbra={0.35} color="#f97316" />
        <pointLight position={[-6, 2, -4]} intensity={8} color="#ffffff" />

        <Float speed={0.6} rotationIntensity={0.6} floatIntensity={1.1}>
          <HelmetModel />
        </Float>
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.18} />
      </Canvas>

      <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
        <span>Live 3D preview</span>
        <span>Rotate enabled</span>
      </div>
    </div>
  )
}