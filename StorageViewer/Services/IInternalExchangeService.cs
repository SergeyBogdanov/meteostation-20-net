using System.Runtime.CompilerServices;

namespace StorageViewer.Services;

public interface IInternalExchangeService
{
    public abstract class Subscription<TData>
    {
        public abstract IAsyncEnumerable<TData> ReadAsync(CancellationToken cancelToken);
    }

    void Publish<TData>(TData data);

    Subscription<TData> Subscribe<TData>();

    void Unsubscribe<TData>(Subscription<TData> subscription);
}