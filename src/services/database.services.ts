import { Collection, Db, MongoClient } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import Role from '~/models/databases/Role.database'

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

  get users(): Collection<Role> {
    return this.db.collection(ENV_CONFIG.DB_ROLE_COLLECTION_NAME)
  }
}

const databaseService = new DatabaseService()
export default databaseService
