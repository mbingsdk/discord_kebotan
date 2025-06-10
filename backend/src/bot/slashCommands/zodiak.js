import { SlashCommandBuilder } from 'discord.js';
import { setTimeout as wait } from 'node:timers/promises';
import { createEmbed } from '../components/embedBuilder.js';
import { zodiak } from '../../ai/zodiak.js';

export const data = new SlashCommandBuilder()
  .setName('zodiak')
  .setDescription('Cari tahu nasib zodiak kamu')
  .addStringOption(option =>
    option.setName('bintang')
      .setDescription('Pilih zodiak kamu')
      .setRequired(true)
      .addChoices(
        { name: 'Aries', value: 'Aries' },
        { name: 'Taurus', value: 'Taurus' },
        { name: 'Gemini', value: 'Gemini' },
        { name: 'Cancer', value: 'Cancer' },
        { name: 'Leo', value: 'Leo' },
        { name: 'Virgo', value: 'Virgo' },
        { name: 'Libra', value: 'Libra' },
        { name: 'Scorpio', value: 'Scorpio' },
        { name: 'Sagittarius', value: 'Sagittarius' },
        { name: 'Capricorn', value: 'Capricorn' },
        { name: 'Aquarius', value: 'Aquarius' },
        { name: 'Pisces', value: 'Pisces' }
      )
  );

export async function execute(interaction) {
  const selectedZodiak = interaction.options.getString('bintang');

  await interaction.reply("Oke tunggu...");

  const zod = await zodiak(interaction.member.displayName, selectedZodiak);
  // console.log(zod)
  await wait(1000);

  const quoted = zod;

  const embed = createEmbed({
    title: `Zodiak ${selectedZodiak}!`,
    description: quoted,
    footer: `Dibuat oleh SDK-Dev`,
    thumbnail: interaction.member.displayAvatarURL({ extension: 'png', size: 512 }),
  });

  await interaction.editReply({ embeds: [embed] });
}