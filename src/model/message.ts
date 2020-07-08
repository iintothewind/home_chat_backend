
export default interface Message {
  readonly topic: string
  readonly moment: string
  readonly sender: string
  readonly category: string
  readonly content: string
}