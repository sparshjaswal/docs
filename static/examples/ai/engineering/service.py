"""Local teaching service; no arguments run checks, --serve starts loopback HTTP."""
import argparse
import json
import math
from http.server import BaseHTTPRequestHandler, HTTPServer

MODEL_VERSION = "distance-rule-v1"
MAX_BODY = 4096


def predict(payload):
    """A hand-written baseline, deliberately separate from the HTTP boundary."""
    if not isinstance(payload, dict) or set(payload) != {"distance_km"}:
        raise ValueError("Provide exactly one field: distance_km")
    distance = payload["distance_km"]
    if (isinstance(distance, bool) or not isinstance(distance, (int, float))
            or not math.isfinite(distance) or not 0 <= distance <= 1000):
        raise ValueError("distance_km must be a finite number from 0 to 1000")
    return {"estimate_minutes": 2.0 + 0.5 * distance, "model_version": MODEL_VERSION}


def dispatch(path, body):
    if path != "/predict":
        return 404, {"error": "Unknown operation"}
    if len(body) > MAX_BODY:
        return 413, {"error": "Request body too large"}
    try:
        return 200, predict(json.loads(body))
    except (ValueError, UnicodeDecodeError, OverflowError):
        return 400, {"error": "Expected a finite distance_km from 0 to 1000"}


def self_test():
    cases = [
        ("/predict", b'{"distance_km":6}', 200),
        ("/predict", b'{"distance_km":0}', 200),
        ("/predict", b'{"distance_km":-1}', 400),
        ("/predict", b'{"distance_km":true}', 400),
        ("/predict", b'{"distance_km":NaN}', 400),
        ("/predict", b'{}', 400),
        ("/unknown", b'{}', 404),
        ("/predict", b'x' * (MAX_BODY + 1), 413),
    ]
    for path, body, expected in cases:
        status, result = dispatch(path, body)
        assert status == expected, (path, body, status)
        if status == 200:
            assert math.isfinite(result["estimate_minutes"])
            assert result["model_version"] == MODEL_VERSION
    assert predict({"distance_km": 6})["estimate_minutes"] == 5.0
    print("Service contract: 8 checks passed")


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", "-1"))
        except ValueError:
            length = -1
        if not 0 <= length <= MAX_BODY:
            status, result = (413 if length > MAX_BODY else 400), {"error": "Invalid body length"}
            self.close_connection = True
        else:
            self.connection.settimeout(5)
            try:
                body = self.rfile.read(length)
                status, result = dispatch(self.path, body)
            except TimeoutError:
                status, result = 408, {"error": "Request timed out"}
                self.close_connection = True
        encoded = json.dumps(result, allow_nan=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def log_message(self, *_args):
        pass  # Do not log request bodies or private prompts in this teaching server.


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--serve", action="store_true")
    args = parser.parse_args()
    if args.serve:
        print("Local teaching server: http://127.0.0.1:8001 (Ctrl+C to stop)")
        server = HTTPServer(("127.0.0.1", 8001), Handler)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            server.server_close()
    else:
        self_test()
