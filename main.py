from fastapi import FastAPI
from routes import wallet, transaction

app = FastAPI()
app.include_router(wallet.router, prefix="/wallet")
app.include_router(transaction.router, prefix="/tx")
