using StorageViewer.Models;

namespace StorageViewer.Services;

public interface IHistoryService
{
    IEnumerable<DataBlockModel> GetHistoryInformation(DateTimeOffset from, DateTimeOffset to);
}
