from fastapi import APIRouter
from pydantic import BaseModel
from core.zt_rpc import rpc_call
from core.zt_signer import sign_tx
import binascii

router = APIRouter()

class TxRequest(BaseModel):
    from_address: str
    to_address: str
    amount: float
    fee: float
    wif: str

@router.post("/sendtx")
def send_tx(data: TxRequest):
    try:
        # Ambil UTXO dari node
        utxos = rpc_call("listunspent", [0, 9999999, [data.from_address]])
        if not utxos:
            return {"error": "No UTXO found"}

        # Pilih UTXO pertama yang cukup
        selected = None
        for utxo in utxos:
            if utxo["amount"] >= data.amount + data.fee:
                selected = utxo
                break
        if not selected:
            return {"error": "No sufficient balance"}

        change = round(selected["amount"] - data.amount - data.fee, 8)

        # Buat TX inputs dan outputs
        inputs = [{
            "txid": selected["txid"],
            "vout": selected["vout"],
            "scriptPubKey": selected["scriptPubKey"],
            "amount": selected["amount"]
        }]
        outputs = {
            data.to_address: data.amount
        }
        if change > 0:
            outputs[data.from_address] = change

        # Buat raw transaction
        raw_tx = rpc_call("createrawtransaction", [inputs, outputs])

        # Sign TX
        result = sign_tx(raw_tx, inputs, data.wif)
        signed_hex = result["signed_tx"]  # sementara placeholder

        # Broadcast
        txid = rpc_call("sendrawtransaction", [signed_hex])

        return {
            "txid": txid,
            "status": "broadcasted"
        }
    except Exception as e:
        return {"error": str(e)}
