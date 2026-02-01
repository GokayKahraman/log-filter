# Log Filter

Log dosyalarını belirttiğiniz terimlere göre filtreleyen web uygulaması. Düz metin (.log, .txt) veya `.tar.gz` arşivlerini yükleyebilir, birden fazla filtre terimi ekleyebilir ve sonuçları indirebilir veya konsola yazdırabilirsiniz.

## Özellikler

- **Dosya türü seçimi:** Düz log dosyaları (.log, .txt) veya .tar.gz arşivleri
- **Çoklu filtre terimleri:** İstediğiniz kadar arama terimi ekleyebilirsiniz; satırlar bu terimlerden en az birini içeriyorsa sonuca dahil edilir
- **Toplu dosya:** Birden fazla dosya seçip tek seferde filtreleyebilirsiniz
- **İlerleme göstergesi:** Filtreleme sırasında ilerleme çubuğu
- **Sonuç:** Filtrelenmiş çıktıyı indirme veya tarayıcı konsoluna yazdırma

## Gereksinimler

- Node.js (v18 veya üzeri önerilir)
- npm veya yarn

## Kurulum

```bash
npm install
```

## Çalıştırma

### Tek komutla (önerilen)

Hem backend hem frontend'i aynı anda başlatmak için:

```bash
npm start
```

Bu komut API sunucusunu (port 3001) ve Vite geliştirme sunucusunu (genelde port 5173) birlikte çalıştırır. Tarayıcıda Vite'ın verdiği adresi açın.

### Ayrı terminallerde

İsterseniz sunucuları ayrı ayrı da çalıştırabilirsiniz:

**1. Backend (API sunucusu)**

```bash
npm run server
```

Sunucu varsayılan olarak **http://localhost:3001** adresinde çalışır. Portu değiştirmek için ortam değişkeni kullanabilirsiniz:

```bash
PORT=4000 npm run server
```

**2. Frontend (geliştirme sunucusu)**

Yeni bir terminalde:

```bash
npm run dev
```

## Kullanım

1. **Dosya türünü seçin:** "Log dosyaları" veya "Tar.gz arşivi"
2. **Dosya(lar)ı yükleyin:** Dosya seç veya sürükle-bırak
3. **Filtre terimlerini girin:** Her terim için bir alan; terim eklemek için "+" kullanın
4. **Filtrele:** "Filtrele" butonuna tıklayın
5. **Sonucu alın:** İndir veya "Konsola yazdır" ile tarayıcı konsolunda görüntüleyin

## Teknik Detaylar

- **Frontend:** React 18, Vite 5
- **Backend:** Express, Multer (dosya yükleme), tar-stream (.tar.gz işleme)
- **Dosya boyutu sınırı:** 200 MB (sunucu tarafında)

## Proje Yapısı

```
log-filter/
├── src/                 # React uygulaması
│   ├── components/      # UI bileşenleri
│   ├── hooks/           # useLogFilter vb.
│   └── App.jsx
├── server/              # Express API
│   ├── index.js         # Sunucu ve route'lar
│   ├── logFilterService.js
│   ├── tarGzFilterService.js
│   └── lineFilter.js
├── package.json
└── vite.config.js
```

## Lisans

Bu proje private olarak kullanılmak üzere yapılandırılmıştır.
