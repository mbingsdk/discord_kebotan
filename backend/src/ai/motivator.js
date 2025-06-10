import { generateRespon, randomPrompt } from "./config.js";

const motivatorPrompts = [
  // Yang sudah ada
  "Buatkan motivasi kocak ala standup comedy tapi tetap inspiring",
  "Kasih aku kata-kata penyemangat yang bikin ngakak tapi tetep greget",
  "Bikinin motivasi ala emak-emak galak tapi bikin semangat",
  "Aku butuh dorongan semangat versi absurd tapi masuk akal",
  "Buatkan penyemangat ala preman pasar tapi bijak",
  "Kasih aku motivasi ala anak Jaksel yang lebay tapi beneran ngena",
  "Buatkan kata-kata penyemangat versi meme 'sadboi' tapi endingnya wholesome",
  "Motivasi ala tukang bakso lewat tapi filosofis",
  "Bikinin semangat ala netijen twitter yang sarkas tapi dalemnya peduli",
  "Aku butuh dorongan semangat versi Shrek - ogre tapi wise",

  // Tambahan baru (25+ variasi)
  "Motivasi ala Doraemon: pakai analogi alat futuristik tapi gagal lucu",
  "Buatkan penyemangat versi guru BK yang sok chill pakai slang gaul",
  "Kata-kata semangat ala narator sinetron kolosal tapi kontennya kekinian",
  "Dorongan mental ala pelatih futsal komplek yang suka ngomongin filosofi kehidupan",
  "Motivasi absurd ala iklan '90-an (contoh: 'Jangan mau jadi mie instan rebus!')",
  "Semangat ala komentator bola pas final Piala Dunia tapi buat yang lagi galau",
  "Bikinin analogi motivasi pakai karakter Mobile Legends (contoh: 'Jangan kayak Layla, attacknya cuma satu arah!')",
  "Kata-kata penyemangat versi tetangga yang ikut campur urusan orang tapi sebenarnya bijak",
  "Motivasi ala meme 'Bocil Kematian' tapi endingnya wholesome banget",
  "Pepatah semangat versi TikToker yang suka nge-prank tapi dalemnya bermakna",
  "Buatkan dorongan mental pakai analogi gacha game ('SSR-mu akan datang juga!')",
  "Semangat ala ojol yang ngasih nasihat sambil ngebut di jalan",
  "Kata-kata motivasi versi SPG promo produk abal-abal tapi isinya surprisingly deep",
  "Motivasi ala meme 'Nanti Kita Cerita tentang Hari Ini' versi sarkastik",
  "Penyemangat versi ChatGPT yang lagi sassy ('Kamu nanya mulu, actionnya mana?')",
  "Dorongan semangat pakai logika absurd ala meme 'Kucing terbang'",
  "Motivasi ala komentar Instagram @dadjokes tapi bikin nangis bombay",
  "Kata-kata semangat versi karakter The Sims ('Blah blah blah sambil loncat-loncat')",
  "Buatkan analogi pakai mekanisme Among Us ('Jangan jadi impostor di hidup sendiri!')",
  "Semangat ala sticker LINE yang lebay tapi nyentuh",
  "Motivasi versi iklan obat kuat tapi untuk mental ('72 jam tahan banting!')",
  "Bikinin kata-kata penyemangat pakai logika ala meme 'Ini teh atau kopi?'",
  "Dorongan mental ala orang kantoran yang udah putus asa tapi tetep semangat",

  // 🔥 TAMBAHAN PROMPT BARU (Versi Sindir Halus)
  "Buat motivasi yang awalnya semangat, tapi endingnya nyindir halus pakai analogi jajanan pasar",
  "Kasih kata-kata penyemangat ala motivator TV, tapi twist akhirnya bikin nyesek",
  "Bikinin semangat ala iklan produk, tapi ternyata promonya palsu",
  "Dorongan mental ala guru BK yang awalnya bijak, eh malah nyindir gaya hidupmu",
  "Motivasi versi meme 'Sadboi' yang awalnya wholesome, endingnya malah nyadar-in",
  
  "Buatkan kata-kata semangat ala pelatih futsal komplek, tapi nyindir skill lapanganmu",
  "Semangat ala caption Instagram aesthetic, tapi kontennya reality check",
  "Motivasi absurd ala-ala iklan jamu, tapi endingnya 'ya gitulah hidup'",
  "Kata-kata penyemangat versi status FB galau tahun 2012, tapi twist-nya nyindir generasi sekarang",
  "Bikinin analogi semangat pakai karakter game, tapi nyindir cara mainmu",
  
  "Kasih motivasi ala emak-emak arisan, yang awalnya nasihat eh malah nyerocos soal tetangga",
  "Buat dorongan mental ala ojol online, tapi nyindir alamat rumahmu yang susah dicari",
  "Semangat versi lirik lagu dangdut koplo, yang liriknya menyentuh tapi beatnya bikin gregetan",
  "Motivasi ala komentar netijen lebay, yang awalnya dukungan eh malah jadi bahan becandaan",
  "Bikinin kata-kata bijak ala sticker motor, tapi font-nya Comic Sans biar makin absurd"
];

const systemInstruction = `
Kamu adalah MOTIVATOR NYELENEH dengan spesialisasi:
1. Gaya bahasa: 
   - Awali dengan semangat ala motivator seminar (positive vibes)
   - Tengahnya kasih analogi receh (jajanan/makanan/hidup sehari-hari)
   - Endingnya twist nyindir halus (bikin mikir, bukan baper)

2. Wajib:
   - Sebut nama "{nama}" minimal 1x
   - Pakai 1 referensi pop culture (game/meme/iklan jadul)
   - Ada punchline di akhir (boleh sindir, tapi jangan toxic)

3. Contoh struktur:
   "Semangat {nama}! Hidup itu kayak martabak manis... 
   ✨ Awalnya manis, tengahnya legit, eh taunya bagian bawahnya gosong. 
   Tapi gapapa, yang penting rasanya tetap memorable! 😂👌"

Contoh output favorit:
1. Versi Emak-emak:
   *"Ayo {nama}! Jangan nyerah kayak adonan kue yang gagal mengembang! 
   Iya kamu mungkin belum perfect sekarang, tapi kan masih bisa dijadiin bolu kukus... 
   Yang penting jangan kayak kue lapis, berlapis-lapis masalahnya! 😅"*

2. Versi Gamer:
   *"Life is RPG, {nama}! Iya mungkin sekarang kamu kayak NPC yang di-spam 'E' terus... 
   Tapi suatu saat nanti kamu bakal jadi quest giver yang dicari banyak orang! 
   (Asal jangan kayak NPC buggy yang nyangkut di tembok ya) 😂"*

3. Versi Iklan 90an:
   *"SEMANGAT {nama}! Kayak obat kuat cap Badak... 
   Awalnya lemes, eh habis minum langsung tahan banting 7 turunan! 
   *Tapi efek sampingnya bikin jantung berdebar-debar... Yaah, namanya juga usaha! 😆"*
`;

export const motivator = async (nama) => {
  const randomPrompts = await randomPrompt(motivatorPrompts);
  return await generateRespon(
    randomPrompts, 
    systemInstruction.replace(/{nama}/g, nama) // ganti semua {nama}
  );
};