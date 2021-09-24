import { createCanvas, registerFont } from 'canvas';
import * as core from 'express-serve-static-core';
import { fillTextWithTwemoji } from 'node-canvas-with-twemoji';

import { LootBag } from './entity/loot_bag';

const WIDTH = 1200;
const HEIGHT = 628;
const multiplier = 2.5;

const registerExpressAPI = (app: core.Express): void => {
  app.get('/loot/:id/image.png', async (req, res) => {
    try {
      registerFont('src/fonts/EBGaramond.ttf', { family: 'EBGaramond' });
      const lootBag = await LootBag.findOneOrFail(req.params.id);

      const canvas = createCanvas(WIDTH, HEIGHT);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'end';

      ctx.font = `${multiplier * 13}px "EBGaramond"`;
      ctx.fillText(`#${lootBag.id}`, WIDTH - 18 * multiplier, 26 * multiplier);

      ctx.textAlign = 'start';
      ctx.font = `${multiplier * 20}px "EBGaramond"`;

      for (let i = 0; i < lootBag.items.length; i++) {
        const itemName = lootBag.items[i].item.name;
        await fillTextWithTwemoji(
          ctx,
          itemName,
          24 * multiplier,
          26 + (i + 1) * 27 * multiplier
        );
      }

      const buffer = canvas.toBuffer('image/png');

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': buffer.length,
      });
      res.end(buffer);
    } catch (error) {
      console.log(error);
      res.sendStatus(404);
    }
  });
};

export default registerExpressAPI;
