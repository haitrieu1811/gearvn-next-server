import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import fs from 'fs'
import path from 'path'

import { ENV_CONFIG } from '~/constants/config'

// Create SES service object.
const sesClient = new SESClient({
  region: ENV_CONFIG.AWS_REGION,
  credentials: {
    secretAccessKey: ENV_CONFIG.AWS_SECRET_ACCESS_KEY,
    accessKeyId: ENV_CONFIG.AWS_ACCESS_KEY_ID
  }
})

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}: {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string | string[]
  body: string
  subject: string
  replyToAddresses?: string | string[]
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  })
}

const sendMail = async (toAddress: string, subject: string, body: string) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: ENV_CONFIG.AWS_SES_FROM_ADDRESS,
    toAddresses: toAddress,
    body,
    subject
  })
  return sesClient.send(sendEmailCommand)
}

const emailTemplate = fs.readFileSync(path.resolve('src/templates/email.html'), 'utf8')

export const sendVerifyEmail = async (toAddress: string, verifyEmailToken: string) => {
  return sendMail(
    toAddress,
    'Verify Your Email',
    emailTemplate
      .replace('{{title}}', 'Confirm Your Email Address')
      .replace(
        '{{content}}',
        `Tap the button below to confirm your email address. If you didn't create an account with
        <a href="${ENV_CONFIG.CLIENT_URL}">Gearvn Next</a>, you can safely delete this email.`
      )
      .replace('{{link}}', `${ENV_CONFIG.CLIENT_URL}/verify-email?token=${verifyEmailToken}`)
      .replace('{{linkText}}', 'Continue Verify Email')
  )
}

export const sendForgotPasswordEmail = async (toAddress: string, forgotPasswordToken: string) => {
  return sendMail(
    toAddress,
    'Reset Your Password',
    emailTemplate
      .replace('{{title}}', 'Reset Your Password')
      .replace(
        '{{content}}',
        `<p>If you are an account registrant at <a href='${ENV_CONFIG.CLIENT_URL}'>Gearvn Next</a>, please click on the link below to reset your password.</p><p>If you are not the account creator, please ignore this email and do not click on the link below.</p>`
      )
      .replace('{{link}}', `${ENV_CONFIG.CLIENT_URL}/reset-password?token=${forgotPasswordToken}`)
      .replace('{{linkText}}', 'Continue Reset Password')
  )
}
