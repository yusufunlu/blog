---
title: FFMPEG komutları
date: '2020-08-27'
spoiler: FFMPEG komutları ve kullanımı
---
https://trac.ffmpeg.org/wiki/Encode/H.264

in.mp4 dosyasını al out.avi dosyasına yaz. container formatı avi. -i de input demek

``` ffmpeg -ss 67 -i in.mkv -t 20 -c copy out.mp4 ```
- `-ss` start second yani videoyu kesmeye başlayacağımız yer
- `-t` kesilme süresi uzunluğu yani duration
- `-to` bitiş zamanı
- `-c:v copy` copy video codecleri kopyala re-encode etme
- `-c:a copy` copy audio codecleri kopyala re-encode etme
- `-c copy` video, audio ve altyazıları kopyala re-encode etme

 ### Constant Rate Factor (CRF)
Bu yöntemde kalite seçilebilir bitrate veya dosya boyutu seçilemez. Bu yöntemde sıkıştırma kalite demektir. Yüksek sıkıştırma yavaş olur ve aynı bitrate'de daha yüksek kalite verir. Eğer çıkış kalitesi sabit ise yavaş sıkıştırma ile bitrate düşer. Sıkıştırma hızına ve beklenen kaliteye göre her bir frame için kaç bit kullanılacağı hesaplanır.

**CRF Value**
 En düşük değer 0 kayıpsızdır. En yüksek değer 51 en kötü kalitedir. CRF değeri 6 yükselirse bitrate veya file size yarıya düşer. 

**Preset**
Hangi hızda sıkıştırma yapacağıdır. ultrafast, faster,..,slower,veryslow. 
-preset help
Bitrate = Kalite * Sıkıştırma hızı
Bitrate = ((51 - CRF) / 6) * Preset

```ffmpeg -i in.mp4 -c:v libx264 -preset slow -crf 22 -c:a aac -b:a 128k output.mkv```

### Two-Pass ABR
Bitrate ve dosya boyutu hedefi ile çalışır. Bu yöntemde CRF kullanılmaz ama preset  kullanılabilir.
2 Aşamalı çalışır. Bu sebeple streaming yapmak için uygun mudur emin değilim.

```ffmpeg -y -i input -c:v libx264 -b:v 2600k -pass 1 -an -f null /dev/null && \```
```ffmpeg -i input -c:v libx264 -b:v 2600k -pass 2 -c:a aac -b:a 128k output.mp4```

## Online Streaming için öneriler
1. Maximum bit rate sınırlama
ffmpeg -i input -c:v libx264 -crf 23 -maxrate 1M -bufsize 2M output.mp4
Yukarıda kalite hedefi 23 olup çıkış bitrate 1 MBit/s değerini geçerse CRF otomatik artabilir.Yani kalite düşebilir. 

2. Düşük gecikme: ``-tune zerolatency``

3. Başlangın bilgileri : ```-movflags +faststart``` Bazı bilgileri videonun başına yerleştirir ki video tamamı indirilmeden izlenebilsin. Youtube gibi platformlar için gerekli değildir.  https://support.google.com/youtube/answer/1722171?hl=en#zippy=%2Cframe-rate%2Cbitrate

