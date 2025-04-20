export interface Member {
  _id?: string
  username: string
  password: string
  email: string
  photoUrl?: string
  favourites?: string[] // hotel ids
}
