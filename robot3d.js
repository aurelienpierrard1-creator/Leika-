// robot3d.js - Robot IA 3D pour AI Trader Factory
// À inclure après Three.js CDN
(function() {
  const container = document.getElementById('robotStage');
  if (!container) return;

  // Créer le canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'robotCanvas';
  canvas.style.width = '100%';
  canvas.style.height = '280px';
  canvas.style.borderRadius = '12px';
  
  // Remplacer le contenu CSS robot par le canvas (ou ajouter)
  const world = container.querySelector('.robot-world');
  if (world) {
    world.innerHTML = '';
    world.appendChild(canvas);
  } else {
    container.appendChild(canvas);
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / 280, 0.1, 100);
  camera.position.set(0, 1.2, 4.5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, 280);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0);

  // Lumières
  scene.add(new THREE.AmbientLight(0x223344, 0.8));
  const light = new THREE.PointLight(0x00f0ff, 2, 15);
  light.position.set(2, 3, 3);
  scene.add(light);
  const light2 = new THREE.PointLight(0xb026ff, 1.2, 10);
  light2.position.set(-2, 1, 2);
  scene.add(light2);

  // Robot
  const robot = new THREE.Group();
  const mat = new THREE.MeshPhongMaterial({ color: 0x112233, emissive: 0x003355, shininess: 60 });
  const glow = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

  // Tête
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.6), mat);
  head.position.y = 1.8;
  robot.add(head);
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.1), glow);
  eyeL.position.set(-0.18, 1.9, 0.3);
  robot.add(eyeL);
  const eyeR = eyeL.clone(); eyeR.position.x = 0.18; robot.add(eyeR);

  // Antenne
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5), glow);
  ant.position.set(0, 2.3, 0); robot.add(ant);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.07), glow);
  tip.position.set(0, 2.6, 0); robot.add(tip);

  // Corps
  const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1.2, 0.5), mat);
  body.position.y = 0.8; robot.add(body);
  const chest = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.08), glow);
  chest.position.set(0, 1, 0.28); robot.add(chest);

  // Bras / Jambes simplifiés
  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1), mat);
  armL.position.set(-0.75, 0.8, 0); armL.rotation.z = 0.4; robot.add(armL);
  const armR = armL.clone(); armR.position.x = 0.75; armR.rotation.z = -0.4; robot.add(armR);

  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.9), mat);
  legL.position.set(-0.3, -0.2, 0); robot.add(legL);
  const legR = legL.clone(); legR.position.x = 0.3; robot.add(legR);

  // Base hologramme
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.7, 1.1, 32), new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = -0.7; robot.add(ring);

  scene.add(robot);
  robot.position.y = 0.3;

  // Particules
  const pGeo = new THREE.BufferGeometry();
  const pCount = 80;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 3;
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x00f0ff, size: 0.05, transparent: true, opacity: 0.7 }));
  scene.add(particles);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.012;
    robot.position.y = 0.3 + Math.sin(t * 1.8) * 0.12;
    robot.rotation.y = Math.sin(t * 0.4) * 0.4;
    tip.scale.setScalar(1 + Math.sin(t * 6) * 0.25);
    eyeL.scale.setScalar(1 + Math.sin(t * 5) * 0.15);
    eyeR.scale.setScalar(1 + Math.sin(t * 5) * 0.15);
    particles.rotation.y = t * 0.3;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    camera.aspect = w / 280;
    camera.updateProjectionMatrix();
    renderer.setSize(w, 280);
  });
})();
