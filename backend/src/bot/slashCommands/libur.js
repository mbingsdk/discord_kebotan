import { SlashCommandBuilder } from 'discord.js';
import scraper from '../../services/dayoff.js';
import { createEmbed } from '../components/embedBuilder.js';
import DayOff from '../../models/DayOff.js';

const currentYear = new Date().getFullYear();

// Helper functions
const generateYearChoices = (yearsBack) => 
  Array.from({ length: yearsBack }, (_, i) => ({
    name: (currentYear - i).toString(),
    value: (currentYear - i).toString()
  }));

const generateMonthChoices = () => 
  ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 
   'juli', 'agustus', 'september', 'oktober', 'november', 'desember']
  .map(month => ({ name: month, value: month }));

// Command Builder
export const data = new SlashCommandBuilder()
  .setName('libur')
  .setDescription('Cek hari libur nasional')
  .addStringOption(option => 
    option.setName('tahun')
      .setDescription('Pilih tahun')
      .setRequired(true)
      .addChoices(...generateYearChoices(3))
  )
  .addStringOption(option =>
    option.setName('bulan')
      .setDescription('Filter berdasarkan bulan')
      .addChoices(...generateMonthChoices())
  );

// Command Execution
export async function execute(interaction) {
  await interaction.deferReply();

  try {
    const tahun = interaction.options.getString('tahun');
    const bulan = interaction.options.getString('bulan');
    
    // 1. Cek database dulu dengan benar
    const existingData = await DayOff.findOne({ tahun });
    let liburData;

    if (existingData?.bulan) {
      liburData = existingData.bulan;
      // console.log(`[CACHE] Data ${tahun} ditemukan di database`);
    } else {
      // 2. Baru scrape jika benar-benar tidak ada
      liburData = await fetchHolidayData(tahun);
      // console.log(`[SCRAPE] Data ${tahun} di-scrape`);
    }

    // Filter bulan
    if (bulan) {
      liburData = { 
        [bulan]: liburData[bulan] || [] 
      };
    }

    const embed = createHolidayEmbed(tahun, liburData, interaction.user);
    await interaction.editReply({ embeds: [embed] });

  } catch (error) {
    console.error('Error:', error);
    await interaction.editReply('⚠️ Gagal memuat data libur');
  }
}

// Data Fetching
async function fetchHolidayData(tahun) {
  const scrapedData = await scraper(tahun);
  await DayOff.findOneAndUpdate(
    { tahun },
    { bulan: scrapedData },
    { upsert: true, new: true }
  );
  return scrapedData;
}

// Embed Formatter
function createHolidayEmbed(tahun, data, user) {
  let description = `\n`;

  for (const [month, holidays] of Object.entries(data)) {
    description += `├─ **${month.toUpperCase()}**\n`;
    holidays.forEach(holiday => {
      description += `│ ├─ ${holiday.tanggal}\n`;
      description += `│ └─ ${holiday.keterangan}\n`
    });
    description += '\n';
  }
  description += '└─────────'

  return createEmbed({
    title: `📌 Daftar Hari Libur ${tahun}`,
    description,
    thumbnail: user.displayAvatarURL(),
    footer: 'Ref github: gerinsp'
  });
}