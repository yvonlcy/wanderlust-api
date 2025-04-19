export interface User {
    _id?: string
    username: string
    password: string
    role: 'operator' | 'member'
    email: string
    favorites?: string[]
}