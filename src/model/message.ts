
export default interface Message {
  readonly topic: string
  readonly moment: number
  readonly sender: string
  readonly category: string
  readonly content: string
}