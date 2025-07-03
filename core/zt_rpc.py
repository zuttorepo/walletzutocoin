import os
import requests
from dotenv import load_dotenv

load_dotenv()

RPC_URL = os.getenv("ZTC_RPC_URL")

def rpc_call(method, params=[]):
    if not RPC_URL:
        return {"error": "RPC URL tidak ditemukan di .env"}

    payload = {
        "jsonrpc": "1.0",
        "id": "ztc",
        "method": method,
        "params": params
    }

    try:
        response = requests.post(RPC_URL, json=payload)
        response.raise_for_status()
        return response.json()["result"]
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}
    except KeyError:
        return {"error": "Invalid RPC response"}
