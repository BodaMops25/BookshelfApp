using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


public interface IHasId
{
  string Id {get;init;}
}

// USERS

public record UserCredentials(string Login, string Password);

public record UserFieldsToUpdate
{
  public string? Login {get;init;}
  public string? Password {get;init;}
  public List<string>? BookIds {get;init;}
  public List<string>? QuoteIds {get;init;}
};

public record User : IHasId
{
  public User(string login, string password)
  {
    Login = login;
    Password = password;
  }

  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]

  public string Id {get;init;} = "";
  public DateTime CreatingDate {get;init;} = DateTime.UtcNow;
  public string Login {get; set;}
  public string Password {get; set;}
  public List<string> BookIds {get;set;} = new();
  public List<string> QuoteIds {get;set;} = new();
}

// BOOKS

public record BookFieldsToCreate(string Title, string Author, DateTime ReleaseDate)
{
  public uint? Pages {get;init;}
  public string? Genres {get;init;}
  public sbyte? Rating {get;init;}
};
public record BookFieldToUpdate
{
  public string? Title {get;init;}
  public string? Author {get;init;}
  public DateTime? ReleaseDate {get;init;}
  public uint? Pages {get;init;}
  public string? Genres {get;init;}
  public sbyte? Rating {get;init;}
};
public record Book : IHasId
{
  public Book(string title, string author, DateTime releaseDate)
  {
    Title = title;
    Author = author;
    ReleaseDate = releaseDate;
  }

  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]

  public string Id {get;init;} = "";
  public DateTime CreatingDate {get;init;} = DateTime.UtcNow;
  public string? OwnerId {get;init;}
  public string Title {get; set;}
  public string Author {get; set;}
  public DateTime ReleaseDate {get; set;}
  public uint? Pages {get; set;}
  public string? Genres {get; set;}
  public sbyte? Rating {get; set;}
}

// QUOTES

public record QuoteFieldToCreate(string Text)
{
  public string? Title {get;init;}
  public string? Author {get;init;}
  public string? BookTitle {get;init;}
};
public record QuoteFieldToUpdate
{
  public string? BookTitle {get;init;}
  public string? Title {get;init;}
  public string? Author {get;init;}
  public string? Text {get;init;}
}
public record Quote : IHasId
{
  public Quote(string text)
  {
    Text = text;
  }

  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]

  public string Id {get;init;} = "";
  public DateTime CreatingDate {get;init;} = DateTime.UtcNow;
  public string? OwnerId {get;init;}
  public string? BookTitle {get;init;}
  public string? Title {get; set;}
  public string? Author {get; set;}
  public string Text {get; set;}
}