# 📘 WalletZutocoin API Documentation

Versi: v1  
Base URL: `https://api.zuttocoin.org/api/v1`

---

## 🔍 General Info

- Format: REST API
- Content-Type: `application/json`
- Authentication: Tidak diperlukan (public endpoint)
- Rate limit: TBD

---

## 📦 Endpoint List

### 1. 🔗 Get Total Supply

- **Endpoint**: `/supply`
- **Method**: `GET`
- **Deskripsi**: Mengambil total supply Zuttocoin saat ini.

#### ✅ Contoh Response
```json
{
  "total_supply": 12345678.90
}
