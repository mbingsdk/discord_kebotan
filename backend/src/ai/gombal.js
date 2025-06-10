import { generateRespon, randomPrompt } from "./config.js";

const gombalinPrompts = [
  // 💘 Gombalan Romantis Receh  
  "Buat gombalan buat {nama} pakai perumpamaan makanan (misal: 'Kamu kayak sambal, bikin adem tapi kadang pedes bikin nagih!')",  
  "Kasih pickup line buat {nama} dengan gaya iklan produk ('Kalau kamu obat, pasti aku overdosis!')",  
  "Bikinin gombalan buat {nama} yang awalnya norak tapi akhirnya bikin meleleh",  

  // 🎭 Gombalan Ala Sinetron/Sitkom  
  "Buat gombalan lebay ala sinetron India buat {nama} ('Aku rela berkorban seperti pemeran utama, asal kamu jadi happy ending-ku!')",  
  "Kasih gombalan ala FTV buat {nama} ('Seandainya aku bisa freeze time, aku akan pause di saat kamu tersenyum')",  
  "Bikinin gombalan cringe ala drama Korea, tapi dibikin lucu",  

  // 🍜 Gombalan Pakai Analogi Makanan  
  "Buat gombalan buat {nama} pakai perbandingan boba ('Kamu kayak boba, manisnya pas, nggak bikin eneg!')",  
  "Kasih pickup line buat {nama} pakai analogi martabak ('Aku mau jadi telurnya biar bisa deket sama kamu tiap hari')",  
  "Bikinin gombalan buat {nama} pakai konsep buffet ('Aku rela antri sejam asal bisa makan hati kamu')",  

  // 🛒 Gombalan Ala Kehidupan Sehari-hari  
  "Buat gombalan buat {nama} pakai situasi belanja di pasar ('Kalau kamu sayur, aku mau diborong semuanya!')",  
  "Kasih pickup line buat {nama} dengan gaya orang ngantri KRL ('Aku rela berdiri 1 jam asal duduk sebelah kamu')",  
  "Bikinin gombalan buat {nama} pakai analogi ojek online ('Aku kayak ojol, siap anter kamu kemana aja!')",  

  // 🎤 Gombalan Ala Lagu/Lirik  
  "Buat gombalan buat {nama} pakai lirik lagu pop Indonesia yang dibikin receh",  
  "Kasih pickup line buat {nama} dengan gaya lirik dangdut ('Sakitnya tuh di sini, pas kamu nggak mau chat balik')",  
  "Bikinin gombalan buat {nama} pakai judul film romantis ('Aku mau jadi Titanic biar kamu yang jadi Rose-nya')",  

  // 🏆 Gombalan Absurd Tapi Lucu  
  "Buat gombalan buat {nama} pakai logika ala iklan jamu ('Bikin segar kayak jamu, tapi nggak pahit!')",  
  "Kasih pickup line buat {nama} dengan gaya tukang bakso lewat ('Bakso aku spesial, kayak perasaan aku ke kamu')",  
  "Bikinin gombalan buat {nama} pakai konsep kuis ('Kalau kamu hadiah undian, aku mau menang setiap hari!')"  
];

const systemInstruction = `  
Kamu adalah **RAJA GOMBALAN KOCAK** dengan spesialisasi:  
1. **Gaya bahasa**: Santai, receh, tapi nggak cringe (pakai bahasa anak muda kekinian).  
2. **Wajib**:  
   - Sebut nama {nama} minimal 2x dalam gombalan.  
   - Pakai 1 analogi kehidupan sehari-hari (makanan, sinetron, lagu, dll).  
   - Ada **twist lucu** di akhir (jangan yang terlalu serius).  
3. **Formula**:  
   - **Pembuka**: Pujian absurd ("Kamu tuh kayak...").  
   - **Isi**: Gombalan receh tapi kreatif.  
   - **Penutup**: Ajakan/kata-kata manis yang bisa dibales {nama}.  

**Contoh Output**: 
Random:
*"Waduh {nama}, kamu tuh kayak martabak manis—luarnya biasa aja tapi dalemnya bikin nagih! Aku rela antri sejam buat kamu, eh tapi jangan dibagi ke orang lain ya, aku mau full satu! 😘 #NoSharing"*

Gombalan Makanan:
"{nama}, kamu tuh kayak seblak—pedesnya bikin melek, tapi enggak bisa berhenti makan! Aku rela kena ‘sakit perut’ asal tetap deket sama kamu. Mau jadi kerupuk aku? Biar kita selalu nyatu di kuah yang sama! 🥵❤️"

Gombalan Sinetron:
"Eh {nama}, kalau kamu pemeran sinetron, aku rela jadi figuran yang muncul tiap episode biar bisa liat kamu terus. Jangan dijadiin villain ya, aku nggak kuat lawan kamu! 😭 #JadiCameoAja"

Gombalan Dangdut:
"Aduh {nama}, sakitnya tuh di sini~ tunjuk hati pas kamu baca chatku tapi nggak dibales. Jangan kayak lagu dangdut dong, yang cuma sedih di awal tapi happy endingnya di remix! 🎶 Ayok mulai episode bahagianya! 😆"
`;

export const gombalin = async () => {
  const randomPrompts = await randomPrompt(gombalinPrompts)
  return await generateRespon(randomPrompts, systemInstruction)
}