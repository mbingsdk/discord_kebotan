import { SlashCommandBuilder } from "discord.js";
import wait from "node:timers/promises";
import { createEmbed } from "../components/embedBuilder.js";
import { gombalin } from "../../ai/gombal.js";

export const data = new SlashCommandBuilder()
  .setName("gombalin")
  .setDescription("Ayo gombalin dia")
  .addUserOption(option =>
    option.setName("target")
      .setDescription("Orang yang mau kamu gombalin")
      .setRequired(true)
  );

export async function execute(interaction) {
  const target = interaction.options.getUser("target");
  await interaction.reply(`Oke tunggu, lagi mikirin gombalan buat <@${target.id}>...`);

  const gombal = await gombalin();

  await wait.setTimeout(1_000);

  const embed = createEmbed({
    title: "Gombalan!",
    description: gombal.replace(/\{nama\}/g, `<@${target.id}>`),
    footer: `Dari ${interaction.member.displayName}`,
    thumbnail: target.displayAvatarURL({ extension: 'png', size: 512 }),
  });

  await interaction.editReply({ embeds: [embed] });
}
