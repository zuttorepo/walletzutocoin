# core/zt_rpc.py
import requests
from config import RPC_HOST, RPC_PORT, RPC_USER, RPC_PASSWORD

def rpc_call(method, params=[]):
    url = f"http://{RPC_HOST}:{RPC_PORT}"
    payload = {
        "jsonrpc": "1.0",
        "id": "zutto",
        "method": method,
        "params": params
    }
    try:
        response = requests.post(url, json=payload, auth=(RPC_USER, RPC_PASSWORD))
        response.raise_for_status()
        return response.json()["result"]
    except Exception as e:
        return {"error": str(e)}
