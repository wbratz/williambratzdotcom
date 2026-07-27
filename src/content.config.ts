import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./contents" }),
  schema: z
    .object({
      title: z.string().min(1),
      slug: z.string().min(1),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      description: z.string().min(1),
      photo: z.string().min(1),
      banner: z.string().min(1),
      imageAlt: z.string().min(1),
      topics: z.array(z.string().min(1)).min(1),
      series: z.string().min(1).optional(),
      seriesOrder: z.number().int().positive().optional(),
      featured: z.boolean(),
    })
    .refine((entry) => Boolean(entry.series) === Boolean(entry.seriesOrder), {
      message: "series and seriesOrder must be supplied together",
    }),
});

export const collections = { blog };
