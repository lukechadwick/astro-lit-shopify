let productQuery = `query getProductByHandle($handle: String) {
  product(handle: $handle) {
    title
  }
}`;

let collectionQuery = `query getCollectionByHandle($handle: String) {
  collection(handle: $handle) {
    title
    products(first: 10) {
      nodes {
        handle
        title
      }
    }
  }
}`;

const shopifyRequest = async (query: string, options: any) => {
  const response = await fetch(
    `https://${import.meta.env.MYSHOPIFY_URL}/api/2023-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": import.meta.env
          .PUBLIC_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: query,
        variables: {
          ...options,
        },
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: Error) => e.message).join("\n"));
  }

  return json.data;
};

export const getProductByHandle = async (handle: string | undefined) => {
  return await shopifyRequest(productQuery, { handle });
};

export const getCollectionByHandle = async (handle: string | undefined) => {
  return await shopifyRequest(collectionQuery, { handle });
};
