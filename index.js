

    const width = window.innerWidth;
    const height = window.innerHeight;

    const canvasEl = document.getElementById("myCanvas");

    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasEl,
        alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    
    const fov = 60;
    const fovRad = (Math.PI / 180 )* (fov / 2);
    dist = (height / 2) / Math.tan(fovRad);
    
    const camera = new THREE.PerspectiveCamera(fov, width / height, 1, dist * 2);
    camera.position.z = dist;


    const scene = new THREE.Scene();

    const imgArray = Array.from(document.querySelectorAll('img'));

    const loader = new THREE.TextureLoader();






let currentScrollY = 0;

const lerp = (start, end, multiplier) => {
  return (1 - multiplier) * start + multiplier * end;
};




class CreateMesh {   
    
    constructor(img) {
        this.img = img;

        this.init();
        this.update();
    }
    init() {
        this.texture = loader.load(this.img.src);

        this.uniforms = {
            uTexture: { value: this.texture },
            uImageAspect: {
                value: new THREE.Vector2(this.img.naturalWidth, this.img.naturalHeight)
                // value: new THREE.Vector2(1920, 1280)
            },
            uPlaneAspect: {
                value: new THREE.Vector2(this.img.clientWidth, this.img.clientHeight)
                // value: new THREE.Vector2(1000, 500)
            },
            uTime: { value: 0.0 },
            uScroll: { value: 0.0 },
        }

        this.geo = new THREE.PlaneBufferGeometry(1, 1, 100, 100);
        // this.geo = new THREE.PlaneBufferGeometry(1, 1, 100, 100);
    
        this.mat = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: document.getElementById('vertex-shader').textContent,
            fragmentShader: document.getElementById('fragment-shader').textContent,
        });
        
        this.mesh = new THREE.Mesh(this.geo, this.mat);
            
        scene.add(this.mesh);
        
        this.rect = this.img.getBoundingClientRect();
    
        this.mesh.scale.x = this.rect.width;
        this.mesh.scale.y = this.rect.height;
    
        this.meshX = this.rect.left - width/2 + this.rect.width/2;
        this.meshY = -this.rect.top  + height/2 - this.rect.height/2;
    
        this.mesh.position.set(this.meshX, this.meshY, 0);


    }
    update(){

    }

    scroll() {
        this.scrollTop = this.img.getBoundingClientRect().top;
        
        
        this.scrollTop = -this.scrollTop + height/2 - this.rect.height/2;
        this.mesh.position.y = this.scrollTop;


        currentScrollY = lerp(currentScrollY, document.documentElement.scrollTop, 0.1);
        this.mat.uniforms.uScroll.value = document.documentElement.scrollTop - currentScrollY;
    }
}


let imgMesh;
const imgMeshArray = [];

for (const img of imgArray) {
    imgMesh = new CreateMesh(img)
    imgMeshArray.push(imgMesh)
}


document.addEventListener('scroll', () => {
    for (const imgMesh of imgMeshArray) {
        imgMesh.scroll();
        
    }
})





    const loop = () => {

        renderer.render(scene, camera);
        requestAnimationFrame(loop);

    };
    

    window.addEventListener('load', () => {
        loop();
    });

