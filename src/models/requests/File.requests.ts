import { ParamsDictionary } from 'express-serve-static-core'

export type FileIdReqParams = ParamsDictionary & {
  fileId: string
}
