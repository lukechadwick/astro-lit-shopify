const productQuery = `query getProductByHandle($handle: String) {
  product(handle: $handle) {
    variants(first: 20) {
      nodes {
        id
        compareAtPriceV2 {
          amount
          currencyCode
        }
        priceV2 {
          currencyCode
          amount
        }
        title
        selectedOptions {
          name
          value
        }
      }
    }
    title
    description
    featuredImage {
      src
      transformedSrc(maxHeight: 500, maxWidth: 500)
    }
  }
}`;

const collectionQuery = `query getCollectionByHandle($handle: String) {
  collection(handle: $handle) {
    title
    description
    products(first: 20) {
      nodes {
        handle
        title
        featuredImage {
          src
          transformedSrc(maxHeight: 200, maxWidth: 200)
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
}`;

const searchQuery = `query get($term: String) {
  products(first: 20, query: $term) {
    nodes {
      title
      handle
      description
      featuredImage {
        src
        transformedSrc(maxHeight: 200, maxWidth: 200)
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
}`;

const footerQuery = `
  query getFooterMenu($handle: String!) {
    menu(handle: $handle) {
      items {
        title
        url
        items {
          title
          url
          items {
            title
            url
          }
        }
      }
      title
    }
  }
`;

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

export const getFooterMenu = async (handle: string | undefined) => {
  return await shopifyRequest(footerQuery, { handle });
};
