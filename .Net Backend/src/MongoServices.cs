using MongoDB.Driver;

public abstract class MongoService<T> where T : IHasId
{
  protected readonly IMongoCollection<T> _collection;

  public MongoService(IConfiguration config, string collectionName)
  {
      MongoClient client = new MongoClient(config["Mongo:ConnectionString"]);
      IMongoDatabase database = client.GetDatabase(config["Mongo:Database"]);
      _collection = database.GetCollection<T>(collectionName);
  }

  public async Task<T> CreateOne(T item)
  {
    await _collection.InsertOneAsync(item);
    return item;
  }
  public async Task<List<T>> GetAll() => await _collection.Find(_ => true).ToListAsync();
  public async Task<T> GetOneById(string id) => await _collection.Find(user => user.Id == id).FirstOrDefaultAsync();
  public async Task<T> DeleteOne(string userId) => await _collection.FindOneAndDeleteAsync(user => user.Id == userId);
}



public class MongoUsersService : MongoService<User>
{
  public MongoUsersService(IConfiguration config)
    : base(config, "Users") {}

  public async Task<User> GetOneByCredentials(UserCredentials credentials)
  {
    return await _collection.Find(user => 
      user.Login == credentials.Login && 
      user.Password == credentials.Password
    ).FirstOrDefaultAsync();
  }
  public async Task<User?> UpdateOne(string userId, UserFieldsToUpdate fields)
  {
      var updates = new List<UpdateDefinition<User>>();

      if(fields.Login != null) updates.Add(Builders<User>.Update.Set(user => user.Login, fields.Login));
      if(fields.Password != null) updates.Add(Builders<User>.Update.Set(user => user.Password, fields.Password));
      if(fields.BookIds != null) updates.Add(Builders<User>.Update.Set(user => user.BookIds, fields.BookIds));
      if(fields.QuoteIds != null) updates.Add(Builders<User>.Update.Set(user => user.QuoteIds, fields.QuoteIds));

      if(updates.Count == 0) return null;

      var update = Builders<User>.Update.Combine(updates);
      await _collection.FindOneAndUpdateAsync(user => user.Id == userId, update);

      return await this.GetOneById(userId);
  }
}



public class MongoBooksService : MongoService<Book>
{
  public MongoBooksService(IConfiguration config)
    : base(config, "Books") {}

  
  public async Task<Book?> UpdateOne(string bookId, BookFieldToUpdate fields)
  {
    var updates = new List<UpdateDefinition<Book>>();

    if(fields.Title != null) updates.Add(Builders<Book>.Update.Set(book => book.Title, fields.Title));
    if(fields.Author != null) updates.Add(Builders<Book>.Update.Set(book => book.Author, fields.Author));
    if(fields.ReleaseDate != null) updates.Add(Builders<Book>.Update.Set(book => book.ReleaseDate, fields.ReleaseDate));
    if(fields.Pages != null) updates.Add(Builders<Book>.Update.Set(book => book.Pages, fields.Pages));
    if(fields.Genres != null) updates.Add(Builders<Book>.Update.Set(book => book.Genres, fields.Genres));
    if(fields.Rating != null) updates.Add(Builders<Book>.Update.Set(book => book.Rating, fields.Rating));

    if(updates.Count == 0) return null;

    var update = Builders<Book>.Update.Combine(updates);
    await _collection.FindOneAndUpdateAsync(book => book.Id == bookId, update);

    return await this.GetOneById(bookId);
  }
}



public class MongoQuotesService : MongoService<Quote>
{
  public MongoQuotesService(IConfiguration config)
    : base(config, "Quotes") {}

  public async Task<Quote?> UpdateOne(string quoteId, QuoteFieldToUpdate fields)
  {
      var updates = new List<UpdateDefinition<Quote>>();

      if(fields.BookTitle != null) updates.Add(Builders<Quote>.Update.Set(quote => quote.BookTitle, fields.BookTitle));
      if(fields.Title != null) updates.Add(Builders<Quote>.Update.Set(quote => quote.Title, fields.Title));
      if(fields.Author != null) updates.Add(Builders<Quote>.Update.Set(quote => quote.Author, fields.Author));
      if(fields.Text != null) updates.Add(Builders<Quote>.Update.Set(quote => quote.Text, fields.Text));
      if(fields.Liked != null) updates.Add(Builders<Quote>.Update.Set(quote => quote.Liked, fields.Liked));
      
      if(updates.Count == 0) return null;

      var update = Builders<Quote>.Update.Combine(updates);
      await _collection.FindOneAndUpdateAsync(quote => quote.Id == quoteId, update);

      return await this.GetOneById(quoteId);
  }
}