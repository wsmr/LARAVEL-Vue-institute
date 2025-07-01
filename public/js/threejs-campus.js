// 3D Campus Visualization using Three.js
class CampusVisualization {
    constructor() {
        this.container = document.getElementById('campus3D');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.buildings = [];
        this.animationId = null;
        
        if (this.container) {
            this.init();
        }
    }

    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createControls();
        this.createLighting();
        this.createCampus();
        this.addEventListeners();
        this.animate();
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Add fog for depth
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);
    }

    createCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(30, 20, 30);
        this.camera.lookAt(0, 0, 0);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
    }

    createControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2.2; // Prevent going below ground
        this.controls.minDistance = 10;
        this.controls.maxDistance = 100;
    }

    createLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 25);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 200;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        this.scene.add(directionalLight);
    }

    createCampus() {
        // Create ground
        this.createGround();
        
        // Create buildings
        this.createMainBuilding();
        this.createLibrary();
        this.createLaboratory();
        this.createStudentCenter();
        this.createSportsComplex();
        
        // Create landscape
        this.createTrees();
        this.createPaths();
        this.createFountain();
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    createMainBuilding() {
        const building = this.createBuilding(8, 15, 12, 0x8B4513, 'Main Academic Building');
        building.position.set(0, 7.5, 0);
        this.scene.add(building);
        this.buildings.push(building);
    }

    createLibrary() {
        const building = this.createBuilding(10, 8, 8, 0x4682B4, 'Central Library');
        building.position.set(-20, 4, 15);
        this.scene.add(building);
        this.buildings.push(building);
    }

    createLaboratory() {
        const building = this.createBuilding(6, 6, 10, 0x708090, 'Science Laboratory');
        building.position.set(20, 3, 10);
        this.scene.add(building);
        this.buildings.push(building);
    }

    createStudentCenter() {
        const building = this.createBuilding(12, 5, 6, 0xDC143C, 'Student Center');
        building.position.set(-15, 2.5, -20);
        this.scene.add(building);
        this.buildings.push(building);
    }

    createSportsComplex() {
        const building = this.createBuilding(15, 4, 8, 0x32CD32, 'Sports Complex');
        building.position.set(15, 2, -15);
        this.scene.add(building);
        this.buildings.push(building);
    }

    createBuilding(width, height, depth, color, name) {
        const group = new THREE.Group();
        
        // Main building structure
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshLambertMaterial({ color: color });
        const building = new THREE.Mesh(geometry, material);
        building.castShadow = true;
        building.receiveShadow = true;
        group.add(building);

        // Roof
        const roofGeometry = new THREE.ConeGeometry(Math.max(width, depth) * 0.7, 2, 4);
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = height / 2 + 1;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);

        // Windows
        this.addWindows(group, width, height, depth);

        // Store building name for interaction
        group.userData = { name: name };

        return group;
    }

    addWindows(building, width, height, depth) {
        const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x87CEEB });
        const windowGeometry = new THREE.PlaneGeometry(1, 1.5);

        // Front and back windows
        for (let i = -width/2 + 2; i < width/2; i += 3) {
            for (let j = -height/2 + 2; j < height/2; j += 3) {
                // Front windows
                const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
                frontWindow.position.set(i, j, depth/2 + 0.01);
                building.add(frontWindow);

                // Back windows
                const backWindow = new THREE.Mesh(windowGeometry, windowMaterial);
                backWindow.position.set(i, j, -depth/2 - 0.01);
                backWindow.rotation.y = Math.PI;
                building.add(backWindow);
            }
        }

        // Side windows
        for (let i = -depth/2 + 2; i < depth/2; i += 3) {
            for (let j = -height/2 + 2; j < height/2; j += 3) {
                // Left windows
                const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
                leftWindow.position.set(-width/2 - 0.01, j, i);
                leftWindow.rotation.y = Math.PI / 2;
                building.add(leftWindow);

                // Right windows
                const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
                rightWindow.position.set(width/2 + 0.01, j, i);
                rightWindow.rotation.y = -Math.PI / 2;
                building.add(rightWindow);
            }
        }
    }

    createTrees() {
        for (let i = 0; i < 20; i++) {
            const tree = this.createTree();
            tree.position.set(
                (Math.random() - 0.5) * 80,
                0,
                (Math.random() - 0.5) * 80
            );
            
            // Avoid placing trees on buildings
            if (this.isPositionClear(tree.position)) {
                this.scene.add(tree);
            }
        }
    }

    createTree() {
        const group = new THREE.Group();

        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2;
        trunk.castShadow = true;
        group.add(trunk);

        // Leaves
        const leavesGeometry = new THREE.SphereGeometry(3);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 5;
        leaves.castShadow = true;
        group.add(leaves);

        return group;
    }

    createPaths() {
        const pathMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
        
        // Main path
        const mainPathGeometry = new THREE.PlaneGeometry(4, 60);
        const mainPath = new THREE.Mesh(mainPathGeometry, pathMaterial);
        mainPath.rotation.x = -Math.PI / 2;
        mainPath.position.y = 0.01;
        this.scene.add(mainPath);

        // Cross path
        const crossPathGeometry = new THREE.PlaneGeometry(60, 4);
        const crossPath = new THREE.Mesh(crossPathGeometry, pathMaterial);
        crossPath.rotation.x = -Math.PI / 2;
        crossPath.position.y = 0.01;
        this.scene.add(crossPath);
    }

    createFountain() {
        const group = new THREE.Group();

        // Base
        const baseGeometry = new THREE.CylinderGeometry(3, 3, 0.5);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x708090 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.25;
        group.add(base);

        // Water
        const waterGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.1);
        const waterMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4169E1, 
            transparent: true, 
            opacity: 0.7 
        });
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.position.y = 0.55;
        group.add(water);

        // Center pillar
        const pillarGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2);
        const pillarMaterial = new THREE.MeshLambertMaterial({ color: 0x708090 });
        const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
        pillar.position.y = 1.5;
        group.add(pillar);

        group.position.set(0, 0, 25);
        this.scene.add(group);
    }

    isPositionClear(position) {
        // Simple collision detection to avoid placing trees on buildings
        const minDistance = 8;
        for (let building of this.buildings) {
            const distance = position.distanceTo(building.position);
            if (distance < minDistance) {
                return false;
            }
        }
        return true;
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Add click interaction
        this.renderer.domElement.addEventListener('click', (event) => this.onMouseClick(event));
    }

    onWindowResize() {
        if (!this.container) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    onMouseClick(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.buildings, true);
        if (intersects.length > 0) {
            const building = intersects[0].object.parent;
            if (building.userData && building.userData.name) {
                this.showBuildingInfo(building.userData.name);
            }
        }
    }

    showBuildingInfo(buildingName) {
        // Create a simple tooltip or alert
        const info = document.createElement('div');
        info.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50';
        info.textContent = `You clicked on: ${buildingName}`;
        document.body.appendChild(info);

        setTimeout(() => {
            document.body.removeChild(info);
        }, 3000);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            if (this.container && this.renderer.domElement) {
                this.container.removeChild(this.renderer.domElement);
            }
        }
    }
}

// Initialize 3D campus when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.campusVisualization = new CampusVisualization();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CampusVisualization;
}

