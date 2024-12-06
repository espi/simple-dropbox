from flask import current_app, send_from_directory
import os
from werkzeug.utils import secure_filename
from datetime import datetime

class FileHandler:
    def __init__(self):
        self.upload_folder = lambda: current_app.config['UPLOAD_FOLDER']

    def create_upload_folder(self):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        folder_path = os.path.join(self.upload_folder(), timestamp)
        os.makedirs(folder_path, exist_ok=True)
        return folder_path, timestamp

    def handle_upload(self, files):
        if not any(file.filename for file in files):
            return {'error': 'No files selected'}, 400

        folder_path, timestamp = self.create_upload_folder()
        uploaded_files = []

        for file in files:
            if file.filename:
                filename = secure_filename(file.filename)
                file_path = os.path.join(folder_path, filename)
                file.save(file_path)
                uploaded_files.append({
                    'name': filename,
                    'timestamp': timestamp,
                    'path': f"{timestamp}/{filename}"
                })

        return {
            'message': f'Successfully uploaded {len(uploaded_files)} files',
            'files': uploaded_files
        }

    def get_all_files(self):
        files = []
        for folder_name in sorted(os.listdir(self.upload_folder()), reverse=True):
            folder_path = os.path.join(self.upload_folder(), folder_name)
            if os.path.isdir(folder_path):
                folder_files = os.listdir(folder_path)
                files.extend([{
                    'name': file,
                    'timestamp': folder_name,
                    'path': f"{folder_name}/{file}"
                } for file in folder_files])
        return files

    def handle_download(self, filepath):
        directory = os.path.dirname(filepath)
        filename = os.path.basename(filepath)
        return send_from_directory(
            os.path.join(self.upload_folder(), directory), 
            filename
        )

    def handle_delete(self, filepath):
        """Delete a file and its parent folder if empty"""
        try:
            # Get the full path of the file
            directory = os.path.dirname(filepath)
            filename = os.path.basename(filepath)
            full_path = os.path.join(self.upload_folder(), directory, filename)
            
            # Delete the file
            if os.path.exists(full_path):
                os.remove(full_path)
                
                # Check if directory is empty
                dir_path = os.path.join(self.upload_folder(), directory)
                if os.path.exists(dir_path) and not os.listdir(dir_path):
                    os.rmdir(dir_path)
                
                return {'message': f'Successfully deleted {filename}'}, 200
            
            return {'error': 'File not found'}, 404
            
        except Exception as e:
            return {'error': f'Error deleting file: {str(e)}'}, 500 