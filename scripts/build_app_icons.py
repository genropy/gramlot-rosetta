"""Generate Rosetta's geometric R icons with the Python standard library."""
from pathlib import Path
import struct
import zlib


def icon(size):
    rows = bytearray()
    for y in range(size):
        rows.append(0)
        for x in range(size):
            u, v = x / size * 100, y / size * 100
            stem = 29 <= u <= 39 and 25 <= v <= 75
            bowl = ((u - 46) / 23) ** 2 + ((v - 42) / 17) ** 2 <= 1 and u >= 36
            hole = ((u - 46) / 12) ** 2 + ((v - 42) / 7) ** 2 < 1 and u >= 39
            leg = 54 <= v <= 75 and 43 + (v - 54) * .65 <= u <= 55 + (v - 54) * .65
            rows.extend((255, 255, 255) if stem or (bowl and not hole) or leg else (29, 62, 177))
    def chunk(kind, data):
        return struct.pack('!I', len(data)) + kind + data + struct.pack('!I', zlib.crc32(kind + data))
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('!2I5B', size, size, 8, 2, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(rows)) + chunk(b'IEND', b'')


if __name__ == '__main__':
    directory = Path(__file__).resolve().parents[1] / 'shared/pwa'
    directory.mkdir(exist_ok=True)
    for size in (192, 512):
        (directory / f'icon-{size}.png').write_bytes(icon(size))
