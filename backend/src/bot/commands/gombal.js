import { gombalin } from "../../ai/gombal.js";
import { createEmbed } from '../components/embedBuilder.js';
import wait from 'node:timers/promises';

export const name = 'gombalin';

export async function execute(message, args) {
  const user = message.mentions.users.first();

  if (!user) {
    return message.reply('⚠️ Tag orang yang mau kamu gombalin, contohnya: `!gombalin @user`');
  }

  const gombal = await gombalin();
  await wait.setTimeout(1_000);

  const embed = createEmbed({
    title: 'Gombalan!',
    description: gombal.replace(/\{nama\}/g, `<@${user.id}>`),
    footer: `Dari ${message.author.displayName || message.author.username}`,
    thumbnail: user.displayAvatarURL({ extension: 'png', size: 512 }),
  });

  await message.reply({ embeds: [embed] });
}
