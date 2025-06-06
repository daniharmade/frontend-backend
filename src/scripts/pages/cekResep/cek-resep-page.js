import Camera from "../../utils/camera.js";

export default class CekResepPage {
    async render() {
        return `
      <!-- Navigation -->
      <nav class="navigation">
        <div class="nav-container">
          <div class="logo">
            <a href="/">
              <img src="/images/logo.png" alt="Foodinary Logo">
            </a>
          </div>
          <div class="nav-menu">
            <div class="nav-item"><a href="/">Home</a></div>
            <div class="nav-item"><a href="#/recipe">Recipe</a></div>
            <div class="nav-item active"><a href="#/cek-resep">Check Recipe</a></div>
            <div class="nav-item"><a href="#/about">About</a></div>
          </div>
          <div class="nav-buttons">
            <a href="#/login" class="btn-outline">Login</a>
            <a href="#/register" class="btn-primary">Sign Up</a>
          </div>
        </div>
      </nav>

      <!-- Dietary Preferences Section -->
      <section class="dietary-section">
        <div class="section-container">
          <h2 class="dietary-title">We will provide a recipe based on your photo.</h2>       
          <p class="dietary-title-desc">Please upload a photo of your Indonesian dish to discover the recipe!</p>         
        </div>   
        <div class="recipe-finder-upload-link">
          <a href="/#/recipe">Or direct to this page to search your recipe</a>
        </div>
        <div class="upload-section">
          <div id="drop-area">
            <div id="upload-instruction">
              <i class="fas fa-cloud-upload-alt icon-upload"></i><br>
              Drag and drop a photo here.
            </div>
            <!-- Preview image akan muncul di sini -->
            <img id="preview-image" width="320" height="200" style="margin-top:10px; display:none; object-fit:contain; border:1px solid #ddd;"/>
            <!-- Video untuk camera preview -->
            <video id="camera-stream" width="320" height="200" autoplay style="margin-top:10px; display:none; object-fit:contain; border:1px solid #ddd;" hidden></video>
          </div>
          <input 
            type="file" 
            id="file-input" 
            accept="image/*" 
            class="hidden-input"
          >
          <div class="upload-btn-group">
            <button 
              class="btn-primary"                    
              id="upload-btn"
            >
              Upload
            </button>
            <button 
              class="btn-outline custom-outline-btn"
              id="camera-btn"
            >
              Camera
            </button>
            <button
              class="btn-outline custom-outline-btn"
              id="stop-camera-btn"
              hidden
            >
              Stop
            </button>
            <button 
              class="btn-primary"                    
              id="analyze-btn"
              hidden
            >
              Analyze
            </button>
          </div>
          <div id="selected-file-name" class="selected-file-name"></div>

          <!-- Canvas untuk capture foto -->
          <canvas id="camera-canvas" width="320" height="200" class="camera-canvas" hidden></canvas>
          <button 
            id="capture-btn"
            class="btn-primary"            
            hidden
          >
            Ambil Foto
          </button>
        </div>        
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-container">
          <div>
            <div class="footer-brand">Foodinary</div>                
          </div>
          <div class="footer-menu">
            <div class="footer-column">
              <h4>Cuisine</h4>
              <div class="footer-links">
                <div class="footer-link">Indonesian Cuisine</div>
                <div class="footer-link">Tempe Mendoan</div>
                <div class="footer-link">Rawon</div>
                <div class="footer-link">Sate</div>
              </div>
            </div>
            
            <div class="footer-column">
              <h4>Challenge</h4>
              <div class="footer-links">
                <div class="footer-link">Challenge</div>
                <div class="footer-link">90 Days of Cooking</div>
                <div class="footer-link">Page</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    `;
    }

    async afterRender() {
        const fileInput = document.getElementById("file-input");
        const uploadBtn = document.getElementById("upload-btn");
        const cameraBtn = document.getElementById("camera-btn");
        const stopCameraBtn = document.getElementById("stop-camera-btn");
        const analyzeBtn = document.getElementById("analyze-btn");
        const selectedFileName = document.getElementById("selected-file-name");
        const cameraStream = document.getElementById("camera-stream");
        const cameraCanvas = document.getElementById("camera-canvas");
        const captureBtn = document.getElementById("capture-btn");
        const previewImage = document.getElementById("preview-image");
        const uploadInstruction = document.getElementById("upload-instruction");
        const dropArea = document.getElementById("drop-area");

        // Inisialisasi Camera instance
        const camera = new Camera({
            video: cameraStream,
            cameraSelect: document.createElement("select"),
            canvas: cameraCanvas,
        });

        const showUploadInstruction = () => {
            uploadInstruction.style.display = "block";
            previewImage.style.display = "none";
            cameraStream.style.display = "none";
            analyzeBtn.hidden = true;
        };

        const hideUploadInstruction = () => {
            uploadInstruction.style.display = "none";
        };

        // Fungsi buka kamera
        const openCamera = async () => {
            cameraStream.hidden = false;
            cameraStream.style.display = "block";
            captureBtn.hidden = false;
            cameraCanvas.hidden = true;
            previewImage.style.display = "none";
            selectedFileName.textContent = "";
            analyzeBtn.hidden = true;

            stopCameraBtn.hidden = false;
            hideUploadInstruction();

            await camera.launch();
        };

        // Fungsi capture foto
        const capturePhoto = async () => {
            const blob = await camera.takePicture();
            if (!blob) return alert("Failed to capture photo.");

            // Stop kamera
            camera.stop();
            stopCameraBtn.hidden = true;

            // Sembunyikan video dan tombol capture
            cameraStream.style.display = "none";
            cameraStream.hidden = true;
            captureBtn.hidden = true;
            cameraCanvas.hidden = true;

            // Buat URL object untuk preview gambar
            const imgURL = URL.createObjectURL(blob);
            previewImage.src = imgURL;
            previewImage.style.display = "block";

            selectedFileName.textContent = "";
            hideUploadInstruction();
            analyzeBtn.hidden = false; // Show Analyze button after capturing photo

            // Simpan blob ke file input untuk upload
            const file = new File([blob], "captured-photo.jpg", {
                type: "image/jpeg",
            });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
        };

        // Fungsi stop kamera manual
        const stopCamera = () => {
            camera.stop();
            cameraStream.hidden = true;
            cameraStream.style.display = "none";
            cameraCanvas.hidden = true;
            captureBtn.hidden = true;
            stopCameraBtn.hidden = true;
            analyzeBtn.hidden = true;

            previewImage.style.display = "none";
            selectedFileName.textContent = "";
            showUploadInstruction();
        };

        // Preview file upload
        const previewUploadFile = (file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.style.display = "block";
                cameraStream.style.display = "none";
                hideUploadInstruction();
                analyzeBtn.hidden = false; // Show Analyze button after uploading file
            };
            reader.readAsDataURL(file);
        };

        // Fungsi untuk analisis gambar (placeholder)
        const analyzeImage = () => {
            if (fileInput.files.length === 0) {
                alert("No image selected for analysis.");
                return;
            }
            const file = fileInput.files[0];
            // Placeholder untuk logika analisis gambar
            console.log("Analyzing image:", file.name);
            alert("Image analysis started for: " + file.name);
            // TODO: Tambahkan logika untuk mengirim file ke API atau proses analisis
            // Contoh: Kirim file ke server atau API untuk analisis resep
            // const formData = new FormData();
            // formData.append("image", file);
            // fetch("https://api.example.com/analyze", { method: "POST", body: formData })
            //     .then(response => response.json())
            //     .then(data => console.log("Analysis result:", data))
            //     .catch(error => console.error("Analysis failed:", error));
        };

        // Drag and drop functionality
        dropArea.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropArea.style.border = "2px dashed #007bff"; // Visual feedback
        });

        dropArea.addEventListener("dragleave", () => {
            dropArea.style.border = "1px solid #ddd"; // Reset border
        });

        dropArea.addEventListener("drop", (e) => {
            e.preventDefault();
            dropArea.style.border = "1px solid #ddd"; // Reset border

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                selectedFileName.textContent = "";
                previewUploadFile(files[0]);
            } else if (
                cameraStream.srcObject &&
                cameraStream.style.display !== "none"
            ) {
                // Handle camera stream being dragged into drop area
                capturePhoto(); // Capture photo if camera stream is active
            }
        });

        // Click drop area to trigger file input
        dropArea.addEventListener("click", () => {
            if (cameraStream.style.display === "none") {
                fileInput.click(); // Open file input only if camera is not active
            }
        });

        // Event listeners
        cameraBtn.addEventListener("click", openCamera);
        captureBtn.addEventListener("click", capturePhoto);
        stopCameraBtn.addEventListener("click", stopCamera);
        analyzeBtn.addEventListener("click", analyzeImage);

        uploadBtn.addEventListener("click", () => {
            fileInput.click();
        });

        fileInput.addEventListener("change", () => {
            if (fileInput.files.length > 0) {
                selectedFileName.textContent = "";
                previewUploadFile(fileInput.files[0]);
            } else {
                selectedFileName.textContent = "";
                previewImage.style.display = "none";
                cameraStream.style.display = "none";
                analyzeBtn.hidden = true;
                showUploadInstruction();
            }
        });
    }
}