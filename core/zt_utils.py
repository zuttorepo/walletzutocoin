def estimate_fee(tx_size_bytes: int, sat_per_byte: int = 1) -> float:
    sats = tx_size_bytes * sat_per_byte
    return round(sats / 100_000_000, 8)  # Konversi ke ZTC
