import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeDHeroCanvas = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    // ১. সিন (Scene) তৈরি করা
    const scene = new THREE.Scene();

    // ২. ক্যামেরা (Camera) সেটআপ
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8;

    // ৩. রেন্ডারার (Renderer) সেটআপ
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ৪. কোরের ৩ডি জিওমেট্রি ও ম্যাটেরিয়াল (Central Core Object)
    const coreGeo = new THREE.SphereGeometry(1.2, 64, 64);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5, // Indigo-600
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: 0x312e81,
      emissiveIntensity: 0.3,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // ৫. ঘূর্ণায়মান রিং গ্রুপ (Orbiting Ring Group)
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const ringCount = 3;
    const rings = [];
    const ringColors = [0xf59e0b, 0xec4899, 0x10b981]; // Amber-500, Pink-500, Emerald-500

    for (let i = 0; i < ringCount; i++) {
      const radius = 2.0 + i * 0.45;
      const tube = 0.035;
      const ringGeo = new THREE.TorusGeometry(radius, tube, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: ringColors[i],
        metalness: 1.0,
        roughness: 0.15,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);

      // ভিন্ন কোণে রিং সেটআপ করা
      ringMesh.rotation.x = Math.PI / 4 + (i * Math.PI) / 6;
      ringMesh.rotation.y = Math.PI / 6 - (i * Math.PI) / 8;
      ringGroup.add(ringMesh);
      rings.push(ringMesh);
    }

    // ৬. স্যাটেলাইট অবজেক্টসমূহ (Floating Orbiting Satellites)
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);
    const satellites = [];
    const satCount = 4;

    for (let i = 0; i < satCount; i++) {
      const satGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
      const satMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.9,
        clearcoat: 1.0,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      const angle = (i / satCount) * Math.PI * 2;
      const radius = 2.6;

      satMesh.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        (Math.random() - 0.5) * 1.0
      );

      satelliteGroup.add(satMesh);
      satellites.push({
        mesh: satMesh,
        angle: angle,
        speed: 0.008 + i * 0.002,
        radius: radius,
        rotSpeedX: 0.01 + Math.random() * 0.02,
        rotSpeedY: 0.01 + Math.random() * 0.02,
      });
    }

    // ৭. পার্টিকল সিস্টেম (Floating Star/Dust Particles)
    const particleCount = 250;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12; // X
      particlePositions[i + 1] = (Math.random() - 0.5) * 12; // Y
      particlePositions[i + 2] = (Math.random() - 0.5) * 10; // Z
    }

    particleGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0xa5b4fc, // Indigo-300
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ৮. লাইটিং (Lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const indigoDirLight = new THREE.DirectionalLight(0x818cf8, 2.5); // Indigo-400
    indigoDirLight.position.set(5, 5, 5);
    scene.add(indigoDirLight);

    const pinkDirLight = new THREE.DirectionalLight(0xf472b6, 2.0); // Pink-400
    pinkDirLight.position.set(-5, -5, 5);
    scene.add(pinkDirLight);

    const amberPointLight = new THREE.PointLight(0xfbbf24, 3.0, 8); // Amber-400
    amberPointLight.position.set(0, 0, 1.5);
    scene.add(amberPointLight);

    // ৯. মাউস ইন্টারঅ্যাকশন ট্র্যাকিং (Mouse Interaction)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = event => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // মাউস পজিশনকে -১ থেকে ১ এ নরমালাইজ করা
      mouseX = (x / width) * 2 - 1;
      mouseY = -(y / height) * 2 + 1;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // ১০. স্ক্রিন রিসাইজ হ্যান্ডলার (Resize Handler)
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 500;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // ১১. অ্যানিমেশন লুপ (Animation Loop)
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // মাউস ট্র্যাকিং স্মুথ লার্পিং (Smooth mouse follow)
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // মাউস পজিশন অনুযায়ী ক্যামেরা বা অবজেক্ট রোটেশন অ্যাডজাস্ট
      scene.rotation.y = targetX * 0.35;
      scene.rotation.x = -targetY * 0.35;

      // কোরের বেসিক ঘূর্ণন এবং ভাসমান ইফেক্ট
      coreMesh.rotation.y = elapsedTime * 0.25;
      coreMesh.rotation.x = elapsedTime * 0.12;
      coreMesh.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      // রিংগুলোর ঘূর্ণন স্পিড
      rings.forEach((ring, index) => {
        const speedMultiplier = index % 2 === 0 ? 1 : -1;
        ring.rotation.z += 0.006 * speedMultiplier;
        ring.rotation.x += 0.003 * speedMultiplier;
      });

      // স্যাটেলাইটগুলোর ঘূর্ণন এবং অরবিটিং
      satellites.forEach(sat => {
        sat.angle += sat.speed;
        sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
        sat.mesh.position.z = Math.sin(sat.angle) * sat.radius;
        sat.mesh.position.y =
          Math.sin(sat.angle * 2.5) * 0.35 + Math.sin(elapsedTime) * 0.08;
        sat.mesh.rotation.x += sat.rotSpeedX;
        sat.mesh.rotation.y += sat.rotSpeedY;
      });

      // পার্টিকল কণাগুলোর রোটেশন
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.2) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // ক্লিনআপ (Cleanup logic to avoid memory leaks)
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      coreGeo.dispose();
      coreMat.dispose();

      rings.forEach(ring => {
        ring.geometry.dispose();
        ring.material.dispose();
      });

      satellites.forEach(sat => {
        sat.mesh.geometry.dispose();
        sat.mesh.material.dispose();
      });

      particleGeo.dispose();
      particleMat.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] lg:h-[500px] relative pointer-events-auto"
      style={{ touchAction: 'none' }}
    />
  );
};

export default ThreeDHeroCanvas;
