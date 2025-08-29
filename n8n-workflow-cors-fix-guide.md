# n8n Workflow CORS Header Düzeltme Rehberi

## Sorun
n8n workflow'unuzda "Respond to Webhook" node'unda CORS header'ında trailing space (boşluk) var. Bu yüzden browser'dan API çağrısı yapılamıyor.

## Çözüm Adımları

### 1. n8n Workflow Editor'ı Açın
- n8n dashboard'unuza giriş yapın
- "Reklam Otomasyonu" workflow'unu açın

### 2. "Respond to Webhook" Node'unu Bulun
- Workflow'da sağ tarafta bulunan "Respond to Webhook" node'una tıklayın
- Bu node şu anda ID: `1974a0d8-bb39-47be-b447-cea66963ad08`

### 3. Header Ayarlarını Düzeltin
Node'un "Options" bölümünde "Response Headers" kısmını bulun ve şu değişiklikleri yapın:

**MEVCUT (YANLIŞ) AYAR:**
```json
{
  "name": "Access-Control-Allow-Origin ",  ← BURADA TRAILING SPACE VAR
  "value": "*"
}
```

**DOĞRU AYAR:**
```json
{
  "name": "Access-Control-Allow-Origin",   ← TRAILING SPACE KALDIRILDI
  "value": "*"
}
```

### 4. Tüm Header Ayarlarını Kontrol Edin
Aşağıdaki header'ların hepsinin doğru olduğundan emin olun:

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

### 5. Workflow'u Kaydedin ve Aktif Edin
- Değişiklikleri kaydedin
- Workflow'un "Active" durumda olduğundan emin olun

### 6. Test Edin
- React dashboard'unuzu yenileyin
- Browser console'da (F12) hata mesajlarını kontrol edin
- Artık CORS hatası almamanız gerekiyor

## Ek Kontroller

### Dashboard Data Node'u
"Dashboard Data" node'unun da aktif olduğundan emin olun. Şu anda bu node aktif görünüyor.

### Webhook URL'i
Webhook URL'iniz: `https://ozlemkumtas.app.n8n.cloud/webhook/56c93b71-b493-432c-a7c0-4dea2bd97771`

Bu URL hem GET hem POST isteklerini kabul etmeli.

## Beklenen Sonuç
Bu düzeltmelerden sonra:
1. CORS hatası ortadan kalkacak
2. Dashboard veriler yüklenmeye başlayacak
3. n8n'den gelen kampanya verileri React dashboard'da görünecek

## Sorun Devam Ederse
Eğer sorun devam ederse:
1. n8n workflow execution history'sini kontrol edin
2. Facebook API token'ınızın geçerli olduğundan emin olun
3. Browser network tab'ında request/response detaylarını inceleyin