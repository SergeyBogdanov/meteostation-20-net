using StorageViewer.Models;

namespace StorageViewer.Services;

public interface IHistoryService
{
    IAsyncEnumerable<DataBlockModel> GetHistoryInformation(DateTimeOffset from, DateTimeOffset to);
}
