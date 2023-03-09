let productQuery = `query getProductByHandle($handle: String) {
  product(handle: $handle) {
    title
    description
    featuredImage {
      src
      transformedSrc(maxHeight: 500, maxWidth: 500)
    }
  }
}`;

let collectionQuery = `query getCollectionByHandle($handle: String) {
  collection(handle: $handle) {
    title
    products(first: 20) {
      nodes {
        handle
        title
        featuredImage {
          src
          transformedSrc(maxHeight: 200, maxWidth: 200)
        }
      }
    }
  }
}`;

let searchQuery = `query get($term: String) {
  products(first: 20, query: $term) {
    nodes {
      title
      handle
      description
      featuredImage {
        src
        transformedSrc(maxHeight: 200, maxWidth: 200)
      }
    }
  }
}`;

const shopifyRequest = async (query: string, options: any) => {
  const response = await fetch(
    `https://${import.meta.env.PUBLIC_MYSHOPIFY_URL}/api/2023-01/graphql.json`,
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

export const getSearchResultsByTerm = async (term: string | undefined) => {
  return await shopifyRequest(searchQuery, { term });
};
