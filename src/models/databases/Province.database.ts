import { ObjectId } from 'mongodb'

type Project = {
  id: string
  name: string
  lat: string
  lng: string
}

type Street = {
  id: string
  name: string
  prefix: string
}

type Ward = {
  id: string
  name: string
  prefix: string
}

type District = {
  id: string
  name: string
  wards: Ward[]
  streets: Street[]
  projects: Project[]
}

export type Province = {
  _id: ObjectId
  id: string
  code: string
  name: string
  districts: District[]
}
