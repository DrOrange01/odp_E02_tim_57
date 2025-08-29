export class Message {
  public constructor(
    public id: number = 0,
    public conversation_id: number = 0,
    public sender_id: number = 0,
    public receiver_id: number = 0,
    public content: string = "",
    public timestamp: Date = new Date(),
    public is_read: boolean = false
  ) {}
}
