import { customAlphabet } from "nanoid"
import { db, schema } from "../db"

const generateSpaceId = customAlphabet("abcdefghijklmnopqrstuvwxyz", 10)

export async function createSpace({
  userId,
  name,
}: {
  userId: string
  name: string
}) {
  return await db.transaction(async (tx) => {
    const [space] = await tx
      .insert(schema.space)
      .values({
        id: generateSpaceId(),
        name,
      })
      .returning()

    await tx.insert(schema.membership).values({
      spaceId: space.id,
      userId: userId,
      role: "admin",
    })

    return space
  })
}
