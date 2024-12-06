from pyngrok import ngrok
import os

class NgrokHandler:
    def __init__(self):
        self.port = 8000

    def start(self):
        # Configure ngrok with auth token from environment variable
        ngrok_auth_token = os.getenv('NGROK_AUTH_TOKEN')
        if ngrok_auth_token:
            ngrok.set_auth_token(ngrok_auth_token)
        else:
            print(" * WARNING: NGROK_AUTH_TOKEN not found in .env file")
        
        # Kill any existing ngrok processes
        tunnels = ngrok.get_tunnels()
        for tunnel in tunnels:
            ngrok.disconnect(tunnel.public_url)
        
        # Start new tunnel
        public_url = ngrok.connect(self.port).public_url
        print(f" * ngrok tunnel \"{public_url}\" -> \"http://127.0.0.1:{self.port}\"")
        return public_url 