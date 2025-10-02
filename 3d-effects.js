// 3D Effects and Animations
class Portfolio3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('bg-canvas'),
            alpha: true,
            antialias: !window.portfolioConfig.isMobile
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.portfolioConfig.isMobile ? 1 : window.devicePixelRatio);

        // Create particle system
        this.createParticleSystem();

        // Create floating geometries
        this.createFloatingGeometries();
    }

    createParticleSystem() {
        const particleCount = window.portfolioConfig.particleCount;
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = (Math.random() - 0.5) * 10;
            positions[i + 2] = (Math.random() - 0.5) * 10;

            velocities[i] = (Math.random() - 0.5) * 0.02;
            velocities[i + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i + 2] = (Math.random() - 0.5) * 0.02;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: window.portfolioConfig.isMobile ? 0.02 : 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);

        // Store velocities for animation
        this.particleVelocities = velocities;
    }

    createFloatingGeometries() {
        if (window.portfolioConfig.performanceMode === 'low') return;

        const geometries = [
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.SphereGeometry(0.3, 8, 8),
            new THREE.ConeGeometry(0.3, 0.8, 6)
        ];

        const materials = [
            new THREE.MeshBasicMaterial({ 
                color: 0xff6b6b, 
                transparent: true, 
                opacity: 0.3,
                wireframe: true 
            }),
            new THREE.MeshBasicMaterial({ 
                color: 0x4ecdc4, 
                transparent: true, 
                opacity: 0.3,
                wireframe: true 
            }),
            new THREE.MeshBasicMaterial({ 
                color: 0xffa500, 
                transparent: true, 
                opacity: 0.3,
                wireframe: true 
            })
        ];

        this.floatingObjects = [];

        for (let i = 0; i < 5; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.set(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 4
            );

            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            this.floatingObjects.push({
                mesh: mesh,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                }
            });

            this.scene.add(mesh);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Animate particles
        if (this.particleSystem) {
            const positions = this.particleSystem.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += this.particleVelocities[i] * window.portfolioConfig.animationSpeed;
                positions[i + 1] += this.particleVelocities[i + 1] * window.portfolioConfig.animationSpeed;
                positions[i + 2] += this.particleVelocities[i + 2] * window.portfolioConfig.animationSpeed;

                // Boundary check
                if (Math.abs(positions[i]) > 5) this.particleVelocities[i] *= -1;
                if (Math.abs(positions[i + 1]) > 5) this.particleVelocities[i + 1] *= -1;
                if (Math.abs(positions[i + 2]) > 5) this.particleVelocities[i + 2] *= -1;
            }
            
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
            this.particleSystem.rotation.y += 0.001;
        }

        // Animate floating objects
        if (this.floatingObjects) {
            this.floatingObjects.forEach(obj => {
                obj.mesh.rotation.x += obj.rotationSpeed.x;
                obj.mesh.rotation.y += obj.rotationSpeed.y;
                obj.mesh.rotation.z += obj.rotationSpeed.z;
            });
        }

        // Mouse interaction
        this.camera.position.x += (this.mouseX * 0.0005 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY * 0.0005 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }

    setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX - this.windowHalfX;
            this.mouseY = event.clientY - this.windowHalfY;
        });

        // Touch movement for mobile
        document.addEventListener('touchmove', (event) => {
            if (event.touches.length > 0) {
                this.mouseX = event.touches[0].clientX - this.windowHalfX;
                this.mouseY = event.touches[0].clientY - this.windowHalfY;
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.windowHalfX = window.innerWidth / 2;
            this.windowHalfY = window.innerHeight / 2;
            
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

// Loading Screen Animation
class LoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.loadingBar = document.querySelector('.loading-bar');
        this.progress = 0;
        
        this.startLoading();
    }

    startLoading() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 15;
            
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                setTimeout(() => this.hideLoading(), 500);
            }
            
            this.loadingBar.style.width = this.progress + '%';
        }, 200);
    }

    hideLoading() {
        this.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Intersection Observer for animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.observerOptions
        );
        
        this.setupObservers();
        this.setupScrollTriggers();
    }

    setupObservers() {
        const animatedElements = document.querySelectorAll('.card, .imageAboutPage, .hero-text > *');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            this.observer.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.observer.unobserve(entry.target);
            }
        });
    }

    setupScrollTriggers() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Parallax effect for sections
        gsap.utils.toArray('section').forEach((section, i) => {
            if (i === 0) return; // Skip hero section
            
            gsap.fromTo(section, {
                y: 100,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    new LoadingScreen();
    
    // Initialize 3D effects after a short delay
    setTimeout(() => {
        new Portfolio3D();
        new ScrollAnimations();
    }, 1000);

    // Hero button interactions
    const exploreBtn = document.getElementById('exploreBtn');
    const contactBtn = document.getElementById('contactBtn');

    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            document.getElementById('portfolio').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }

    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            document.getElementById('contact').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
});