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

    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            status.textContent = response.message;
            setTimeout(() => {
                status.classList.add('hidden');
                progressBar.classList.add('hidden');
                progress.style.width = '0%';
                window.location.reload();
            }, 2000);
        } else {
            status.textContent = 'Upload failed';
        }
    };

    xhr.send(formData);
}