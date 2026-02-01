# Log Filtreleme

Log dosyalarını tarayıp belirttiğiniz terimlere göre filtreleyen, tarayıcıda çalışan bir web uygulaması. Büyük dosyalar parça parça okunur; sonuç tek bir dosya olarak indirilebilir.

## Özellikler

- **Çoklu dosya desteği** – Birden fazla log dosyası seçip tek seferde filtreleyebilirsiniz.
- **Çoklu arama terimi** – İstediğiniz kadar filtre terimi ekleyebilirsiniz; satırlar bu terimlerden en az birini içeriyorsa sonuca dahil edilir.
- **Büyük dosya desteği** – Dosyalar parça (chunk) halinde okunur, bellek kullanımı sınırlı kalır.
- **İlerleme göstergesi** – Filtreleme sırasında ilerleme çubuğu ve dosya sayacı gösterilir.
- **Sonuç indirme** – Eşleşen satırlar tek bir metin dosyası olarak indirilebilir.
- **Console log** – İsteğe bağlı olarak eşleşen satırlar tarayıcı konsoluna da yazdırılabilir.

## Teknolojiler

- **React 18**
- **Vite 5**
- Tarayıcıda dosya okuma: `FileReader` ve chunk tabanlı işleme

## Kurulum

```bash
npm install
```

## Çalıştırma

Geliştirme sunucusu:

```bash
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde açılır.

Production build:

```bash
npm run build
```

Build önizleme:

```bash
npm run preview
```

## Kullanım

1. **Dosya seçin** – "Dosya seç" ile bir veya birden fazla log dosyası (.log, .txt vb.) seçin.
2. **Filtre terimleri girin** – En az bir arama terimi yazın; birden fazla terim eklemek için "+" kullanın.
3. **Filtrele** – "Filtrele" butonuna tıklayın.
4. **İndir** – İşlem bitince "İndir" ile eşleşen satırları içeren dosyayı indirin.

Terimler satır içinde geçtiği sürece eşleşir; büyük/küçük harf duyarlılığı yoktur.

## Proje yapısı

```
log-filter/
├── src/
│   ├── components/       # UI bileşenleri (FileInput, FilterTerms, ProgressBar, Results)
│   ├── hooks/            # useLogFilter – filtreleme mantığı ve state
│   ├── utils/            # Chunk okuma, satır bölme, satır filtreleme
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Lisans

Private proje.
