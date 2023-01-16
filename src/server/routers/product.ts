import { v4 as uuid } from "uuid";
import { ethers, utils } from "ethers";
import { procedure, router } from "../trpc";
import { z } from "zod";
import { JsonDB, Config } from "node-json-db";

type Product = {
  id: string;
  name: string;
  url: string;
  value: string;
  owner: string;
  transactionHash: string;
  createdBy: string;
};
export const productRouter = router({
  products: procedure.query(async ({ ctx }) => {
    const keys = await ctx.db.keys("");
    const data = await ctx.db.mget(...keys);
    return data as Product[];
  }),
  buyProduct: procedure
    .input(
      z.object({
        hash: z.string(),
        productId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { hash, productId } = input;

      const tx = await ctx.provider.getTransaction(hash);
      const from = tx.from;
      const to = tx.to;
      const sendValue = utils.formatEther(tx.value);

      await tx.wait();

      const product = (await ctx.db.get(productId)) as Product;

      if (
        product.id === productId &&
        sendValue === product.value &&
        to === product.createdBy
      ) {
        product.owner = from!;
        product.transactionHash = hash;
      }

      await ctx.db.set(product.id, product);
    }),
});
