using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using SkyINNOtm.Data;

var builder = WebApplication.CreateBuilder(args);
// Add this line in your Program.cs where you register other services
builder.Services.AddHttpClient();

// Or register it with your other services
builder.Services.AddScoped<AppDbContext>();
builder.Services.AddHttpClient();
// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add Entity Framework
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
//Defining Cors policy correctly
builder.Services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
{
    builder.WithOrigins(
    "http://localhost:4200",
    "http://localhost:4202",
    "http://localhost:8100",
    "http://localhost:8400"
    )
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader();
}));

// Learn more about configuring Swagger/OpenAPI at
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SkyINNOtm API",
        Version = "v1",
        Description = "A simple example ASP.NET Core Web API"
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "innotm v1"));
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();