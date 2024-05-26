import { Request } from 'express'
import { File } from 'formidable'
import fs from 'fs'

import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { FILES_MESSAGES } from '~/constants/message'

export const initFolders = () => {
  ;[UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR].forEach((path) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, {
        recursive: true
      })
    }
  })
}

export const getExtensionFromFullName = (fullName: string) => {
  const nameArr = fullName.split('.')
  return nameArr[nameArr.length - 1]
}

export const getNameFromFullName = (fullName: string) => {
  const nameArr = fullName.split('.')
  nameArr.pop()
  return nameArr.join('')
}

export const handleUploadImage = async (req: Request) => {
  const formiable = (await import('formidable')).default
  const form = formiable({
    uploadDir: UPLOAD_IMAGE_DIR,
    keepExtensions: true,
    maxFileSize: 1000 * 1024, // 1MB
    maxTotalFileSize: Infinity,
    filter: ({ name, mimetype }) => {
      const isValid = name === 'image' && !!mimetype?.includes('image/')
      if (!isValid) {
        form.emit('errors' as any, new Error(FILES_MESSAGES.IMAGE_FILE_TYPE_INVALID) as any)
      }
      return isValid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, _, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error(FILES_MESSAGES.IMAGE_FIELD_IS_REQUIRED))
      }
      resolve(files.image as File[])
    })
  })
}
