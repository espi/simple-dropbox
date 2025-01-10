let MAX_FILE_SIZE_MB;

// Fetch max file size from server when the script loads
fetch('/config')
    .then(response => response.json())
    .then(config => {
        MAX_FILE_SIZE_MB = config.maxFileSizeMB;
    })
    .catch(error => {
        console.error('Error fetching config:', error);
        MAX_FILE_SIZE_MB = 250; // Fallback value
    });

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const status = document.getElementById('status');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');

// Handle drag and drop events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropZone.classList.add('dragover');
}

function unhighlight(e) {
    dropZone.classList.remove('dragover');
}

dropZone.addEventListener('drop', handleDrop, false);
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFiles);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles({ target: { files: files } });
}

function handleFiles(e) {
    const files = [...e.target.files];
    uploadFiles(files);
}

function uploadFiles(files) {
    status.classList.remove('hidden');
    progressBar.classList.remove('hidden');
    status.textContent = 'Preparing upload...';

    const formData = new FormData();
    files.forEach(file => {
        formData.append('files[]', file);
    });

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/', true);

    xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            progress.style.width = percentComplete + '%';
            status.textContent = `Uploading: ${Math.round(percentComplete)}%`;
        }
    });

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 413) {
                const totalSize = files.reduce((sum, file) => sum + file.size, 0);
                const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(1);
                status.textContent = `Upload failed: Total size (${totalSizeMB}MB) exceeds maximum limit of ${MAX_FILE_SIZE_MB}MB`;
            } else if (xhr.status !== 200) {
                status.textContent = 'Upload failed: ' + (xhr.responseText || 'Unknown error');
            }
        }
    };

    xhr.send(formData);
}