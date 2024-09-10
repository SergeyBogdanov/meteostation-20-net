using StorageViewer.Configuration;
using StorageViewer.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//builder.Services.AddControllersWithViews();
builder.Services.AddControllers();

builder.Services.AddDependencies();

builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "ClientApp/dist";
});

builder.Services.AddHostedService<ExternalListenerService>();

builder.Configuration.AddEnvironmentVariables("MeteoSettings_");

var app = builder.Build();

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
    spaBuilder.Options.SourcePath = Path.Combine(builder.Environment.ContentRootPath, "ClientApp");
    //spaBuilder.UseAngularCliServer("start");
    spaBuilder.UseProxyToSpaDevelopmentServer("http://localhost:4200");
});

app.Run();
