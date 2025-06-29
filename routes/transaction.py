from fastapi import APIRouter

router = APIRouter()

@router.post("/build")
def build_tx():
    return {"status": "TX builder not implemented yet"}
