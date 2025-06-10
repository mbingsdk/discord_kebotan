import { motivator } from "../../ai/motivator.js";
import { createEmbed } from "../components/embedBuilder.js";
import wait from "node:timers/promises"

export const name = 'motivator'

export async function execute(message, args) {
  console.log(message.author.globalName)
  // console.log(args)
  const sent = await message.reply("Oke tunggu");
  const motivasi = await motivator(message.author.displayName)
  await wait.setTimeout(1_000);
  const embed = createEmbed({
    title: 'Motivator!',
    description: motivasi.match(/"([^"]+)"/)[0],
    footer: `Dibuat oleh ${message.author.displayName}`,
    thumbnail: message.author.displayAvatarURL({ extension: 'png', size: 512 }),
  });

  await sent.edit({ embeds: [embed], content: null });
}
