#!/usr/bin/env python3
"""Static file server with framing headers.

stdlib `http.server` cannot set response headers; meta CSP cannot set
frame-ancestors. Use this instead of `python -m http.server` for local runs.
"""
from __future__ import annotations

import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class FramingHandler(SimpleHTTPRequestHandler):
    def end_headers(self) -> None:
        self.send_header("X-Frame-Options", "DENY")
        self.send_header(
            "Content-Security-Policy",
            "frame-ancestors 'none'",
        )
        super().end_headers()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.host, args.port), FramingHandler)
    print(f"Serving {args.host}:{args.port} (X-Frame-Options DENY, frame-ancestors none)")
    server.serve_forever()


if __name__ == "__main__":
    main()
