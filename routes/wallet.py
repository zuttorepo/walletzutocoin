from fastapi import APIRouter
import secrets
import hashlib
import base58

router = APIRouter()

def gen_private_key():
    return secrets.token_hex(32)

def priv_to_address(hexkey: str):
    sha = hashlib.sha256(bytes.fromhex(hexkey)).digest()
    rip = hashlib.new('ripemd160', sha).digest()
    prefix = b'\x00' + rip
    checksum = hashlib.sha256(hashlib.sha256(prefix).digest()).digest()[:4]
    return base58.b58encode(prefix + checksum).decode()

@router.get("/generate")
def generate_wallet():
    priv = gen_private_key()
    addr = priv_to_address(priv)
    return {"private_key": priv, "address": addr}
