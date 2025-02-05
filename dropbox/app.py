from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from .utils.ngrok_handler import NgrokHandler

# Load environment variables
load_dotenv()

# Get max file size from environment
MAX_FILE_SIZE_MB = int(os.getenv('MAX_FILE_SIZE_MB', 250))  # Default to 250MB if not set

def ensure_directories(app):
    """Ensure uploads directory exists"""
    uploads_dir = app.config['UPLOAD_FOLDER']
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)
        print(f" * Created uploads directory: {uploads_dir}")
    else:
        print(f" * Found uploads directory: {uploads_dir}")

def create_app():
    app = Flask(__name__,
                template_folder='templates',
                static_folder='static')
    CORS(app)
    
    # Configuration
    app.config['UPLOAD_FOLDER'] = os.path.join(app.static_folder, 'uploads')
    app.config['MAX_FILE_SIZE_MB'] = MAX_FILE_SIZE_MB  # Store the value in app config
    app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE_MB * 1024 * 1024  # Convert MB to bytes
    
    # Ensure uploads directory exists
    ensure_directories(app)
    
    # Register blueprints
    from .routes import main_bp
    app.register_blueprint(main_bp)
    
    return app

if __name__ == '__main__':
    app = create_app()
    ngrok_handler = NgrokHandler()
    
    try:
        public_url = ngrok_handler.start()
        app.config['BASE_URL'] = public_url
    except Exception as e:
        print(f" * Error setting up ngrok: {str(e)}")
    
    app.run(debug=True, host='0.0.0.0', port=8000) 