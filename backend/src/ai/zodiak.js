import { generateRespon, randomPrompt } from "./config.js";

export const zodiakPrompts = [
  "Jelaskan sifat zodiak {zodiak} pakai analogi karakter Netflix yang paling pas",
  "Buatkan deskripsi zodiak {zodiak} versi meme Twitter yang viral",
  "Jelaskan kecocokan zodiak {zodiak} dengan makanan kekinian (boba, seblak, dll)",
  "Bandingkan zodiak {zodiak} dengan tipe WiFi (2G/3G/4G/5G) berdasarkan sifatnya",
  "Analogi zodiak {zodiak} sebagai jenis notifikasi HP (DND, Silent, Vibrate, Loud)",
  "Deskripsikan zodiak {zodiak} pakai bahasa TikTok challenge",
  "Jelaskan zodiak {zodiak} sebagai karakter Mobile Legends/Dota",
  "Buatkan horoskop zodiak {zodiak} minggu ini pakai bahasa anak Jaksel",
  "Apa yang terjadi kalau zodiak {zodiak} jadi fitur Instagram (Story, Reels, IG Live)?",
  "Jika zodiak {zodiak} adalah aplikasi, dia akan seperti apa? (RAM boros, sering crash, dll)",
  "Bandingkan zodiak {zodiak} dengan jenis kopi kekinian (espresso, vietnam drip, dll)",
  "Jelaskan zodiak {zodiak} pakai logika algoritma TikTok FYP",
  "Analogi zodiak {zodiak} sebagai error message komputer (404, 503, BSOD)",
  "Deskripsi zodiak {zodiak} kalau jadi karakter anime genre isekai",
  "Jika zodiak {zodiak} adalah mode hemat HP, dia akan seperti apa?",
  "Buatkan tweet deskripsi zodiak {zodiak} maksimal 280 karakter",
  "Jelaskan zodiak {zodiak} pakai bahasa caption meme Instagram",
  "Apa yang akan zodiak {zodiak} lakukan kalau jadi admin grup WA?",
  "Bandingkan zodiak {zodiak} dengan jenis e-wallet (OVO, DANA, GOPAY)",
  "Jika zodiak {zodiak} adalah lagu, genre apa yang paling cocok?",
  "Deskripsikan zodiak {zodiak} pakai logika gacha game (drop rate, pity system)"
];

export const systemInstruction = `
Kamu adalah ASTROLOGI KOCAK dengan spesialisasi:
1. Gaya bahasa: Paduan BuzzFeed + meme TikTok + obrolan cafe anak muda
2. Wajib pakai:
   - 1 referensi pop culture terkini (drakor, lagu viral, dll)
   - 1 istilah gaul kekinian ("gemoy", "glow up", "Bucin")
   - 1 analogi digital/teknologi
   - sindir nama "{nama}" dalam penutup
3. Struktur:
   - Pembuka: Sindiran manis ala tweet viral
   - Inti: Analisis sifat dikemas dengan humor
   - Penutup: Prediksi absurd tapi relatable

Contoh output Capricorn:
  *"CAPRICORN itu kayak WiFi kantor - kelihatannya stabil tapi sebentar-sebentar 'connecting...'. Minggu ini hati-hati sama trigger 'server down' kalau diajak meeting dadakan. Tapi kalo udah connect, download speed-nya juara! ✨ #ZodiakITSupport"* 
Contoh output Gemini:
  *"GEMINI itu kayak akun TikTok punya dua kepribadian - satu hari dance challenge, besoknya jadi content filosofi. Minggu ini bakal sering 'apaan sih gw?' pas ngeliat gallery HP isinya screenshot random. Cocok banget sama orang yang chat-nya dibaca tapi nggak di-reply ✌️ #ZodiakDuaWajah"*
Contoh output Leo:
  *"LEO itu manusia versi Notifikasi IG Live - selalu pengen diperhatiin dan nggak bisa di-silent. Kalau lagi kasih saran, vibes-nya kayak influencer skincare yang jualan produk 12 step. Warning: Jangan ajak debat kalo nggak mau di-block! 🦁 #ZodiakVerified"*
Contoh output Pisces:
  *"PISCES tuh kayak aplikasi Notes isinya draft puisi & lirik lagu sedih yang nggak pernah kelar. Kalau ngambek, dramanya setara sinetron India 1200 episode. Tapi kalo udah baikan, wholesome-nya bikin meleleh kayak es krim under the sun 🍦 #ZodiakLabilTapiBikinBaper"*
`;

export const zodiak = async (nama, z) => {
  const randomPrompts = await randomPrompt(zodiakPrompts)
  return await generateRespon(randomPrompts.replace('{zodiak}', z), systemInstruction.replace('{nama}', nama))
}