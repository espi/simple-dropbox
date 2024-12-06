class FileManager {
    constructor() {
        this.initializeDeleteButtons();
    }

    initializeDeleteButtons() {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDelete(e));
        });
    }

    handleDelete(e) {
        const btn = e.target;
        const filepath = btn.dataset.filepath;
        const listItem = btn.closest('li');

        if (confirm('Are you sure you want to delete this file?')) {
            this.deleteFile(filepath, listItem);
        }
    }

    deleteFile(filepath, listItem) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `/delete/${filepath}`, true);

        xhr.onload = () => {
            if (xhr.status === 200) {
                // Remove the list item with animation
                listItem.style.opacity = '0';
                setTimeout(() => {
                    listItem.remove();

                    // Check if batch group is empty
                    const batchGroup = listItem.closest('.batch-group');
                    if (batchGroup && !batchGroup.querySelector('.file-list li')) {
                        batchGroup.remove();
                    }
                }, 300);
            } else {
                const response = JSON.parse(xhr.responseText);
                alert(response.error || 'Error deleting file');
            }
        };

        xhr.onerror = () => {
            alert('Error deleting file');
        };

        xhr.send();
    }
}

// Initialize file manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FileManager();
}); 