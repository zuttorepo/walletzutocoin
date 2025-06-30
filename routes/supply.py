from fastapi import APIRouter
from core.zt_rpc import rpc_call
from core.config import REWARD_PER_BLOCK

from core.zt_rpc import rpc_call

@router.get("/supply")
def supply():
    info = rpc_call("getinfo")
    return {"supply": info.get("moneysupply", "unknown")}
    
router = APIRouter()

@router.get("/supply")
def get_supply():
    try:
        block_height = rpc_call("getblockcount")
        
        # Validasi hasil RPC
        if not isinstance(block_height, int):
            raise ValueError("block_height dari node tidak valid")

        reward_per_block = REWARD_PER_BLOCK
        total_supply = block_height * reward_per_block

        return {
            "block_height": block_height,
            "reward_per_block": reward_per_block,
            "total_supply": total_supply
        }
    except Exception as e:
        return {"error": str(e)}
