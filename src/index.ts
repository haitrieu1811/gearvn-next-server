import express from 'express'
import cors, { CorsOptions } from 'cors'

import { ENV_CONFIG } from '~/constants/config'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import addressesRouter from '~/routes/addresses.routes'
import brandsRouter from '~/routes/brands.routes'
import cartItemsRouter from '~/routes/cartItems.routes'
import filesRouter from '~/routes/files.routes'
import ordersRouter from '~/routes/orders.routes'
import postsRouter from '~/routes/posts.routes'
import productCategoriesRouter from '~/routes/productCategories.routes'
import productsRouter from '~/routes/products.routes'
import reviewsRouter from '~/routes/reviews.routes'
import rolesRouter from '~/routes/roles.routes'
import staticRouter from '~/routes/static.routes'
import usersRouter from '~/routes/users.routes'
import databaseService from '~/services/database.services'
import { initFolders } from '~/utils/file'

databaseService.connect()
initFolders()

const app = express()
const port = ENV_CONFIG.PORT || 4000
const corsOptions: CorsOptions = {
  origin: ENV_CONFIG.CLIENT_URL
}

app.use(cors(corsOptions))
app.use(express.json())
app.use('/static', staticRouter)
app.use('/v1/users', usersRouter)
app.use('/v1/files', filesRouter)
app.use('/v1/roles', rolesRouter)
app.use('/v1/addresses', addressesRouter)
app.use('/v1/product-categories', productCategoriesRouter)
app.use('/v1/brands', brandsRouter)
app.use('/v1/products', productsRouter)
app.use('/v1/reviews', reviewsRouter)
app.use('/v1/cart-items', cartItemsRouter)
app.use('/v1/orders', ordersRouter)
app.use('/v1/posts', postsRouter)
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
