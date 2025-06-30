import hashlib
import base58
import ecdsa
import binascii
from core.zt_utils import sha256, hash160  # pastikan ini ada

def wif_to_privkey(wif: str) -> bytes:
    b = base58.b58decode_check(wif)
    if b[0] != 0x80:
        raise ValueError("WIF tidak valid")
    return b[1:33]

def pubkey_from_privkey(privkey: bytes, compressed: bool = True) -> bytes:
    sk = ecdsa.SigningKey.from_string(privkey, curve=ecdsa.SECP256k1)
    vk = sk.verifying_key
    x = vk.pubkey.point.x()
    y = vk.pubkey.point.y()
    if compressed:
        return b'\x02' + x.to_bytes(32, 'big') if y % 2 == 0 else b'\x03' + x.to_bytes(32, 'big')
    else:
        return b'\x04' + x.to_bytes(32, 'big') + y.to_bytes(32, 'big')

def sign_tx(raw_tx_hex: str, inputs: list, wif: str) -> str:
    privkey = wif_to_privkey(wif)
    pubkey = pubkey_from_privkey(privkey)
    raw_tx = bytes.fromhex(raw_tx_hex)

    signed_inputs = []

    for txin in inputs:
        txid = txin["txid"]
        vout = txin["vout"]
        script_pubkey = bytes.fromhex(txin["scriptPubKey"])
        value = txin.get("amount", 0)

        sighash = b"\x01\x00\x00\x00"  # SIGHASH_ALL

        # Buat preimage
        # (versi sederhana — bisa diganti dengan tx encoder kelas expert)
        # Harusnya: serialize TX dengan scriptPubKey pada input yang ditandatangani
        # → abaikan multisig dan p2sh dulu

        # hash = double_sha256(serialized_tx)
        # → kita asumsikan sudah dapat hash_to_sign
        hash_to_sign = sha256(sha256(raw_tx))  # Palsu, belum serialize full tx

        sk = ecdsa.SigningKey.from_string(privkey, curve=ecdsa.SECP256k1)
        signature = sk.sign_digest(hash_to_sign, sigencode=ecdsa.util.sigencode_der)
        signature += b'\x01'  # append SIGHASH_ALL

        signed_inputs.append({
            "txid": txid,
            "vout": vout,
            "scriptSig": signature.hex(),
            "pubkey": pubkey.hex()
        })

    return {
        "signed_tx": raw_tx_hex,  # placeholder, seharusnya hasil serialize dengan signature
        "inputs_signed": signed_inputs
    }
