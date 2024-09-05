
using System.Collections.Concurrent;
using System.Runtime.CompilerServices;

namespace StorageViewer.Services;

internal class InternalExchangeService : IInternalExchangeService
{
    private record class ListSubscription<TData>(Type TypeInUse, object SubscriptionToken) : IInternalExchangeService.Subscription<TData>(TypeInUse, SubscriptionToken)
    {
        private readonly ConcurrentQueue<TData> dataToExpose = new ConcurrentQueue<TData>();
        private readonly SemaphoreSlim dataReadySignal = new SemaphoreSlim(0, 1);

        public async override IAsyncEnumerable<TData> ReadAsync([EnumeratorCancellation] CancellationToken cancelToken)
        {
            while (!cancelToken.IsCancellationRequested)
            {
                try
                {
                    await dataReadySignal.WaitAsync(cancelToken);
                }
                catch(OperationCanceledException) {}
                while (!cancelToken.IsCancellationRequested && !dataToExpose.IsEmpty)
                {
                    if (dataToExpose.TryDequeue(out TData? item))
                    {
                        yield return item;
                    }
                }
            }
        }

        public void EnqueueData(TData item)
        {
            dataToExpose.Enqueue(item);
            dataReadySignal.Release();
        }
    }

    private readonly Dictionary<Type, List<object>> subscriptions = [];
    private readonly ILogger<InternalExchangeService> _logger;

    public InternalExchangeService(ILogger<InternalExchangeService> logger)
    {
        _logger = logger;
    }

    public void Publish<TData>(TData data)
    {
        if (data != null && subscriptions.TryGetValue(typeof(TData), out List<object>? handlers))
        {
            foreach(ListSubscription<TData> handler in handlers)
            {
                handler.EnqueueData(data);
            }
        }
    }

    public IInternalExchangeService.Subscription<TData> Subscribe<TData>(Action<TData> dataConsuner)
    {
        var handler = new ListSubscription<TData>(typeof(TData), dataConsuner);
        EnsureHandlerList(typeof(TData)).Add(handler);
        return handler;
    }

    public void Unsubscribe<TData>(IInternalExchangeService.Subscription<TData> token)
    {
        if (subscriptions.TryGetValue(token.TypeInUse, out List<object>? handlers))
        {
            handlers.RemoveAll(handler => handler == (object)token);
        }
    }

    private List<object> EnsureHandlerList(Type type)
    {
        if (!subscriptions.TryGetValue(type, out List<object>? handlers))
        {
            handlers = [];
            subscriptions[type] = handlers;
        }
        return handlers;
    }
}