import { z } from "zod"
import { t } from "."
import { db, schema } from "../db"
import { and, desc, eq, isNotNull, isNull } from "drizzle-orm"
import { extractFromHtml } from "@extractus/article-extractor"
import { ServerError, unauthorized } from "./error"
import { htmlToMarkdown } from "../markdown"
import { load } from "cheerio"

export const itemRouter = t.router({
  createLinkItem: t.procedure
    .input(
      z.object({
        url: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        spaceId: z.string(),
        skipFetching: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user || !ctx.gate.isSpaceMember(input.spaceId)) {
        throw unauthorized()
      }

      let title = input.title
      let description = input.description
      let linkImage: string | undefined
      let content

      if (!input.skipFetching) {
        if (!title || !description || !linkImage || !content) {
          const response = await fetch(input.url, {
            headers: {
              "user-agent":
                "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)",
            },
          })

          if (response.ok) {
            const html = await response.text()

            const $ = load(html, { decodeEntities: true })
            const article = await extractFromHtml(html, input.url)

            if (!title) {
              title = article?.title || $("title").text()
            }

            if (!content && article?.content) {
              content = htmlToMarkdown(article.content)
            }

            if (!description) {
              description =
                article?.description ||
                $("meta[name='description']").attr("content")
            }

            if (!linkImage) {
              linkImage =
                article?.image ||
                $("meta[property='og:image']").attr("content") ||
                $("meta[name='twitter:image']").attr("content")
            }
          }
        }
      }

      if (!title) {
        title = input.url.replace(/https?:\/\//, "")
      }

      await db.insert(schema.item).values({
        spaceId: input.spaceId,
        type: "link",
        url: input.url,
        title,
        description,
        linkImage,
        content,
      })
    }),

  createNoteItem: t.procedure
    .input(
      z.object({
        spaceId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.gate.isSpaceMember(input.spaceId)) {
        throw unauthorized()
      }

      await db.insert(schema.item).values({
        spaceId: input.spaceId,
        type: "note",
        content: input.content,
      })
    }),

  updateNoteItem: t.procedure
    .input(
      z.object({
        itemId: z.string(),
        content: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const item = await db.query.item.findFirst({
        where: eq(schema.item.id, input.itemId),
        columns: {
          id: true,
          spaceId: true,
        },
      })

      if (!item || !ctx.gate.isSpaceMember(item.spaceId)) {
        throw unauthorized()
      }

      await db
        .update(schema.item)
        .set({
          content: input.content,
        })
        .where(eq(schema.item.id, input.itemId))
    }),

  updateLinkItem: t.procedure
    .input(
      z.object({
        itemId: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        url: z.string().url().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const item = await db.query.item.findFirst({
        where: eq(schema.item.id, input.itemId),
        columns: {
          id: true,
          spaceId: true,
        },
      })

      if (!item || !ctx.gate.isSpaceMember(item.spaceId)) {
        throw unauthorized()
      }

      await db
        .update(schema.item)
        .set({
          title: input.title,
          description: input.description,
          url: input.url,
        })
        .where(eq(schema.item.id, item.id))
    }),

  getItems: t.procedure
    .input(
      z.object({
        spaceId: z.string(),
        isTrash: z.boolean().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      if (!ctx.gate.isSpaceMember(input.spaceId)) return []

      return db.query.item.findMany({
        where: and(
          eq(schema.item.spaceId, input.spaceId),
          input.isTrash
            ? isNotNull(schema.item.deletedAt)
            : isNull(schema.item.deletedAt),
        ),
        orderBy: input.isTrash
          ? desc(schema.item.deletedAt)
          : desc(schema.item.createdAt),
      })
    }),

  moveToTrash: t.procedure
    .input(
      z.object({
        itemId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const item = await db.query.item.findFirst({
        where: eq(schema.item.id, input.itemId),
        columns: {
          id: true,
          spaceId: true,
          deletedAt: true,
        },
      })

      if (!item || !ctx.gate.isSpaceMember(item.spaceId)) {
        throw unauthorized()
      }

      await db
        .update(schema.item)
        .set({
          deletedAt: item.deletedAt ? null : new Date(),
        })
        .where(eq(schema.item.id, item.id))

      return !item.deletedAt
    }),
})
