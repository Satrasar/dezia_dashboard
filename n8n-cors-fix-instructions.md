# n8n CORS Header Düzeltme Talimatları

## 🎯 Sorun
React dashboard'unuz n8n'den veri çekemiyor çünkü **"Respond to Webhook1"** node'unda CORS header'ları yanlış yapılandırılmış.

## ✅ Çözüm Adımları

### 1. n8n Editor'da "Respond to Webhook1" Node'unu Açın
- Screenshot'ta görünen **"Respond to Webhook1"** node'una tıklayın
- Node ID: `4a069e77-3b1e-4ad1-8802-252cb1c13ca6`

### 2. Options Bölümünü Kontrol Edin
**"Options"** → **"Response Headers"** kısmına gidin

### 3. Header'ları Şu Şekilde Düzeltin:

```json
{
  "responseHeaders": {
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
}
```

### 4. ⚠️ DİKKAT EDİLECEK NOKTALAR:

#### A) Header İsimlerinde Boşluk Olmasın
- ❌ `"Access-Control-Allow-Origin "` (sonunda boşluk)
- ✅ `"Access-Control-Allow-Origin"` (boşluk yok)

#### B) Tüm Header'lar Eksiksiz Olsun
- `Content-Type`
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`
- `Access-Control-Allow-Credentials`

#### C) Value'lar Doğru Olsun
- Origin: `*`
- Methods: `GET, POST, OPTIONS`
- Headers: `Content-Type, Authorization, X-Requested-With`
- Credentials: `true`

### 5. Workflow'u Kaydet ve Test Et
1. **Save** butonuna basın
2. Workflow'un **Active** olduğundan emin olun
3. React dashboard'u yenileyin (`Ctrl+F5`)
4. Browser console'da (F12) hata kontrolü yapın

### 6. Test URL'i
Tarayıcıda şu URL'i test edin:
```
http://localhost:5678/webhook/56c93b71-b493-432c-a7c0-4dea2bd97771
```

JSON response dönmeli ve CORS hatası olmamalı.

## 🔍 Alternatif Kontrol Yöntemleri

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
Bu düzeltmelerden sonra:
- ✅ CORS hatası ortadan kalkacak
- ✅ Dashboard veriler yüklenecek
- ✅ n8n'den gelen kampanya verileri görünecek
- ✅ "n8n Workflow Hatası: Bilinmeyen hata" mesajı kaybolacak

## 📞 Sorun Devam Ederse
1. n8n workflow execution history'sini kontrol edin
2. Facebook API token'ınızın geçerli olduğundan emin olun
3. Browser network tab'ında request/response detaylarını inceleyin
4. n8n logs'unda hata mesajlarını kontrol edin