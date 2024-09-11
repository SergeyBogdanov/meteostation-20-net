using StorageViewer.Configuration;
using StorageViewer.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//builder.Services.AddControllersWithViews();
builder.Services.AddControllers();

builder.Services.AddDependencies();

builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "wwwroot/client-app/browser";
});

builder.Services.AddHostedService<ExternalListenerService>();

builder.Configuration.AddEnvironmentVariables("MeteoSettings_");

var app = builder.Build();
ILogger? logger = app.Services.GetService<ILogger<Program>>();

logger?.LogInformation("Inner logging is started.");

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

//app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSpaStaticFiles();
app.UseWebSockets();

app.MapControllers();

app.UseRouting();

//app.UseAuthorization();

// app.MapControllerRoute(
//     name: "default",
//     pattern: "api/{controller=Home}/{action=Index}/{id?}");

app.UseEndpoints(routeBuilder => routeBuilder.MapDefaultControllerRoute());
//app.MapControllers();

app.UseSpa(spaBuilder => {
    spaBuilder.Options.SourcePath = Path.Combine(builder.Environment.ContentRootPath, "client-app/browser");
    //spaBuilder.UseAngularCliServer("start");
    if (app.Environment.IsDevelopment())
    {
        spaBuilder.UseProxyToSpaDevelopmentServer("http://localhost:4200");
    }
});

app.Run();
