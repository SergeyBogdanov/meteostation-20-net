using System.Net.WebSockets;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using StorageViewer.Models;
using StorageViewer.Services;

namespace StorageViewer.Controllers;

public class DuplexTransportController : ControllerBase
{
    private readonly IInternalExchangeService _exchangeService;
    private readonly ILogger<DuplexTransportController> _logger;

    public DuplexTransportController(IInternalExchangeService exchangeService, ILogger<DuplexTransportController> logger)
    {
        _exchangeService = exchangeService;
        _logger = logger;
    }

    [Route("wsTransport")]
    public async Task AcceptConnect()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            CancellationToken cancelToken = CancellationToken.None;
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            await SendToWebSocket(webSocket, """{ "msg": "Hello!Hello!Hello!Hello!Hello!Hello!Hello!Hello!Hello!Hello!" }""", cancelToken);
            var subscription = _exchangeService.Subscribe<DataBlockModel>(data => {});
            await foreach(DataBlockModel data in subscription.ReadAsync(cancelToken))
            {
                await SendToWebSocket(webSocket, JsonSerializer.Serialize(data), cancelToken);
            }
            _exchangeService.Unsubscribe(subscription);
            await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Bye", CancellationToken.None);
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }

    private async Task SendToWebSocket(WebSocket webSocket, string json, CancellationToken cancelToken)
    {
        Encoding transmitionEncoding = Encoding.UTF8;
        byte[] buffer = new byte[4096];
        int currentStart = 0;
        do
        {
            int transmissionLength = GetMaxConvertableLength(transmitionEncoding, json, currentStart, buffer.Length);
            if (transmissionLength > 0)
            {
                int transmittedBytesCount = transmitionEncoding.GetBytes(json, currentStart, transmissionLength, buffer, 0);
                currentStart += transmissionLength;
                await webSocket.SendAsync(new ArraySegment<byte>(buffer, 0, transmittedBytesCount), WebSocketMessageType.Text, currentStart >= json.Length, cancelToken);
            }
            else
            {
                break;
            }
        } while (currentStart < json.Length);
    }

    private int GetMaxConvertableLength(Encoding targetEncoding, string toConvert, int fromIndex, int byteArrayLength)
    {
        int currentLength = Math.Min(toConvert.Length - fromIndex, byteArrayLength);
        while(currentLength > 0)
        {
            int resultLength = targetEncoding.GetByteCount(toConvert, fromIndex, currentLength);
            if (resultLength <= byteArrayLength)
            {
                break;
            }
            else
            {
                currentLength -= resultLength - byteArrayLength;
            }
        }
        return currentLength;
    }
}
