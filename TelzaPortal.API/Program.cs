using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TelzaProject.Application;
using TelzaProject.Identity;
using TelzaProject.Infrastructure;
using TelzaProject.Persistence;

var builder = WebApplication.CreateBuilder(args);

// ─── Layer Services ─────────────────────────────────────────────────────────
builder.Services.AddApplicationServices();
builder.Services.AddPersistenceServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddInfrastructureServices();

// ─── Controllers ─────────────────────────────────────────────────────────────
builder.Services.AddControllers();

// ─── Swagger / OpenAPI ───────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Telza Portal API",
        Version = "v1",
        Description = "Invoice Portal REST API"
    });

    // JWT Bearer Security
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token. Example: Bearer {token}"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// ─── CORS (allow admin portal + KYC public form from any localhost/127.0.0.1) ──
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("CorsPolicy", policy =>
//        policy.SetIsOriginAllowed(origin =>
//        {
//            var uri = new Uri(origin);
//            return uri.Host == "127.0.0.1" || uri.Host == "localhost";
//        })
//              .AllowAnyMethod()
//              .AllowAnyHeader()
//              .AllowCredentials());
//});
// ─── CORS (allow admin portal + KYC public form from any localhost/127.0.0.1) ──
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
        policy.SetIsOriginAllowed(origin =>
        {
            var uri = new Uri(origin);
            return uri.Host == "127.0.0.1" || uri.Host == "localhost" || uri.Host == "admin.telza.co" || uri.Host == "kyc.telza.co";
        })
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

var app = builder.Build();

// ─── Middleware Pipeline ──────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Telza Portal API v1"));
}

app.UseCors("CorsPolicy");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ─── Apply EF migrations (adds e.g. KycApplications.OnboardingExtensionsJson if pending) ──
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TelzaPortalDbContext>();
    await db.Database.MigrateAsync();
}

// ─── Seed Database ────────────────────────────────────────────────────────────
await TelzaProject.Identity.UserSeeder.SeedAdminUser(app.Services);

app.Run();
