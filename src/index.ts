import express from 'express'

import { ENV_CONFIG } from '~/constants/config'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import filesRouter from '~/routes/files.routes'
import staticRouter from '~/routes/static.routes'
import usersRouter from '~/routes/users.routes'
import databaseService from '~/services/database.services'
import { initFolders } from '~/utils/file'

databaseService.connect()
initFolders()

const app = express()
const port = ENV_CONFIG.PORT || 4000

app.use(express.json())
app.use('/v1/users', usersRouter)
app.use('/v1/files', filesRouter)
app.use('/static', staticRouter)
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
