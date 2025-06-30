from fastapi import APIRouter
from core.zt_rpc import rpc_call  # Pastikan ini ada
import math

router = APIRouter()

@router.get("/supply")
def get_supply():
    try:
        block_height = rpc_call("getblockcount")
        reward_per_block = 50  # Jika 50 ZTC per block, ganti jika beda
        total_supply = block_height * reward_per_block
        return {
            "total_supply": total_supply,
            "block_height": block_height,
            "reward_per_block": reward_per_block
        }
    except Exception as e:
        return {"error": str(e)}
