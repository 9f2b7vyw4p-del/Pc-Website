import json
import socket
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HOST = "127.0.0.1"
PORT = 8787

PC_MAC = "a0:ad:9f:1c:e0:20"
PC_IP = "192.168.100.249"

last_wake = None


def send_wol():
    mac_bytes = bytes.fromhex(PC_MAC.replace(":", ""))

    packet = b"\xff" * 6 + mac_bytes * 16

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)

    sock.sendto(packet, ("255.255.255.255", 9))

    sock.close()


def is_pc_online():
    """
    Check whether the Windows PC responds to ICMP ping.

    This is a basic reachability check. We will later replace/
    supplement this with a check against the actual remote-access
    service.
    """

    # macOS does not expose ping through Python's socket module,
    # so use the system ping command.
    import subprocess

    try:
        result = subprocess.run(
            ["ping", "-c", "1", "-W", "1000", PC_IP],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=2
        )

        return result.returncode == 0

    except (subprocess.TimeoutExpired, OSError):
        return False


class Handler(BaseHTTPRequestHandler):

    def send_json(self, data, status=200):
        body = json.dumps(data).encode()

        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()

        self.wfile.write(body)

    def do_GET(self):

        if self.path == "/status":

            online = is_pc_online()

            self.send_json({
                "status": "online" if online else "sleeping",
                "ip": PC_IP,
                "mac": PC_MAC,
                "last_wake": last_wake
            })

            return

        self.send_json({
            "error": "Not found"
        }, 404)

    def do_POST(self):

        global last_wake

        if self.path == "/wake":

            send_wol()

            last_wake = time.time()

            self.send_json({
                "status": "waking",
                "message": "Wake-on-LAN packet sent."
            })

            return

        self.send_json({
            "error": "Not found"
        }, 404)

    def log_message(self, format, *args):
        print(format % args)


if __name__ == "__main__":

    print(f"PC agent listening on http://{HOST}:{PORT}")
    print(f"Target PC: {PC_MAC}")
    print(f"Target IP:  {PC_IP}")

    server = ThreadingHTTPServer((HOST, PORT), Handler)

    server.serve_forever()
