/**
 * 3D Renderer for N-Queens Game
 * Uses Three.js for 3D visualization
 */

class NQueens3DRenderer {
    constructor(n, canvas) {
        this.n = n;
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.board = null;
        this.queens = [];
        this.squares = [];

        this.initScene();
        this.setupLighting();
        this.createBoard();
        this.animate();
    }

    initScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 100, 500);

        // Camera
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(this.n / 2, this.n * 0.8, this.n * 1.2);
        this.camera.lookAt(this.n / 2, 0, this.n / 2);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(this.n / 2, this.n, this.n);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.left = -this.n;
        directionalLight.shadow.camera.right = this.n * 2;
        directionalLight.shadow.camera.top = this.n * 2;
        directionalLight.shadow.camera.bottom = -this.n;
        this.scene.add(directionalLight);

        // Point light for highlights
        const pointLight = new THREE.PointLight(0x667eea, 0.5);
        pointLight.position.set(this.n / 2, this.n * 1.5, -this.n);
        this.scene.add(pointLight);
    }

    createBoard() {
        const groupSize = 20;
        const squares = [];

        for (let row = 0; row < this.n; row++) {
            for (let col = 0; col < this.n; col++) {
                const isWhite = (row + col) % 2 === 0;
                const color = isWhite ? 0xf0d9b5 : 0xbaca44;

                const geometry = new THREE.BoxGeometry(1, 0.1, 1);
                const material = new THREE.MeshLambertMaterial({ color });
                const square = new THREE.Mesh(geometry, material);

                square.position.set(col, 0, row);
                square.castShadow = true;
                square.receiveShadow = true;
                square.userData = { row, col, isWhite };

                this.scene.add(square);
                squares.push(square);
            }
        }

        // Add board border
        this.addBoardBorder();

        this.squares = squares;
    }

    addBoardBorder() {
        const borderMaterial = new THREE.LineBasicMaterial({ color: 0x333333, linewidth: 3 });
        const points = [
            new THREE.Vector3(0, 0.15, 0),
            new THREE.Vector3(this.n, 0.15, 0),
            new THREE.Vector3(this.n, 0.15, this.n),
            new THREE.Vector3(0, 0.15, this.n),
            new THREE.Vector3(0, 0.15, 0),
        ];

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const border = new THREE.Line(geometry, borderMaterial);
        this.scene.add(border);

        // Add corner pillars
        this.addPillar(0, 0);
        this.addPillar(this.n, 0);
        this.addPillar(this.n, this.n);
        this.addPillar(0, this.n);
    }

    addPillar(x, z) {
        const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8);
        const material = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const pillar = new THREE.Mesh(geometry, material);
        pillar.position.set(x, 0.15, z);
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        this.scene.add(pillar);
    }

    createQueen(row, col, threatLevel = 0) {
        const group = new THREE.Group();
        group.position.set(col, 0.2, row);

        // Queen base (crown)
        const baseGeometry = new THREE.ConeGeometry(0.3, 0.2, 8);
        const baseColor = threatLevel > 0 ? 0xff6b6b : 0x4169e1;
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: baseColor,
            metalness: 0.6,
            roughness: 0.4,
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.15;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

        // Crown jewels
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const jewelGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const jewelMaterial = new THREE.MeshStandardMaterial({
                color: 0xffd700,
                metalness: 0.8,
                roughness: 0.2,
            });
            const jewel = new THREE.Mesh(jewelGeometry, jewelMaterial);
            jewel.position.set(
                Math.cos(angle) * 0.25,
                0.25,
                Math.sin(angle) * 0.25
            );
            jewel.castShadow = true;
            jewel.receiveShadow = true;
            group.add(jewel);
        }

        group.userData = { row, col, threatLevel };
        this.scene.add(group);
        return group;
    }

    updateSquareColors(threatMap) {
        this.squares.forEach(square => {
            const { row, col, isWhite } = square.userData;
            const key = `${row},${col}`;
            const isThreatened = threatMap.has(key);

            let color;
            if (isThreatened) {
                color = new THREE.Color(0xffcccb); // Light red for threatened
            } else if (isWhite) {
                color = new THREE.Color(0xf0d9b5);
            } else {
                color = new THREE.Color(0xbaca44);
            }

            square.material.color = color;
        });
    }

    render(board, threatMap) {
        // Clear existing queens
        this.queens.forEach(queen => this.scene.remove(queen));
        this.queens = [];

        // Update square colors based on threats
        this.updateSquareColors(threatMap);

        // Add queens
        for (let row = 0; row < this.n; row++) {
            if (board[row] !== -1) {
                const col = board[row];
                const key = `${row},${col}`;
                const threatLevel = threatMap.has(key) ? 1 : 0;
                const queen = this.createQueen(row, col, threatLevel);
                this.queens.push(queen);
            }
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotate camera slightly
        const time = Date.now() * 0.0001;
        const radius = this.n * 1.5;
        this.camera.position.x = this.n / 2 + Math.cos(time) * radius * 0.3;
        this.camera.position.z = this.n / 2 + Math.sin(time) * radius * 0.3;
        this.camera.lookAt(this.n / 2, 0, this.n / 2);

        // Rotate queens
        this.queens.forEach(queen => {
            queen.rotation.y += 0.01;
        });

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}
