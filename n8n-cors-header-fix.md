# n8n CORS Header Expression Hatası Düzeltme

## 🎯 Sorunun Kaynağı
**"Respond to Webhook1"** node'unda `Access-Control-Allow-Headers` değerinde yanlış expression kullanımı var.

## ❌ Mevcut Hatalı Konfigürasyon:
```json
{
  "name": "Access-Control-Allow-Headers",
  "value": "=Content-Type, Authorization, X-Requested-With"
}
```

**Sorun**: Başındaki `=` işareti n8n'de expression olarak yorumlanıyor ve hatalı header oluşturuyor.

## ✅ Doğru Konfigürasyon:

### Adım 1: n8n Editor'da Node'u Açın
1. `http://localhost:5678` adresinde n8n'i açın
2. **"Respond to Webhook1"** node'una tıklayın (ID: `4a069e77-3b1e-4ad1-8802-252cb1c13ca6`)

### Adım 2: Response Headers'ı Düzeltin
**"Options"** → **"Response Headers"** bölümünde şu değişiklikleri yapın:

**DOĞRU HEADER KONFİGÜRASYONU:**
```json
{
  "entries": [
    {
      "name": "Content-Type",
      "value": "application/json"
    },
    {
      "name": "Access-Control-Allow-Origin", 
      "value": "*"
    },
    {
      "name": "Access-Control-Allow-Methods",
      "value": "GET, POST, OPTIONS"
    },
    {
      "name": "Access-Control-Allow-Headers",
      "value": "Content-Type, Authorization, X-Requested-With"
    },
    {
      "name": "Access-Control-Allow-Credentials",
      "value": "true"
    }
  ]
}
```

### Adım 3: Kritik Kontroller
1. **`Access-Control-Allow-Headers` değerinde `=` işareti OLMASIN**
2. **Header isimlerinde trailing space OLMASIN**
3. **Tüm header'lar eksiksiz olsun**

### Adım 4: Kaydet ve Test Et
1. **Save** butonuna basın
2. Workflow'un **Active** olduğundan emin olun
3. React dashboard'u yenileyin (`Ctrl+F5`)

## 🔍 Test Yöntemleri

### Browser Console Test:
```javascript
fetch('http://localhost:5678/webhook/56c93b71-b493-432c-a7c0-4dea2bd97771')
  .then(response => response.json())
  .then(data => console.log('✅ Başarılı:', data))
  .catch(error => console.error('❌ Hata:', error));
```

### cURL Test:
```bash
curl -X GET "http://localhost:5678/webhook/56c93b71-b493-432c-a7c0-4dea2bd97771" \
  -H "Origin: http://localhost:5173" \
  -v
```

## 🎯 Beklenen Sonuç
Bu düzeltmeden sonra:
- ✅ CORS hatası ortadan kalkacak
- ✅ Dashboard veriler yüklenecek
- ✅ "n8n Workflow Hatası: Bilinmeyen hata" mesajı kaybolacak

## 📝 Özet
Sorun **expression syntax** hatası: `"=Content-Type, Authorization, X-Requested-With"` yerine `"Content-Type, Authorization, X-Requested-With"` olmalı.