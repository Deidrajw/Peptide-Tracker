#!/usr/bin/env python3
"""Verify the complete Cloudflare Pages app files equal the release's checked-out source.

No GitHub API secrets and no production writes. Unlike reading the <title>, byte parity
checks the root HTML, all 3 CSS files and 12 ordered JS modules from the SAME commit.
"""
import argparse
import functools
import hashlib
import http.server
import json
import os
from pathlib import Path
import threading
import time
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent.parent
FILES = (["index.html"]
         + ["assets/css/nexus.css", "assets/css/nexus-disclosures.css", "assets/css/nexus-contrast.css"]
         + [f"assets/js/{n:02d}-nexus.js" for n in range(1, 13)])
DEFAULT_SITE = "https://nexuspeplog.pages.dev/"


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def compare(base, commit):
    found = []
    for filename in FILES:
        expected = (ROOT / filename).read_bytes()
        uri = base.rstrip("/") + "/" + quote(filename) + "?nexus_verify=" + quote(commit)
        req = Request(uri, headers={"User-Agent": "Nexus-Release-Integrity-Check/1.0",
                                     "Cache-Control": "no-cache", "Accept-Encoding": "identity"})
        try:
            with urlopen(req, timeout=16) as response:
                actual = response.read()
                final_url = response.geturl()
                status = response.status
        except (OSError, HTTPError, URLError) as exc:
            return False, {"failed_file": filename, "error": str(exc), "checked": found}
        if actual != expected:
            return False, {"failed_file": filename,
                           "expected_sha256": sha256(expected),
                           "served_sha256": sha256(actual),
                           "served_url": final_url, "http_status": status,
                           "checked": found}
        found.append({"file": filename, "sha256": sha256(actual), "bytes": len(actual)})
    return True, {"checked": found, "file_count": len(found)}


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--base", default=DEFAULT_SITE)
    p.add_argument("--attempts", type=int, default=24)
    p.add_argument("--interval", type=float, default=12)
    p.add_argument("--smoke", action="store_true")
    p.add_argument("--output", default="dist/Nexus_PAGES_SOURCE_PARITY.json")
    args = p.parse_args()
    commit = os.environ.get("GITHUB_SHA", "local-smoke")
    server = None
    if args.smoke:
        # CI self-test of the verifier; this does NOT count as a Pages deployment.
        handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT))
        server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        args.base = f"http://127.0.0.1:{server.server_port}/"
        args.attempts = 1
        args.interval = 0
    evidence = {"expected_source_commit": commit, "url": args.base,
                "smoke_only": args.smoke, "verified": False, "attempts": []}
    try:
        for iteration in range(args.attempts):
            ok, detail = compare(args.base, commit)
            evidence["attempts"].append({"number": iteration + 1, "ok": ok,
                                         "detail": detail})
            if ok:
                evidence["verified"] = True
                evidence["verified_files"] = detail["checked"]
                break
            print(f"Pages parity attempt {iteration + 1}/{args.attempts}: {detail.get('failed_file')}: {detail.get('error', 'hash mismatch')}", flush=True)
            if iteration < args.attempts - 1:
                time.sleep(args.interval)
    finally:
        if server:
            server.shutdown()
    output = ROOT / args.output
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(evidence, indent=2) + "\n")
    if not evidence["verified"]:
        raise SystemExit(f"PAGES UNVERIFIED — {args.base}: failed byte parity; see {output}")
    label = "LOCAL SMOKE ONLY" if args.smoke else "LIVE CLOUDFLARE PAGES VERIFIED"
    print(f"{label}: {len(FILES)} exact source files match commit {commit}; evidence: {output}")


if __name__ == "__main__":
    main()
