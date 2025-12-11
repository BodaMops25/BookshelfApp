using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var jwtSettings = builder.Configuration.GetSection("Jwt");

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowAll", policy =>
  {
    policy
      .AllowAnyOrigin()
      .AllowAnyMethod()
      .AllowAnyHeader();
  });
});

builder.Services.AddSingleton<MongoUsersService>();
builder.Services.AddSingleton<MongoBooksService>();
builder.Services.AddSingleton<MongoQuotesService>();

builder.Services
    .AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Key"]!)
            )
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

// middleware for prevent to throw internal errors to client
app.Use(async (context, next) =>
{
  try
  {
    await next(context);
  } 
  catch(Exception error)
  {
    context.Response.StatusCode = StatusCodes.Status500InternalServerError;

    Console.Write("ERROR!!!!! ");
    Console.WriteLine(DateTime.UtcNow);
    Console.WriteLine(error);
  }
});



app.MapGet("/", async () => Results.Ok("Server running fine"));

app.MapGet("/api/users", async (MongoUsersService service) => Results.Ok(await service.GetAll()));

app.MapPost("/api/user/login", async (MongoUsersService service, [FromBody] UserCredentials credentials) =>
{
  User user = await service.GetOneByCredentials(credentials);
  if (user == null) return Results.NotFound();

  var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
  var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
  var TokenExpiringHours = 1;

  var jwtTokenExpiringHours = jwtSettings["TokenExpiringHours"];
  if(jwtTokenExpiringHours != null) TokenExpiringHours = int.Parse(jwtTokenExpiringHours);

  var token = new JwtSecurityToken(
      issuer: jwtSettings["Issuer"],
      audience: jwtSettings["Audience"],
      claims: [new Claim("userId", user.Id)],
      expires: DateTime.UtcNow.AddHours(TokenExpiringHours),
      signingCredentials: creds
  );

  string jwt = new JwtSecurityTokenHandler().WriteToken(token);

  return Results.Ok(jwt);
});

app.MapPost("/api/user", async (MongoUsersService service, [FromBody] UserCredentials credentials) =>
{

  if((await service.GetOneByCredentials(credentials)) != null) return Results.BadRequest();

  return Results.Ok(
    await service.CreateOne(new User(credentials.Login, credentials.Password))
  );
});

app.MapGet("/api/user", async (MongoUsersService service, ClaimsPrincipal userClaims) =>
{
  string? userId = userClaims.FindFirst("userId")?.Value;
  if(userId == null) return Results.InternalServerError();

  User user = await service.GetOneById(userId);
  return Results.Ok(user);
}).RequireAuthorization();

app.MapPut("/api/user", async (MongoUsersService service, ClaimsPrincipal userClaims, [FromBody] UserFieldsToUpdate userFields) =>
{
  string? userId = userClaims.FindFirst("userId")?.Value;
  if(userId == null) return Results.InternalServerError();

  User user = await service.GetOneById(userId);

  return Results.Ok(
    await service.UpdateOne(userId, userFields)
  );
}).RequireAuthorization();

app.MapDelete("/api/user", async (MongoUsersService service,  ClaimsPrincipal userClaims) =>
{
  string? userId = userClaims.FindFirst("userId")?.Value;
  if(userId == null) return Results.InternalServerError();

  User user = await service.GetOneById(userId);

  return Results.Ok(
    await service.DeleteOne(userId)
  );
}).RequireAuthorization();



app.MapPost("/api/book", async (MongoUsersService usersService, MongoBooksService booksService, ClaimsPrincipal userClaims, [FromBody] BookFieldsToCreate bookFields) =>
{
  string? userId = userClaims.FindFirst("userId")?.Value;
  if(userId == null) return Results.InternalServerError();
  User user = await usersService.GetOneById(userId);

  Book book = new Book(bookFields.Title, bookFields.Author, bookFields.ReleaseDate)
  {
    OwnerId = user.Id,
    Pages = bookFields.Pages,
    Genres = bookFields.Genres,
    Rating = bookFields.Rating
  };
  Book bookFromDb = await booksService.CreateOne(book);

  user.BookIds.Add(book.Id);
  UserFieldsToUpdate fields = new UserFieldsToUpdate{ BookIds = user.BookIds };

  await usersService.UpdateOne(user.Id, fields);

  return Results.Ok(bookFromDb);
}).RequireAuthorization();

app.MapGet("/api/books", async (MongoBooksService service) => Results.Ok(await service.GetAll()));

app.MapGet("/api/book/{bookId}", async (MongoBooksService service, string bookId) => Results.Ok(await service.GetOneById(bookId)));

app.MapGet("/api/user/books", async (MongoUsersService usersService, MongoBooksService booksService, ClaimsPrincipal userClaims) =>
{
  string? userId = userClaims.FindFirst("userId")?.Value;
  if(userId == null) return Results.InternalServerError();

  User user = await usersService.GetOneById(userId);

  List<Book> books = new List<Book>();

  foreach(string bookId in user.BookIds)
  {
    Book book = await booksService.GetOneById(bookId);
    if(book != null) books.Add(book);
  }

  return Results.Ok(books);
}).RequireAuthorization();

app.MapPut("/api/book/{bookId}", async (MongoBooksService booksService, ClaimsPrincipal userClaims, [FromBody] BookFieldToUpdate bookFieldUpdates, string bookId) =>
{
  string? userId = userClaims.FindFirst("userId")?.Value;
  if(userId == null) return Results.InternalServerError();

  Book book = await booksService.GetOneById(bookId);

  if(book.OwnerId != userId) return Results.Unauthorized();

  return Results.Ok(
    await booksService.UpdateOne(bookId, bookFieldUpdates)
  );
}).RequireAuthorization();

app.MapDelete("/api/book/{bookId}", async (MongoBooksService booksService, ClaimsPrincipal userClaims, string bookId) =>
{
  string? userId = userClaims.FindFirst("userId")?.Value;
  if(userId == null) return Results.InternalServerError();

  Book book = await booksService.GetOneById(bookId);
  if(book.OwnerId != userId) return Results.Unauthorized();

  return Results.Ok(
    await booksService.DeleteOne(bookId)
  );
}).RequireAuthorization();



app.MapPost("/api/quote", async (MongoUsersService usersService, MongoQuotesService quotesService, ClaimsPrincipal userClaims, [FromBody] QuoteFieldToCreate quoteFields) =>
{
  string? userId = userClaims.FindFirst("userId")?.Value;
  if(userId == null) return Results.InternalServerError();
  User user = await usersService.GetOneById(userId);

  Quote quote = new Quote(quoteFields.Text)
  {
    OwnerId = user.Id,
    Title = quoteFields.Title,
    Author = quoteFields.Author,
    BookTitle = quoteFields.BookTitle,
    Liked = quoteFields.Liked
  };

  Quote quoteFromDb = await quotesService.CreateOne(quote);

  if(user.QuoteIds == null) user.QuoteIds = new List<string>();

  user.QuoteIds.Add(quote.Id);
  UserFieldsToUpdate fields = new UserFieldsToUpdate{ QuoteIds = user.QuoteIds };

  await usersService.UpdateOne(user.Id, fields);

  return Results.Ok(quoteFromDb);
}).RequireAuthorization();

app.MapGet("/api/quotes", async (MongoQuotesService service) => Results.Ok(await service.GetAll()));

app.MapGet("/api/quote/{quoteId}", async (MongoQuotesService service, string quoteId) => Results.Ok(await service.GetOneById(quoteId)));

app.MapGet("/api/user/quotes", async (MongoUsersService usersService, MongoQuotesService quotesService, ClaimsPrincipal userClaims) =>
{
  string? userId = userClaims.FindFirst("userId")?.Value;
  if(userId == null) return Results.InternalServerError();

  User user = await usersService.GetOneById(userId);

  List<Quote> quotes = new List<Quote>();

  foreach(string quoteId in user.QuoteIds)
  {
    Quote quote = await quotesService.GetOneById(quoteId);
    if(quote != null) quotes.Add(quote);
  }

  return Results.Ok(quotes);
}).RequireAuthorization();

app.MapPut("/api/quote/{quoteId}", async (MongoQuotesService quotesService, ClaimsPrincipal userClaims, [FromBody] QuoteFieldToUpdate quoteFieldToUpdate, string quoteId) =>
{
  string? userId = userClaims.FindFirst("userId")?.Value;
  if(userId == null) return Results.InternalServerError();

  Quote quote = await quotesService.GetOneById(quoteId);

  if(quote.OwnerId != userId) return Results.Unauthorized();

  return Results.Ok(
    await quotesService.UpdateOne(quoteId, quoteFieldToUpdate)
  );
}).RequireAuthorization();

app.MapDelete("/api/quote/{quoteId}", async (MongoQuotesService quotesService, ClaimsPrincipal userClaims, string quoteId) =>
{
  string? userId = userClaims.FindFirst("userId")?.Value;
  if(userId == null) return Results.InternalServerError();

  Quote quote = await quotesService.GetOneById(quoteId);
  if(quote.OwnerId != userId) return Results.Unauthorized();

  return Results.Ok(
    await quotesService.DeleteOne(quoteId)
  );
}).RequireAuthorization();



app.Run();