import { SlashCommandBuilder } from "discord.js"
import { motivator } from "../../ai/motivator.js"
import wait from "node:timers/promises"
import { createEmbed } from "../components/embedBuilder.js"

export const data = new SlashCommandBuilder()
  .setName('motivator')
  .setDescription('Butuh motivasi kan lu')

export async function execute(interaction) {
  await interaction.reply("Oke tunggu")
  const motivasi = await motivator(interaction.member.displayName)
  await wait.setTimeout(1_000);
  const embed = createEmbed({
    title: 'Motivator!',
    description: motivasi,
    footer: `Dibuat oleh ${interaction.member.displayName}`,
    thumbnail: interaction.member.displayAvatarURL({ extension: 'png', size: 512 }),
  });

  await interaction.editReply({ embeds: [embed] });
}