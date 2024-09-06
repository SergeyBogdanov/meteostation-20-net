
using System.Collections.Concurrent;
using System.Runtime.CompilerServices;
using StorageViewer.Utils;

namespace StorageViewer.Services;

internal class InternalExchangeService : IInternalExchangeService
{
    private class ListSubscription<TData>: IInternalExchangeService.Subscription<TData>
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

                Queue<TData> dataLocalCopy = new Queue<TData>(ExtractData());
                while (!cancelToken.IsCancellationRequested && dataLocalCopy.Count > 0)
                {
                    yield return dataLocalCopy.Dequeue();
                }
            }
        }

        public void EnqueueData(TData item)
        {
            dataToExpose.Enqueue(item);
            dataReadySignal.Release();
        }

        private IEnumerable<TData> ExtractData()
        {
            while(!dataToExpose.IsEmpty)
            {
                if (dataToExpose.TryDequeue(out TData? item))
                {
                    yield return item;
                }
            }
        }
    }

    private readonly Dictionary<Type, List<object>> subscriptions = [];
    private readonly Dictionary<Type, object> recentData = [];
    private readonly ILogger<InternalExchangeService> _logger;
    private readonly DisposibleLock subscriptionsLock = new();

    public InternalExchangeService(ILogger<InternalExchangeService> logger)
    {
        _logger = logger;
    }

    public void Publish<TData>(TData data)
    {
        if (data != null)
        {
            using var lockKey = subscriptionsLock.EnterReadLock();
            recentData[typeof(TData)] = data;
            if (subscriptions.TryGetValue(typeof(TData), out List<object>? handlers))
            {
                foreach(var handler in handlers.Cast<ListSubscription<TData>>())
                {
                    handler.EnqueueData(data);
                }
            }
        }
    }

    public IInternalExchangeService.Subscription<TData> Subscribe<TData>()
    {
        using var lockKey = subscriptionsLock.EnterWriteLock();
        var handler = new ListSubscription<TData>();
        EnsureHandlerList(typeof(TData)).Add(handler);
        TrySendRecentData(handler);
        return handler;
    }

    public void Unsubscribe<TData>(IInternalExchangeService.Subscription<TData> token)
    {
        using var lockKey = subscriptionsLock.EnterWriteLock();
        if (subscriptions.TryGetValue(typeof(TData), out List<object>? handlers))
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

    private void TrySendRecentData<TData>(ListSubscription<TData> handler)
    {
        if (recentData.TryGetValue(typeof(TData), out object? data))
        {
            handler.EnqueueData((TData)data);
        }
    }
}