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

    async deleteFile(filepath, listItem) {
        try {
            const response = await fetch(`/delete/${filepath}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Add class to trigger animation
                listItem.classList.add('removing');

                // Wait for animation to complete before removing
                setTimeout(() => {
                    const batchGroup = listItem.closest('.batch-group');
                    const fileList = listItem.parentElement; // This should be ul.file-list

                    listItem.remove();

                    // Check if the file list is empty
                    if (fileList && fileList.children.length === 0) {
                        // Remove the ul.file-list
                        fileList.remove();
                        
                        // Display "This batch is empty." message
                        if (batchGroup) {
                            const emptyBatchMessage = document.createElement('p');
                            emptyBatchMessage.className = 'empty-batch-message';
                            emptyBatchMessage.textContent = 'This batch is empty.';
                            // Insert after batch-header, or as the first child if no header (though header should exist)
                            const batchHeader = batchGroup.querySelector('.batch-header');
                            if (batchHeader && batchHeader.nextSibling) {
                                batchGroup.insertBefore(emptyBatchMessage, batchHeader.nextSibling);
                            } else if (batchHeader) {
                                batchGroup.appendChild(emptyBatchMessage);
                            } else { // Fallback if no header, unlikely
                                batchGroup.prepend(emptyBatchMessage);
                            }
                        }
                    }
                    // Note: The original logic to remove the entire batchGroup if it becomes empty
                    // (if (batchGroup && !batchGroup.querySelector('.file-list li')))
                    // is now handled differently. We want to show "This batch is empty."
                    // The batchGroup itself will be removed on next page load if truly empty by server-side logic.

                }, 500); // Match animation duration (0.5s)
            } else {
                let errorMsg = 'Error deleting file';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorData.message || JSON.stringify(errorData);
                } catch (e) {
                    // If response is not JSON or another error occurs during parsing
                    const textError = await response.text();
                    if (textError) {
                        errorMsg = textError;
                    }
                }
                alert(errorMsg);
            }
        } catch (error) {
            console.error('Error during file deletion:', error);
            alert(`Error deleting file: Network error or server unavailable. ${error.message}`);
        }
    }
}

// Initialize file manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FileManager();
}); 