using System.Runtime.CompilerServices;

namespace StorageViewer.Services;

public interface IInternalExchangeService
{
    public abstract record class Subscription<TData>(Type TypeInUse, object SubscriptionToken)
    {
        public abstract IAsyncEnumerable<TData> ReadAsync([EnumeratorCancellation] CancellationToken cancelToken);
    }

    void Publish<TData>(TData data);

    Subscription<TData> Subscribe<TData>(Action<TData> dataConsuner);

    void Unsubscribe<TData>(Subscription<TData> subscription);
}