---
title: FFMPEG Audio
date: '2020-08-27'
spoiler: Audio Channel ve Manipülasyon
---
https://trac.ffmpeg.org/wiki/AudioChannelManipulation

ffprobe video ve audioları incelemek için kullanılır. 
## Gerekli Linux Bilgisi
Buradan sonra komutları birbirine bağlayıp daha karmaşık komutlar kullanacağımız bir linux shell tekrarı yapalım.

Linux Shell'inde çalışan programlarda 3 tip standart I/O yani giriş çıkış vardır. Her birinin de numarası vardır buna **file descriptor** denir.

**0 - stdin**: the standard input stream, yani girdileri buradan yaparız : klavye,mouse, dosya
**1 - stdout**: the standard output stream, çalışan komut veya kod sonuçları buraya yazar
**2 - stderr**: the standard error stream, hataları buraya yazar

````
ffprobe 2stereo_aac_h264.mp4
```` 
Yukarıdaki komut ffprobe ile videoyu incele ve sonuçları consola yazdır demektir.

```` 
ffprobe 2stereo_aac_h264_video.mp4 1> out.txt 2> error.txt 
ffprobe 2stereo_aac_h264_video.mp4  > out.txt 2> error.txt
````
Yukarıdaki 2 komut aynıdır çünkü **1>** ile **>** aynıdır, file descriptor numarası girilmezse 1 olarak algılar.
ffprobe ile videoyu incele ve sonuçları(1 stdout) out.txt dosyasına ve hataları(2 stderr demektir) error.txt dosyasına yaz demektir. 


```` 
ffprobe 2stereo_aac_h264_video.mp4 1> out.txt 2>&1
ffprobe 2stereo_aac_h264_video.mp4  > out.txt 2>&1
ffprobe 2stereo_aac_h264_video.mp4  > out.txt >&
````
Yukaridaki 3 komut da aynı anlama gelir çünkü **2>&1** ve **>&** aynı anlama gelir. 
1'i yani stdout'u out.txt dosyasına yönlendir ve 2'yi yani stderr'u 1'in konumuna yönlendir. Yani ikisi de aynı yere gidecek.

**>** ile **|** benzer işleri yapar ama **>** kullanımında konsola bir sonuç basılmaz

## Audio Mapping

