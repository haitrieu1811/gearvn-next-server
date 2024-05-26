import { Collection, Db, MongoClient } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import File from '~/models/databases/File.database'
import RefreshToken from '~/models/databases/RefreshToken.database'
import Role from '~/models/databases/Role.database'
import User from '~/models/databases/User.database'

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
}

const databaseService = new DatabaseService()
export default databaseService
