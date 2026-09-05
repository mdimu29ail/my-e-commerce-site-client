import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ThreeDProductViewer = ({ imageUrl }) => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // ১. সিন (Scene) তৈরি করা
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate-900 ব্যাকগ্রাউন্ড

    // ২. ক্যামেরা (Camera) সেটআপ
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5.5;

    // ৩. রেন্ডারার (Renderer) সেটআপ
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ৪. টেক্সচার লোডার (Texture Loader)
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    // ৫. বক্স মডেল এবং ম্যাটেরিয়াল গ্রিড
    const boxGeo = new THREE.BoxGeometry(1.8, 2.4, 0.6); // ৩ডি প্যাকেজিং বক্স সাইজ
    
    // ডিফল্ট সাইড ম্যাটেরিয়াল
    const sideMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b, // Slate-800
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const materials = [
      sideMat, // ডান (Right)
      sideMat, // বাম (Left)
      sideMat, // উপর (Top)
      sideMat, // নিচে (Bottom)
      sideMat, // সামনে (Front) - টেক্সচার লোড হলে আপডেট হবে
      sideMat  // পিছে (Back)
    ];

    const boxMesh = new THREE.Mesh(boxGeo, materials);
    boxMesh.castShadow = true;
    scene.add(boxMesh);

    // প্যাডেস্টাল/স্ট্যান্ড (Showroom Pedestal)
    const pedestalGeo = new THREE.CylinderGeometry(1.5, 1.7, 0.2, 32);
    const pedestalMat = new THREE.MeshPhysicalMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.8;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // প্যাডেস্টালের নিচের নিয়ন রিং (Glowing Neon Ring)
    const ringGeo = new THREE.TorusGeometry(1.52, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x6366f1 }); // Indigo নিয়ন গ্লো
    const neonRing = new THREE.Mesh(ringGeo, ringMat);
    neonRing.rotation.x = Math.PI / 2;
    neonRing.position.y = -1.7;
    scene.add(neonRing);

    // ইমেজ লোড করা
    textureLoader.load(
      imageUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        
        // ফ্রন্ট ম্যাটেরিয়াল এ ইমেজ সেট করা
        const frontMat = new THREE.MeshPhysicalMaterial({
          map: texture,
          roughness: 0.35,
          metalness: 0.1,
          clearcoat: 0.8,
        });

        // ৫ নাম্বার ইনডেক্সটি হচ্ছে বক্সের সামনের দিক (Front face of BoxGeometry)
        materials[4] = frontMat;
        boxMesh.material = [...materials];
        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.error('Error loading product image texture, using fallback material:', err);
        // ফেইলড হলে ব্যাকআপ গোল্ডেন নিয়ন কালার ফ্রন্ট ম্যাটেরিয়াল
        const fallbackMat = new THREE.MeshPhysicalMaterial({
          color: 0x4f46e5,
          metalness: 0.9,
          roughness: 0.1,
          clearcoat: 1.0,
        });
        materials[4] = fallbackMat;
        boxMesh.material = [...materials];
        setIsLoading(false);
      }
    );

    // ৬. লাইটিং (Studio Lights Setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.0); // মূল লাইট
    mainLight.position.set(2, 4, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const blueSpot = new THREE.PointLight(0x3b82f6, 3, 10); // নিয়ন নীল স্পটলাইট
    blueSpot.position.set(-3, 2, 2);
    scene.add(blueSpot);

    const pinkSpot = new THREE.PointLight(0xec4899, 3, 10); // নিয়ন গোলাপী স্পটলাইট
    pinkSpot.position.set(3, -2, 2);
    scene.add(pinkSpot);

    // ৭. ড্র্যাগ ইন্টারঅ্যাকশন (Drag & Rotate Controls)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let autoRotate = true;
    let interactionTimeout = null;

    const handleStart = (clientX, clientY) => {
      isDragging = true;
      autoRotate = false;
      previousMousePosition = { x: clientX, y: clientY };

      if (interactionTimeout) clearTimeout(interactionTimeout);
    };

    const handleMove = (clientX, clientY) => {
      if (!isDragging) return;

      const deltaMove = {
        x: clientX - previousMousePosition.x,
        y: clientY - previousMousePosition.y
      };

      // বক্স ঘুরানো
      boxMesh.rotation.y += deltaMove.x * 0.007;
      boxMesh.rotation.x += deltaMove.y * 0.007;

      // লিমিট সেট করা যাতে সম্পূর্ণ উল্টে না যায়
      boxMesh.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, boxMesh.rotation.x));

      previousMousePosition = { x: clientX, y: clientY };
    };

    const handleEnd = () => {
      isDragging = false;
      
      // ৫ সেকেন্ড নিষ্ক্রিয় থাকলে আবার অটোমেটিক ঘুরতে থাকবে
      interactionTimeout = setTimeout(() => {
        autoRotate = true;
      }, 5000);
    };

    // মাউস ইভেন্ট লিসেনার
    const onMouseDown = (e) => handleStart(e.clientX, e.clientY);
    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => handleEnd();

    // টাচ ইভেন্ট লিসেনার (মোবাইল ফ্রেন্ডলি)
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        handleStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 1) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => handleEnd();

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchmove', onTouchMove);
    container.addEventListener('touchend', onTouchEnd);

    // মাউস হুইল জুম (Zoom Control)
    const onWheel = (e) => {
      e.preventDefault();
      camera.position.z = Math.max(3.5, Math.min(8.0, camera.position.z + e.deltaY * 0.005));
    };
    container.addEventListener('wheel', onWheel, { passive: false });

    // ৮. স্ক্রিন সাইজ রিসাইজ
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 450;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // ৯. অ্যানিমেশন লুপ
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // অটো রোটেশন যদি ইউজার ড্র্যাগ না করে
      if (autoRotate) {
        boxMesh.rotation.y = elapsedTime * 0.3;
        boxMesh.rotation.x = Math.sin(elapsedTime * 0.5) * 0.15;
      }

      // প্যাডেস্টালের নিয়ন লাইটের ইনটেনসিটি অ্যানিমেশন
      neonRing.rotation.z = elapsedTime * 0.2;
      ringMat.color.setHSL(0.6 + Math.sin(elapsedTime) * 0.1, 1.0, 0.5);

      renderer.render(scene, camera);
    };

    animate();

    // ক্লিনআপ
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactionTimeout) clearTimeout(interactionTimeout);

      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('wheel', onWheel);

      window.removeEventListener('resize', handleResize);

      boxGeo.dispose();
      sideMat.dispose();
      materials.forEach((mat) => {
        if (mat !== sideMat) mat.dispose();
      });
      pedestalGeo.dispose();
      pedestalMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageUrl]);

  return (
    <div className="relative w-full h-[450px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-10">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-bold text-sm">Generating 3D Package Box...</p>
        </div>
      )}
      
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      <div className="absolute bottom-4 left-0 right-0 pointer-events-none text-center">
        <p className="text-[10px] text-slate-500 bg-slate-950/70 border border-slate-800/80 px-4 py-1.5 rounded-full inline-block font-black uppercase tracking-widest">
          🖱️ Drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
};

export default ThreeDProductViewer;
