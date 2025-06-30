import hashlib

def sha256(data: bytes) -> bytes:
    return hashlib.sha256(data).digest()

def hash160(data: bytes) -> bytes:
    sha = hashlib.sha256(data).digest()
    rip = hashlib.new('ripemd160', sha).digest()
    return rip

def estimate_tx_size(num_inputs: int, num_outputs: int, compressed: bool = True) -> int:
    """
    Estimasi ukuran TX dalam byte.
    """
    base = 10  # version (4) + locktime (4) + overhead
    in_size = 148 if not compressed else 108
    out_size = 34
    total_size = base + (num_inputs * in_size) + (num_outputs * out_size)
    return total_size

def estimate_fee(tx_size_bytes: int, sat_per_byte: int = 1) -> float:
    """
    Hitung fee berdasarkan byte size dan satoshi per byte.
    Output dalam satuan ZTC (btc-like).
    """
    sats = tx_size_bytes * sat_per_byte
    return round(sats / 100_000_000, 8)

def bytes_to_hex(b: bytes) -> str:
    return b.hex()

def hex_to_bytes(h: str) -> bytes:
    return bytes.fromhex(h)
