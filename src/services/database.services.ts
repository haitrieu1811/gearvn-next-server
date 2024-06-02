import { Collection, Db, MongoClient } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import Address from '~/models/databases/Address.database'
import Brand from '~/models/databases/Brand.database'
import CartItem from '~/models/databases/CartItem.database'
import File from '~/models/databases/File.database'
import Order from '~/models/databases/Order.database'
import Post from '~/models/databases/Post.database'
import Product from '~/models/databases/Product.database'
import ProductCategory from '~/models/databases/ProductCategory.database'
import { Province } from '~/models/databases/Province.database'
import RefreshToken from '~/models/databases/RefreshToken.database'
import Review from '~/models/databases/Review.database'
import Role from '~/models/databases/Role.database'
import User from '~/models/databases/User.database'
import UserRole from '~/models/databases/UserRole.database'

const uri = `mongodb+srv://${ENV_CONFIG.DB_USERNAME}:${ENV_CONFIG.DB_PASSWORD}@gearvnnextcluster.zyet3vs.mongodb.net/?retryWrites=true&w=majority&appName=gearvnNextCluster`
class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(ENV_CONFIG.DB_NAME)
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  get users(): Collection<User> {
    return this.db.collection(ENV_CONFIG.DB_USERS_COLLECTION_NAME)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(ENV_CONFIG.DB_REFRESH_TOKENS_COLLECTION_NAME)
  }

  get files(): Collection<File> {
    return this.db.collection(ENV_CONFIG.DB_FILES_COLLECTION_NAME)
  }

  get roles(): Collection<Role> {
    return this.db.collection(ENV_CONFIG.DB_ROLES_COLLECTION_NAME)
  }

  get userRoles(): Collection<UserRole> {
    return this.db.collection(ENV_CONFIG.DB_USER_ROLES_COLLECTION_NAME)
  }

  get addresses(): Collection<Address> {
    return this.db.collection(ENV_CONFIG.DB_ADDRESSES_COLLECTION_NAME)
  }

  get provinces(): Collection<Province> {
    return this.db.collection(ENV_CONFIG.DB_PROVINCES_COLLECTION_NAME)
  }

  get productCategories(): Collection<ProductCategory> {
    return this.db.collection(ENV_CONFIG.DB_PRODUCT_CATEGORIES_COLLECTION_NAME)
  }

  get brands(): Collection<Brand> {
    return this.db.collection(ENV_CONFIG.DB_BRANDS_COLLECTION_NAME)
  }

  get products(): Collection<Product> {
    return this.db.collection(ENV_CONFIG.DB_PRODUCTS_COLLECTION_NAME)
  }

  get reviews(): Collection<Review> {
    return this.db.collection(ENV_CONFIG.DB_REVIEWS_COLLECTION_NAME)
  }

  get cartItems(): Collection<CartItem> {
    return this.db.collection(ENV_CONFIG.DB_CART_ITEMS_COLLECTION_NAME)
  }

  get orders(): Collection<Order> {
    return this.db.collection(ENV_CONFIG.DB_ORDERS_COLLECTION_NAME)
  }

  get posts(): Collection<Post> {
    return this.db.collection(ENV_CONFIG.DB_POSTS_COLLECTION_NAME)
  }
}

const databaseService = new DatabaseService()
export default databaseService
