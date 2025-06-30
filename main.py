from fastapi import FastAPI
from routes import wallet, transaction
from routes import supply  # Tambahkan import
from fastapi import FastAPI
from core.zt_rpc import rpc_call
import logging
logging.basicConfig(level=logging.INFO)

app = FastAPI()
app.include_router(wallet.router, prefix="/wallet")
app.include_router(transaction.router, prefix="/tx")
app.include_router(supply.router)  # Tambahkan ini
@app.get("/api/v1/balance/{address}")
def get_balance(address: str):
    # Placeholder: nanti diganti pakai RPC asli ZTC
    # Misalnya response dari zt_rpc.get_balance(address)
    return {"address": address, "balance": 0.0}
from mnemonic import Mnemonic
import hashlib, ecdsa, base58

def priv_to_address(privkey_hex: str) -> str:
    sk = ecdsa.SigningKey.from_string(bytes.fromhex(privkey_hex), curve=ecdsa.SECP256k1)
    vk = sk.get_verifying_key()
    pubkey = b'\x04' + vk.to_string()
    sha256 = hashlib.sha256(pubkey).digest()
    ripemd160 = hashlib.new('ripemd160', sha256).digest()
    prefix = b'\x1E'  # ZTC prefix (D)
    checksum = hashlib.sha256(hashlib.sha256(prefix + ripemd160).digest()).digest()[:4]
    return base58.b58encode(prefix + ripemd160 + checksum).decode()

@app.get("/api/v1/wallet/generate")
def generate_wallet():
    mnemo = Mnemonic("english")
    words = mnemo.generate(strength=128)
    seed = mnemo.to_seed(words)
    privkey = hashlib.sha256(seed).hexdigest()
    address = priv_to_address(privkey)
    return {
        "mnemonic": words,
        "private_key": privkey,
        "address": address
    }
app = FastAPI()

@app.get("/")
def root():
    return {"status": "RPC Server Aktif"}

@app.get("/getinfo")
def get_info():
    return rpc_call("getinfo")

@app.get("/getbalance")
def get_balance():
    return rpc_call("getbalance")

@app.get("/sendto/{address}/{amount}")
def send_to(address: str, amount: float):
    return rpc_call("sendtoaddress", [address, amount])
