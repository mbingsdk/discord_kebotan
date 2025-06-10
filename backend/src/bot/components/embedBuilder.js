import { EmbedBuilder } from 'discord.js';

/**
 * Fungsi membuat embed Discord yang bisa dipakai ulang.
 * @param {Object} options
 * @param {string} [options.title]
 * @param {string} [options.description]
 * @param {string|number} [options.color]
 * @param {Array} [options.fields]
 * @param {string} [options.footer]
 * @param {string} [options.thumbnail]
 * @param {string} [options.image]
 * @returns {EmbedBuilder}
 */
export function createEmbed({
  title,
  description,
  color = 0x00bfff,
  fields = [],
  footer,
  thumbnail,
  image,
} = {}) {
  const embed = new EmbedBuilder().setColor(color);

  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  if (fields.length) embed.addFields(fields);
  if (footer) embed.setFooter({ text: footer });
  if (thumbnail) embed.setThumbnail(thumbnail);
  if (image) embed.setImage(image);

  return embed;
}