from fastapi import FastAPI
from routes import wallet, transaction
from routes import supply  # Tambahkan import

app = FastAPI()
app.include_router(wallet.router, prefix="/wallet")
app.include_router(transaction.router, prefix="/tx")
app.include_router(supply.router)  # Tambahkan ini
