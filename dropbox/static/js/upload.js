let MAX_FILE_SIZE_MB;

// Fetch max file size from server when the script loads
async function fetchConfig() {
    try {
        const response = await fetch('/config');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const config = await response.json();
        MAX_FILE_SIZE_MB = config.maxFileSizeMB;
    } catch (error) {
        console.error('Error fetching config:', error);
        MAX_FILE_SIZE_MB = 250; // Fallback value
    }
}

fetchConfig();

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

async function uploadFiles(files) {
    status.classList.remove('hidden');
    // progressBar.classList.remove('hidden'); // Progress bar may not be directly applicable with fetch like XHR
    status.textContent = 'Preparing upload...';

    const formData = new FormData();
    files.forEach(file => {
        formData.append('files[]', file);
    });

    // Note: Fetch API does not directly support upload progress events like XMLHttpRequest.
    // For simplicity, we'll remove the granular progress bar update.
    // A more complex solution involving ReadableStream could provide progress, but is beyond this scope.
    progress.style.width = '0%'; // Reset progress bar

    try {
        status.textContent = 'Uploading...'; // General uploading message
        const response = await fetch('/', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            status.textContent = 'Upload successful!';
            // Potentially hide progress bar or reset status after a delay
            // progressBar.classList.add('hidden');
        } else {
            if (response.status === 413) {
                const totalSize = files.reduce((sum, file) => sum + file.size, 0);
                const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(1);
                status.textContent = `Upload failed: Total size (${totalSizeMB}MB) exceeds maximum limit of ${MAX_FILE_SIZE_MB}MB`;
            } else {
                let errorMsg = 'Unknown error';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorData.error || JSON.stringify(errorData);
                } catch (e) {
                    // If response is not JSON or another error occurs during parsing
                    errorMsg = await response.text();
                }
                status.textContent = `Upload failed: ${errorMsg}`;
            }
        }
    } catch (error) {
        console.error('Error during upload:', error);
        status.textContent = `Upload failed: Network error or server unavailable. ${error.message}`;
    } finally {
        // Consider hiding progress bar here if it was shown
        // progressBar.classList.add('hidden');
        // Or reset progress after a short delay for user to see the final status
        setTimeout(() => {
            // progress.style.width = '0%';
            // status.classList.add('hidden');
        }, 5000); // Hide after 5 seconds
    }
}