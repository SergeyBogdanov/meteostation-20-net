using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;

namespace StorageViewer.Controllers;

public class DuplexTransportController : ControllerBase
{
    [Route("wsTransport")]
    public async Task AcceptConnect()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            for(int i = 0; i < 20; i++) {
                //await Echo(webSocket);
                await webSocket.SendAsync(new ArraySegment<byte>($$"""{ "message": "Test message #{{i}}" }""".Select(c => (byte)c).ToArray()), WebSocketMessageType.Text, true, CancellationToken.None);
                await Task.Delay(10 * 1000);
            }
            await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Bye", CancellationToken.None);
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }
}
