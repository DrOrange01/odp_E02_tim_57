export class UserDto {
  public constructor(
    public id: number = 0,
    public korisnickoIme: string = "",
    public uloga: string = "user",
    public first_name: string = "",
    public last_name: string = "",
    public phone_number: string = "",
    public profile_pic: string = ""
  ) {}
}
