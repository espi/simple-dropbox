from flask import Blueprint, render_template, request, send_from_directory, jsonify
from dropbox.utils.file_handler import FileHandler

main_bp = Blueprint('main', __name__)
file_handler = FileHandler()

@main_bp.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'files[]' not in request.files:
            return jsonify({'error': 'No files selected'}), 400
        
        return file_handler.handle_upload(request.files.getlist('files[]'))
    
    # Get list of all uploaded files with metadata
    files = file_handler.get_all_files()
    return render_template('index.html', files=files)

@main_bp.route('/download/<path:filepath>')
def download_file(filepath):
    return file_handler.handle_download(filepath)

@main_bp.route('/delete/<path:filepath>', methods=['DELETE'])
def delete_file(filepath):
    return file_handler.handle_delete(filepath) 