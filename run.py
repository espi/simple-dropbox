from dropbox.app import create_app
from dropbox.utils.ngrok_handler import NgrokHandler

if __name__ == '__main__':
    app = create_app()
    ngrok_handler = NgrokHandler()
    
    try:
        public_url = ngrok_handler.start()
        app.config['BASE_URL'] = public_url
    except Exception as e:
        print(f" * Error setting up ngrok: {str(e)}")
    
    app.run(debug=True, host='0.0.0.0', port=8000) 