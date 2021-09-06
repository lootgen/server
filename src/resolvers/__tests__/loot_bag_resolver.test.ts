import { gql } from 'apollo-server';

const CREATE_LOOT_BAG_MUTATION = gql`
  mutation createLootBag($items: [String!]!) {
    createLootBag(input: { items: $items }) {
      id
      items {
        name
      }
    }
  }
`;

const ITEMS = ['1', '2', '3', '4', '5', '6', '7', '8'];

describe('Loot Bag resolver', () => {
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
    const result = await global.client.mutate({
      mutation: CREATE_LOOT_BAG_MUTATION,
      variables: { items: items.splice(0, 1, '') },
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
});
