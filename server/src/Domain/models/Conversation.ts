export class Conversation {
  public constructor(
    public id: number = 0,
    public user1_id: number = 0,
    public user2_id: number = 0,
    public last_message?: Date
  ) {}
}
