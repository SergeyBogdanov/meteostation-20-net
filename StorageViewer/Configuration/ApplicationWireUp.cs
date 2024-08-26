using StorageViewer.Services;

namespace StorageViewer.Configuration;

public static class ApplicationWireUp
{
    public static IServiceCollection AddDependencies(
            this IServiceCollection services) =>
        services.AddScoped<IHistoryService, HistoryService>();
}