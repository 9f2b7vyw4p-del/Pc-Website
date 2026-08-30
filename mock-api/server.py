from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import time

HOST = "127.0.0.1"
PORT = 8787

pc_state = {
    "status": "sleeping",
    "updated": time.time()
}


class Handler(BaseHTTPRequestHandler):

    def send_json(self, data, status=200):
        body = json.dumps(data).encode()

        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/pc/status":
            # Simulate the PC becoming online after 5 seconds of waking.
            if pc_state["status"] == "waking":
                if time.time() - pc_state["updated"] >= 5:
                    pc_state["status"] = "online"
                    pc_state["updated"] = time.time()

            self.send_json({
                "status": pc_state["status"]
            })
            return

        self.send_json({
            "error": "Not found"
        }, 404)

    def do_POST(self):
        if self.path == "/api/pc/wake":

            if pc_state["status"] == "online":
                self.send_json({
                    "status": "online",
                    "message": "PC is already online."
                })
                return

            pc_state["status"] = "waking"
            pc_state["updated"] = time.time()

            self.send_json({
                "status": "waking",
                "message": "Wake request accepted."
            })
            return

        self.send_json({
            "error": "Not found"
        }, 404)

    def log_message(self, format, *args):
        print(format % args)


if __name__ == "__main__":
    print(f"Mock PC API running on http://{HOST}:{PORT}")
    HTTPServer((HOST, PORT), Handler).serve_forever()
