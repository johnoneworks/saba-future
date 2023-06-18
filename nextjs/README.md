This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Prerequisite

- Deploy the contracts of SabaToken & PredictionWorld ([Doc](../hardhat/README.md))

- Set up Biconomy
  - Login https://dashboard.biconomy.io/
  - Create Paymaster
  ![create-paymaster](./doc/images/biconomy-dashboard-01.png)
  - Create GasTank
  ![create-gastank-01](./doc/images/biconomy-dashboard-02.png)
  ![create-gastank-02](./doc/images/biconomy-dashboard-03.png)
  ![create-gastank-03](./doc/images/biconomy-dashboard-04.png)
  - Deposit the MATICs which will pay for the gas
  ![deposit-gas](./doc/images/biconomy-dashboard-05.png)
  - Add the Sure Token contracts to GasTank
  ![add-suretoken-to-gastank](./doc/images/biconomy-dashboard-06.png)
  - Add the Prediction World contracts to GasTank
  ![add-predictionworld-to-gastank](./doc/images/biconomy-dashboard-07.png)


### Deploy

- Update the settings

  - copy the ~/harhat/artifacts/contracts/<Contract Name>.json & ~/harhat/artifacts/contracts/SureToken3.json to ~/nextjs/utils/abis

  - update the addresses in ~/nextjs/config.js

  - copy Biconomy api key to ~/nextjs/components/BiconomyNavbar.js
  NOTE: It will be set on Vercel Secret after the proxy api is finished
  ![biconomy-apikey](./doc/images/biconomy-dashboard-08.png)

- Run the development server:

  ```bash
  npx next dev --port 3000
  # or
  npm run dev
  # or
  yarn dev
  # or
  pnpm dev
  ```

### Playground

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

- [API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

- The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

- This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

---

## Notes

Eth6 has breaking changes!
