import { SlashCommandBuilder } from 'discord.js';
import { setTimeout as wait } from 'node:timers/promises';
import { createEmbed } from '../components/embedBuilder.js';
import { urlInfo, urlScanner } from '../../services/urlScanner.js';
import { cooldownMiddleware } from '../middleware/cooldownMiddleware.js';

export const data = new SlashCommandBuilder()
  .setName('virusscann')
  .setDescription('Scan URL phissing/mallware')
  .addStringOption(option =>
    option.setName('url')
      .setDescription('e.g: https://mbingsdk.my.id')
      .setRequired(true)
  );

export async function execute(interaction) {
  const middleware = [
    cooldownMiddleware('virusscann', 15)
  ]
  
  let i = 0
  const next = async () => {
    const fn = middleware[i++]
    if (fn) return fn(interaction, next)

    const url = interaction.options.getString('url');
    console.log(url)
    const analized = await urlScanner(url.trim())

    await interaction.reply("Oke tunggu...");
    await wait(1000);

    const targetId = analized.data.data.id.split('-')[1];
    console.log(targetId)
    const res = await urlInfo(targetId)
    await wait(1000);

    const dataPretty = res.data.data.attributes.last_analysis_stats
    console.log(dataPretty)

    let title = ""
    let color = 0x00ff55
    if (dataPretty.malicious > 0 || dataPretty.suspicious > 0) {
      title = `🚨 Oh nooo! ${url}`
      color = 0xff5555
    } else {
      title = `✅ Result ${url}`
    }

    const embed = createEmbed({
      title: title,
      color: color,
      description: '```'+JSON.stringify(dataPretty, null, 2)+'```',
      footer: `Dibuat oleh SDK-Dev`,
      thumbnail: interaction.member.displayAvatarURL({ extension: 'png', size: 512 }),
    });

    await interaction.editReply({ embeds: [embed] });
  }

  await next()
}