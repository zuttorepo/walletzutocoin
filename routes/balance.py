from fastapi import APIRouter, HTTPException
from core.zt_rpc import rpc_call

router = APIRouter()

@router.get("/balance/{address}")
async def get_balance(address: str):
    # Validasi address format (basic check, bisa ditingkatkan)
    if not (25 <= len(address) <= 35):
        raise HTTPException(status_code=400, detail="Invalid address format")

    try:
        # Gunakan zuttocoin RPC: getaddressbalance (atau UTXO scan)
        response = rpc_call("getaddressbalance", [address])

        balance_satoshi = response.get("balance", 0)
        unconfirmed_satoshi = response.get("unconfirmed_balance", 0)

        return {
            "address": address,
            "balance": balance_satoshi / 1e8,
            "confirmed": (balance_satoshi - unconfirmed_satoshi) / 1e8,
            "unconfirmed": unconfirmed_satoshi / 1e8
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RPC error: {str(e)}")
