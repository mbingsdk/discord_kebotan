import * as cheerio from 'cheerio';
import axios from 'axios';

const scraper = async (yearNow = new Date().getFullYear()) => {
  console.log("Scraper running...");
  console.log(`Mengambil data libur tahun ${yearNow}`);
  
  return await scraperData(yearNow);

  async function scraperData(year) {
    try {
      // 1. Fetch HTML dengan axios
      const { data: html } = await axios.get(`https://www.tanggalan.com/${year}`);
      const $ = cheerio.load(html);
      const result = {};

      // 2. Proses parsing data
      $("article ul").each((i, ul) => {
        const $ul = $(ul);
        const tahun = $ul.find("li b").eq(0).text();
        const namaBulan = $ul.find("li a").eq(0).text().replace(/\d+/g, "").toLowerCase().trim();

        const bulanKey = namaBulan; // Contoh: "januari"
        result[bulanKey] = []; // Ubah menjadi array

        $ul.find("li").eq(3).find("tbody tr").each((i, tr) => {
          const $tr = $(tr);
          const keterangan = $tr.find("td").eq(1).text();
          const tanggal = $tr.find("td").eq(0).text();

          // Format tanggal (contoh: "1" -> "2025-01-01")
          const tanggalFormatted = `${tahun}-${String(i + 1).padStart(2, '0')}-${tanggal.padStart(2, '0')}`;
          
          // Push ke array
          result[bulanKey].push({
            tanggal: tanggalFormatted,
            keterangan
          });
        });
      });

      // console.log(result);
      return result;

    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  }
};

export default scraper;