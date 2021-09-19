import * as core from 'express-serve-static-core';
import svg2img from 'svg2img';

import { ILootBag } from './entity/interfaces/loot_bag_interface';
import { LootBag } from './entity/loot_bag';

const createSVGForLoot = (lootBag: ILootBag): string => {
  const svgStrings = [
    '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
    '<defs><style type="text/css">@import url("https://fonts.googleapis.com/css?family=EB+Garamond");</style></defs>',
    '<style>.base { fill: white; font-family: "EB Garamond", serif; font-size: 24px; }</style><rect width="100%" height="100%" fill="black" />',
  ];
  lootBag.items.forEach((lootItem, index) => {
    svgStrings.push(`<text x="24" y="${(index + 1) * 31}" class="base">`);
    svgStrings.push(lootItem.item.name);
    svgStrings.push('</text>');
  });
  svgStrings.push('</svg>');
  return svgStrings.join('');
};

const registerExpressAPI = (app: core.Express): void => {
  app.get('/loot/:id/image.png', async (req, res) => {
    try {
      const lootBag = await LootBag.findOneOrFail(req.params.id);
      const svg = createSVGForLoot(lootBag);
      svg2img(
        svg,
        {
          width: 1024,
          height: 1024,
          quality: 100,
        },
        (error, buffer) => {
          res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': buffer.length,
          });
          res.end(buffer);
        }
      );
    } catch (error) {
      res.sendStatus(404);
    }
  });
};

export default registerExpressAPI;
