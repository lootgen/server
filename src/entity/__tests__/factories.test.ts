import { makeLootBag } from '../factories';

describe('Factories', () => {
  it('will retrieve an existing loot bag if it is a duplicate', async () => {
    const lootBag = await makeLootBag([
      'gm',
      'gm',
      'gm',
      'gm',
      '1',
      '1',
      '1',
      '1',
    ]);
    const duplicate = await makeLootBag([
      '1',
      '1',
      '1',
      '1',
      'gm',
      'gm',
      'gm',
      'gm',
    ]);
    expect(duplicate.id).toBe(lootBag.id);
  });
});
