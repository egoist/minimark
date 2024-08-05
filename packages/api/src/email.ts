import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { env } from "./env"

const fromEmail = "Kevin from Minimark <kevin@minimark.app>"

const ses = new SESClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})

const sendEmail = async ({
  from,
  to,
  replyTo,
  subject,
  html,
}: {
  from?: string
  to: string | string[]
  replyTo?: string
  subject: string
  html: string
}) => {
  if (IS_DEV) {
    console.log(`Email to ${to}: ${subject}\n${html}`)
    return
  }

  const command = new SendEmailCommand({
    Source: from || fromEmail,
    Destination: {
      ToAddresses: Array.isArray(to) ? to : [to],
    },
    ReplyToAddresses: replyTo ? [replyTo] : undefined,
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Html: {
          Data: html,
        },
      },
    },
  })

  await ses.send(command)
}

export async function sendLoginCodeEmail({
  code,
  to,
}: {
  code: string
  to: string
}) {
  await sendEmail({
    to,
    subject: "Your Minimark login code",
    html: `
<p>Your login code:</p>

<p><strong>${code}</strong></p>

<p>
This code will expire in 1 hour, you can safely ignore this email if you didn't request it.
</p>
    `,
  })
}
