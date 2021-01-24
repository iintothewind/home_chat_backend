
interface Message {
  readonly topic: string
  readonly moment: number
  readonly sender: string
  readonly category: string
  readonly content: string
}

interface Translation {
  readonly word: string
  readonly phonetic: string
  readonly definition: string
  readonly translation: string
  readonly exchange: string
}

export { Message, Translation }