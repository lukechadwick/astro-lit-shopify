export const createCart = `
  mutation ($id: ID!, $quantity: Int!) {
    cartCreate (
      input: {
        lines: [
          {
            quantity: $quantity
            merchandiseId: $id
          }
        ],
      }
    ) {
      cart {
        id
        createdAt
        updatedAt
        lines(first: 10) {
          edges {
            node {
              id
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
        }
        # The estimated total cost of all merchandise that the customer will pay at checkout.
        cost {
          totalAmount {
            amount
            currencyCode
          }
          # The estimated amount, before taxes and discounts, for the customer to pay at checkout.
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;
