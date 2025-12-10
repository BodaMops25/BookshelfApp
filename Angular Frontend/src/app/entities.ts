export type SubmitEventData = {
  formData: FormData,
  element: HTMLFormElement
}

export type User = {
  id: string
  creatingDate: string
  login: string
  password: string
  bookIds: string[]
  quoteIds: string[]
}

export type UserFields = {
  login: string
  password: string
}

export type Book = {
  id: string
  ownerId: string | null
  creatingDate: string
  title: string
  author: string
  releaseDate: string
  pages: number | null
  genres: string | null
  rating: number | null
}

export type BookFields = {
  title: string
  author: string
  releaseDate: string
  pages: number
  genres: string
  rating: number
}

export type Quote = {
  id: string
  creatingDate: string
  title: string | null
  text: string
  author: string | null
  bookTitle: string | null
  ownerId: string | null
}

export type QuoteFields = {
  title: string,
  text: string,
  author: string,
  bookTitle: string
}