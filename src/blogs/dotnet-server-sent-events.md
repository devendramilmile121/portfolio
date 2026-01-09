---
title: ".NET 10 Server-Sent Events: Real-Time Updates Made Easy"
date: "2026-01-09"
summary: "Learn how to build real-time applications with .NET 10's new Server-Sent Events API. Stream live stock market data to your clients using a simple, efficient approach that's perfect for dashboards, notifications, and live updates."
tags: [".NET", "ASP.NET Core", "Real-Time", "Server-Sent Events", "Web Development", "Stock Market"]
---

# .NET 10 Server-Sent Events: Real-Time Updates Made Easy

Ever wondered how those slick live dashboards update without refreshing the page? Or how notification feeds just magically appear? That's real-time communication at work. And with .NET 10, Microsoft just made it super easy to build these features with Server-Sent Events (SSE).

Let's be real - WebSockets have been the go-to solution for years, but they're often overkill. You don't always need that two-way communication. Sometimes you just want the server to push updates to the client, and that's exactly what Server-Sent Events do best. Think of it like subscribing to a news feed - you sit back and the updates come to you.

## What Are Server-Sent Events?

Here's the cool part: Server-Sent Events let your server push data to the browser over a single HTTP connection. No polling, no constant requests - just a persistent connection where the server sends updates whenever it wants.

Picture this: your server is like a DJ at a radio station, and your client is tuned in. The DJ (server) keeps streaming music (data), and you (client) just listen. You don't need to call the DJ every 5 seconds asking "got anything new?" - they'll broadcast it when they're ready.

In .NET 10, these event messages are represented as `SseItem<T>` objects. Each item can have:
- An **event type** (like "heartRate", "notification", "price-update")
- An **ID** (for tracking which events you've received)
- A **data payload** (whatever you want to send - JSON, strings, objects)

## Prerequisites

To follow along, you'll need:
- **.NET 10 SDK** or higher
- Basic understanding of ASP.NET Core
- Your favorite code editor (VS Code, Visual Studio, Rider - whatever floats your boat)

## Why Use Server-Sent Events?

**✅ Perfect for:**
- Live dashboards and monitoring
- Real-time notifications
- Stock tickers and price updates
- Social media feeds
- Progress updates for long-running tasks
- Live sports scores

**❌ Not the right fit for:**
- Two-way chat applications (use WebSockets)
- Binary data streaming
- Situations needing bidirectional communication
- IE11 support (yeah, it's finally time to let go)

## Building a Real-Time Stock Price Ticker

Let's build something practical - a stock price ticker that streams live market data to the browser. This is the kind of thing you'd see in a trading platform or financial dashboard.

> 💻 **[Complete Working Example on GitHub](https://github.com/devendramilmile121/server-sent-events)** - Clone and run the full application with all the code from this tutorial!

### Step 1: Set Up Your ASP.NET Core Project

First, create a new project:

```bash
dotnet new web -n StockPriceTicker
cd StockPriceTicker
```

### Step 2: Create Your Minimal API Endpoint

Open `Program.cs` and let's build our first SSE endpoint. We'll start with a simple stock price stream:

```csharp
using System.Runtime.CompilerServices;

var builder = WebApplication.CreateBuilder(args);

// Add services if needed
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors();

// Simple string-based stock price stream
app.MapGet("/stocks/simple", (CancellationToken cancellationToken) =>
{
    async IAsyncEnumerable<string> GetStockPrice(
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var basePrice = 150.0m;
        while (!cancellationToken.IsCancellationRequested)
        {
            var change = (decimal)(Random.Shared.NextDouble() * 4 - 2);
            basePrice += change;
            yield return $"AAPL: ${basePrice:F2}";
            await Task.Delay(2000, cancellationToken);
        }
    }

    return TypedResults.ServerSentEvents(GetStockPrice(cancellationToken));
});

app.Run();
```

That's it! You've got a working SSE endpoint. Pretty straightforward, right?

### Step 3: Level Up with Typed Data

Sending strings is cool, but let's get fancy with proper typed objects:

```csharp
// Define your stock quote record
public record StockQuote(
    string Symbol,
    decimal Price,
    decimal Change,
    decimal ChangePercent,
    long Volume,
    DateTime Timestamp,
    string Trend)
{
    public static StockQuote Create(string symbol, decimal currentPrice, decimal previousPrice)
    {
        var change = currentPrice - previousPrice;
        var changePercent = (change / previousPrice) * 100;
        var trend = change switch
        {
            > 0 => "Up",
            < 0 => "Down",
            _ => "Neutral"
        };

        return new StockQuote(
            symbol,
            currentPrice,
            change,
            changePercent,
            Random.Shared.NextInt64(1000000, 10000000),
            DateTime.UtcNow,
            trend
        );
    }
}

// Add this endpoint to your Program.cs
app.MapGet("/stocks/json", (string symbol = "AAPL", CancellationToken cancellationToken = default) =>
{
    async IAsyncEnumerable<StockQuote> GetStockPrices(
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var currentPrice = 150.0m;
        
        while (!cancellationToken.IsCancellationRequested)
        {
            var previousPrice = currentPrice;
            var change = (decimal)(Random.Shared.NextDouble() * 4 - 2);
            currentPrice += change;
            
            yield return StockQuote.Create(symbol, currentPrice, previousPrice);
            await Task.Delay(2000, cancellationToken);
        }
    }

    return TypedResults.ServerSentEvents(
        GetStockPrices(cancellationToken),
        eventType: "stockPrice"
    );
});
```

See that `eventType: "stockPrice"` parameter? That's super handy on the client side for filtering different types of events.

### Step 4: Test Your API Endpoint

Fire it up:

```bash
dotnet run
```

Now you can test your SSE endpoint in several ways:

**Using a Browser:**
Simply navigate to `https://localhost:5001/stocks/json?symbol=AAPL` in your browser. You'll see the raw SSE stream with events coming in every 2 seconds.

**Using curl:**
```bash
curl -N https://localhost:5001/stocks/json?symbol=AAPL
```

The `-N` flag disables buffering so you see events as they arrive.

**Using JavaScript EventSource:**
Open your browser's console and run:
```javascript
const eventSource = new EventSource('https://localhost:5001/stocks/json?symbol=AAPL');
eventSource.addEventListener('stockPrice', (event) => {
    console.log('Stock update:', JSON.parse(event.data));
});
```

You'll see stock price data streaming in real-time!

## Advanced Scenarios

### Multiple Event Types

You can stream different types of events on the same connection:

```csharp
app.MapGet("/market/stream", (CancellationToken cancellationToken) =>
{
    async IAsyncEnumerable<SseItem<object>> GetMarketData(
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var stocks = new Dictionary<string, decimal>
        {
            ["AAPL"] = 150.0m,
            ["GOOGL"] = 140.0m,
            ["MSFT"] = 380.0m
        };

        while (!cancellationToken.IsCancellationRequested)
        {
            foreach (var stock in stocks.Keys.ToList())
            {
                var previousPrice = stocks[stock];
                var change = (decimal)(Random.Shared.NextDouble() * 4 - 2);
                stocks[stock] += change;

                yield return new SseItem<object>(
                    StockQuote.Create(stock, stocks[stock], previousPrice),
                    "stockPrice"
                );

                await Task.Delay(1000, cancellationToken);
            }

            // Send market summary
            yield return new SseItem<object>(
                new { 
                    TotalVolume = Random.Shared.NextInt64(50000000, 100000000),
                    ActiveTraders = Random.Shared.Next(10000, 50000),
                    Timestamp = DateTime.UtcNow
                },
                "marketSummary"
            );

            await Task.Delay(5000, cancellationToken);
        }
    }

    return TypedResults.ServerSentEvents(GetMarketData(cancellationToken));
});
```

On the client side, listen for specific event types:

```javascript
eventSource.addEventListener('stockPrice', (event) => {
    const data = JSON.parse(event.data);
    console.log('Stock update:', data);
});

eventSource.addEventListener('marketSummary', (event) => {
    const data = JSON.parse(event.data);
    console.log('Market summary:', data);
});
```

### Event IDs for Reliability

SSE supports event IDs, which help with reconnection. If your client disconnects, it can tell the server which was the last event it received:

```csharp
app.MapGet("/notifications", (CancellationToken cancellationToken, int? lastEventId) =>
{
    async IAsyncEnumerable<SseItem<Notification>> GetNotifications(
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        int currentId = lastEventId ?? 0;

        while (!cancellationToken.IsCancellationRequested)
        {
            currentId++;
            var notification = await GetNextNotification();
            
            yield return new SseItem<Notification>(notification, "notification")
            {
                Id = currentId.ToString()
            };

            await Task.Delay(5000, cancellationToken);
        }
    }

    return TypedResults.ServerSentEvents(GetNotifications(cancellationToken));
});
```

The browser automatically sends the `Last-Event-ID` header when reconnecting!

### Using Controllers Instead of Minimal APIs

Prefer controllers? No problem:

```csharp
[ApiController]
[Route("api/[controller]")]
public class StreamController : ControllerBase
{
    [HttpGet("stocks/{symbol}")]
    public IResult StreamStockPrice(string symbol, CancellationToken cancellationToken)
    {
        async IAsyncEnumerable<StockQuote> GetStockPrice(
            [EnumeratorCancellation] CancellationToken cancellationToken)
        {
            var currentPrice = 150.0m;
            
            while (!cancellationToken.IsCancellationRequested)
            {
                var previousPrice = currentPrice;
                var change = (decimal)(Random.Shared.NextDouble() * 4 - 2);
                currentPrice += change;
                
                yield return StockQuote.Create(symbol, currentPrice, previousPrice);
                await Task.Delay(2000, cancellationToken);
            }
        }

        return TypedResults.ServerSentEvents(
            GetStockPrice(cancellationToken),
            eventType: "stockPrice"
        );
    }
}
```

## Key Concepts Explained

### How SSE Actually Works

When a client connects to your SSE endpoint:
1. The server keeps the HTTP connection open
2. It sends data in a special format that browsers understand
3. The connection stays alive until the client disconnects or the server closes it
4. If disconnected, the browser automatically tries to reconnect

The format looks like this over the wire:

```
data: {"symbol": "AAPL", "price": 152.45, "change": 1.23, "trend": "Up"}
event: stockPrice
id: 1

data: {"symbol": "AAPL", "price": 151.89, "change": -0.56, "trend": "Down"}
event: stockPrice
id: 2
```

### Cancellation Token Magic

Notice that `CancellationToken` parameter? That's how .NET knows when the client disconnects. When the browser closes the connection, the token gets cancelled, breaking out of your loop. Clean and automatic!

### IAsyncEnumerable - The Secret Sauce

Using `IAsyncEnumerable<T>` with `yield return` is what makes this so elegant. You're basically creating an async stream that .NET can consume at its own pace. No buffering headaches, no memory issues - just smooth streaming.

## Performance Tips

### 1. Set Reasonable Delays

Don't blast updates every millisecond. Most UIs can't even refresh that fast:

```csharp
await Task.Delay(1000, cancellationToken); // 1 second is often plenty
```

### 2. Batch Updates When Possible

Instead of sending 100 tiny events, send one event with an array:

```csharp
yield return new SseItem<StockQuote[]>(recentQuotes, "stockBatch");
```

### 3. Clean Up Resources

Always respect the cancellation token:

```csharp
while (!cancellationToken.IsCancellationRequested)
{
    // Your code
}
// Clean up any resources here
```

### 4. Consider Connection Limits

Browsers limit concurrent connections (usually 6 per domain). If you're opening multiple SSE connections, you might hit this limit.

## Comparison: SSE vs WebSockets vs Polling

| Feature | Server-Sent Events | WebSockets | HTTP Polling |
|---------|-------------------|------------|--------------|
| Direction | Server → Client | Bidirectional | Client ↔ Server |
| Protocol | HTTP | WebSocket | HTTP |
| Reconnection | Automatic | Manual | N/A |
| Browser Support | Modern browsers | All modern browsers | Universal |
| Complexity | Low | Medium | Low |
| Overhead | Low | Very Low | High |
| Best For | Live updates, feeds | Chat, gaming | Legacy support |

## Common Pitfalls (And How to Avoid Them)

### 1. Forgetting CORS

If you're calling from a different domain, don't forget CORS:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSSE", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

### 2. Not Handling Disconnections

Always assume the client might disconnect:

```csharp
eventSource.onerror = () => {
    console.log('Connection lost, will retry...');
};
```

### 3. Sending Too Much Data

Keep payloads small. If you're sending megabytes of data, you're doing it wrong.

### 4. Not Testing Network Issues

Test what happens when the network drops. Does your app recover gracefully?

## When to Choose SSE

**✅ Go with SSE when:**
- You only need server-to-client updates
- You're building dashboards, feeds, or notifications
- You want automatic reconnection
- You don't need to support ancient browsers
- You want something simpler than WebSockets

**🤔 Think twice when:**
- You need client-to-server communication (consider WebSockets)
- You're sending huge amounts of binary data
- You need to support IE11 (seriously, just don't)

## Real-World Use Cases

### Live Dashboard

Perfect for displaying real-time metrics:
- Server stats (CPU, memory, requests/sec)
- Sales numbers
- User activity
- Error rates

### Notification System

Stream notifications as they happen:
- New messages
- System alerts
- Task completions
- Friend requests

### Stock Ticker

Show live market data:
- Price updates
- Volume changes
- Breaking news
- Portfolio values

### Progress Tracking

Monitor long-running operations:
- File uploads
- Report generation
- Batch processing
- Build/deployment status

## Conclusion

Server-Sent Events in .NET 10 are a game-changer for building real-time features. They're simple, efficient, and perfect for when you just need the server to push updates to the client. No complicated protocols, no fancy infrastructure - just straightforward HTTP streaming that works.

The new `TypedResults.ServerSentEvents` API makes it dead simple to get started. Whether you're building a live dashboard, a notification system, or a real-time monitoring tool, SSE should definitely be on your radar.

Ready to make your apps more interactive? Give SSE a shot. Your users will love the instant updates, and you'll love how easy it is to implement.

## Resources

- [Complete Working Example on GitHub](https://github.com/devendramilmile121/server-sent-events) - Full source code from this tutorial
- [Server-Sent Events on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Minimal API SSE Sample](https://github.com/dotnet/aspnetcore/tree/main/src/Http/samples/MinimalApiSse)
- [Controller API SSE Sample](https://github.com/dotnet/aspnetcore/tree/main/src/Mvc/samples/ControllerApiSse)
- [ASP.NET Core Documentation](https://learn.microsoft.com/en-us/aspnet/core)
- [EventSource API Reference](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)

---

*Built something cool with Server-Sent Events? Drop a comment below and share your experience!*
