
export default interface Message {
  readonly topic: string
  readonly sender: string
  readonly moment: string
  readonly content: string
}