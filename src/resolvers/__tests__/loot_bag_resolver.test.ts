import { gql } from 'apollo-server';

import { makeLootBag } from '../../entity/factories';

const FETCH_LOOT_BAG = gql`
  query lootBag($id: Int!) {
    lootBag(input: { id: $id }) {
      items {
        item {
          name
        }
        order
      }
    }
  }
`;

const CREATE_LOOT_BAG_MUTATION = gql`
  mutation createLootBag($items: [String!]!) {
    createLootBag(input: { items: $items }) {
      id
      items {
        item {
          name
        }
        order
      }
    }
  }
`;

const ITEMS = ['1', '2', '3', '4', '5', '6', '7', '8'];

describe('Loot Bag resolver', () => {
  it('can fetch a loot bag by ID', async () => {
    const lootBag = await makeLootBag(ITEMS);
    const result = await global.client.query({
      query: FETCH_LOOT_BAG,
      variables: { id: lootBag.id },
    });
    expect(result).toMatchSnapshot();
  });

  it('sorts loot items based on insert order', async () => {
    const reversedItems = [...ITEMS].reverse();
    const lootBag = await makeLootBag(reversedItems);
    const result = await global.client.query({
      query: FETCH_LOOT_BAG,
      variables: { id: lootBag.id },
    });
    expect(result).toMatchSnapshot();
  });

  it('throws error: items must contain 8 elements', async () => {
    let result = await global.client.mutate({
      mutation: CREATE_LOOT_BAG_MUTATION,
      variables: { items: [] },
    });
    expect(result).toMatchSnapshot();

    result = await global.client.mutate({
      mutation: CREATE_LOOT_BAG_MUTATION,
      variables: { items: ITEMS.slice(0, 7) },
    });
    expect(result).toMatchSnapshot();

    result = await global.client.mutate({
      mutation: CREATE_LOOT_BAG_MUTATION,
      variables: { items: [...ITEMS, '9'] },
    });
    expect(result).toMatchSnapshot();
  });

  it('throws error: loot items cannot be empty strings', async () => {
    const items = [...ITEMS];
    items.splice(0, 1, '');
    const result = await global.client.mutate({
      mutation: CREATE_LOOT_BAG_MUTATION,
      variables: { items },
    });
    expect(result).toMatchSnapshot();
  });

  it('can create a new loot bag', async () => {
    const result = await global.client.mutate({
      mutation: CREATE_LOOT_BAG_MUTATION,
      variables: { items: ITEMS },
    });
    expect(result).toMatchSnapshot();
  });

  it('can create a loot bag with duplicate items', async () => {
    const result = await global.client.mutate({
      mutation: CREATE_LOOT_BAG_MUTATION,
      variables: { items: ['gm', 'gm', 'gm', 'gm', 'gm', 'gm', 'gm', 'gm'] },
    });
    expect(result).toMatchSnapshot();
  });

  it('throws error: loot items cannot contain profanity', async () => {
    const items = [...ITEMS];
    items.splice(4, 1, 'dumb fUcK');
    const result = await global.client.mutate({
      mutation: CREATE_LOOT_BAG_MUTATION,
      variables: { items },
    });
    expect(result).toMatchSnapshot();
  });
});
