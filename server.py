"""
CVForge - 10-in-1 CV Generator Local Web Server
Runs a lightweight, zero-dependency HTTP server with proper MIME types for ES Modules and CSS.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers for offline capability
        self.send_header('Cache-Control', 'no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

def run():
    os.chdir(DIRECTORY)
    with ThreadedTCPServer(("", PORT), Handler) as httpd:
        print(f"============================================================")
        print(f" CVForge - 10-in-1 Professional CV Generator")
        print(f" Server running at: http://localhost:{PORT}")
        print(f" Serving from: {DIRECTORY}")
        print(f" Press Ctrl+C to terminate the server.")
        print(f"============================================================")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server gracefully...")
            httpd.shutdown()

if __name__ == '__main__':
    run()
