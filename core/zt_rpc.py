import requests
import json

RPC_USER = "ztcuser"
RPC_PASSWORD = "ztcpass"
RPC_PORT = 8332  # Ganti jika ZTC pakai port lain
RPC_HOST = "127.0.0.1"

def rpc_call(method, params=[]):
    url = f"http://{RPC_HOST}:{RPC_PORT}"
    payload = json.dumps({
        "jsonrpc": "1.0",
        "id": "ztc",
        "method": method,
        "params": params
    })
    headers = {'content-type': "application/json"}
    response = requests.post(url, headers=headers, data=payload, auth=(RPC_USER, RPC_PASSWORD))
    if response.status_code != 200:
        raise Exception(f"RPC Error {response.status_code}: {response.text}")
    return response.json()["result"]
