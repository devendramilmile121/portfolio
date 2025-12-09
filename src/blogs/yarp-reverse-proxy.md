---
title: "YARP Reverse Proxy — What It Is, How to Use It, and When It Matters"
date: "2025-12-09"
summary: "YARP is a reverse proxy library for .NET that handles routing, load balancing, and request transformation. Learn how it works, see practical code examples, and understand what makes it useful and what to watch out for."
tags: ["YARP", "Reverse Proxy", "Load Balancing", ".NET", "API Gateway", "Microservices"]
---

# YARP Reverse Proxy — What It Is, How to Use It, and When It Matters

YARP stands for Yet Another Reverse Proxy. It's a reverse proxy library built on top of .NET that lets you route incoming requests to backend services, transform them, and send responses back to clients.

If you're building microservices, dealing with multiple backend servers, or need to modify requests and responses on the fly, YARP can help. But it's not magic, and it has trade-offs you should know about.

## What Is a Reverse Proxy?

A reverse proxy sits between your clients and your backend servers.

When a request comes in, the reverse proxy decides where to send it. It could go to one backend, many backends, or get modified before it goes anywhere.

This is different from a forward proxy, which sits between clients and the internet. A reverse proxy sits between the internet and your servers.

## Why Use YARP?

### Route requests to multiple backends

You have three API servers running on different ports. YARP can send requests to all three based on rules you define.

### Load balancing

Distribute traffic across servers so no single server gets crushed.

### Transform requests and responses

Modify headers, add authentication, change the request path, remove sensitive data from responses, and more.

### Authentication and authorization

Check tokens, validate permissions, and block bad requests before they hit your backend.

### Centralized place to manage these concerns

Instead of handling routing logic in each microservice, do it in one place.

## Basic Setup

First, create a new ASP.NET Core project and add YARP:

```bash
dotnet new web -n YarpProxy
cd YarpProxy
dotnet add package Yarp.ReverseProxy
```

Now configure it in your `Program.cs`:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add YARP services
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

app.MapReverseProxy();
app.Run();
```

Create an `appsettings.json` file with your routes and clusters:

```json
{
  "ReverseProxy": {
    "Routes": [
      {
        "RouteId": "api_route",
        "ClusterId": "api_cluster",
        "Match": {
          "Path": "/api/{**catch-all}"
        },
        "Transforms": [
          {
            "PathPattern": "/api/{**catch-all}",
            "PathTransform": "/{**catch-all}"
          }
        ]
      },
      {
        "RouteId": "admin_route",
        "ClusterId": "admin_cluster",
        "Match": {
          "Path": "/admin/{**catch-all}"
        }
      }
    ],
    "Clusters": [
      {
        "ClusterId": "api_cluster",
        "Destinations": {
          "api1": {
            "Address": "http://localhost:5001"
          },
          "api2": {
            "Address": "http://localhost:5002"
          },
          "api3": {
            "Address": "http://localhost:5003"
          }
        }
      },
      {
        "ClusterId": "admin_cluster",
        "Destinations": {
          "admin1": {
            "Address": "http://localhost:6001"
          }
        }
      }
    ]
  }
}
```

That's it. Now `/api/users` requests go to one of your three API servers. `/admin/dashboard` goes to your admin server.

## Transforming Requests and Responses

This is where YARP gets powerful. Transformers let you modify requests before they go to backends and responses before they go to clients.

### Built-in Transformers

YARP has transformers for common tasks:

**Modify the path:**

```json
"Transforms": [
  {
    "PathPattern": "/old-path/{**catch-all}",
    "PathTransform": "/new-path/{**catch-all}"
  }
]
```

**Add a header:**

```json
"Transforms": [
  {
    "RequestHeader": "X-Custom-Header",
    "Set": "CustomValue"
  }
]
```

**Remove a header:**

```json
"Transforms": [
  {
    "RequestHeaderRemove": "Authorization"
  }
]
```

**Change the host:**

```json
"Transforms": [
  {
    "RequestHeader": "Host",
    "Set": "backend.internal.com"
  }
]
```

### Custom Transformers

For more complex logic, write your own transformer:

```csharp
public class AuthHeaderTransformer : HttpRequestTransformer
{
    private readonly ITokenService _tokenService;

    public AuthHeaderTransformer(ITokenService tokenService)
    {
        _tokenService = tokenService;
    }

    public override async ValueTask TransformRequestAsync(HttpRequestTransformContext context)
    {
        var token = await _tokenService.GenerateBackendToken();
        context.ProxyRequest.Headers.Authorization = 
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
    }
}

public class SensitiveDataTransformer : HttpResponseTransformer
{
    public override async ValueTask TransformResponseAsync(HttpResponseTransformContext context)
    {
        if (context.ProxyResponse.Content is not null)
        {
            var content = await context.ProxyResponse.Content.ReadAsStringAsync();
            
            // Remove sensitive fields
            content = content.Replace("\"ssn\":", "\"ssn\":\"***\"");
            content = content.Replace("\"creditCard\":", "\"creditCard\":\"****-****-****-****\"");
            
            context.ProxyResponse.Content = new StringContent(content);
        }
    }
}
```

Register your custom transformers:

```csharp
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddTransforms<AuthHeaderTransformer>()
    .AddTransforms<SensitiveDataTransformer>();
```

Use them in your config:

```json
{
  "RouteId": "secure_route",
  "ClusterId": "secure_cluster",
  "Match": {
    "Path": "/secure/{**catch-all}"
  },
  "Transforms": [
    {
      "RequestTransformer": "AuthHeaderTransformer"
    },
    {
      "ResponseTransformer": "SensitiveDataTransformer"
    }
  ]
}
```

## What's Good About YARP

**Runs on .NET**

If your team uses .NET, you already know the ecosystem. You can handle routing logic in the same language as your backend services.

**Flexible configuration**

Routes and clusters can come from JSON, code, or even be loaded dynamically from a database. You can change routing without restarting if you load from a config source.

**Built for modern microservices**

It handles service discovery, load balancing policies, health checks, and timeouts out of the box.

**Transforms are powerful and composable**

Chain multiple transformers together. Build complex request/response modifications without writing a lot of code.

**Good performance**

YARP is built on top of the same HTTP infrastructure as ASP.NET Core. It doesn't add much overhead.

**Open source and actively maintained**

It's backed by Microsoft and has community support.

## What's Hard About YARP

**Another service to run and maintain**

YARP is another application you have to deploy, monitor, and keep running. If it goes down, your entire API is down.

**Performance becomes a bottleneck**

If YARP itself is slow, every request slows down. You need to monitor and scale it like any other service.

**Transforms can get complex**

Simple transforms are easy. Complex logic with multiple steps, conditional transformations, and error handling gets messy fast. At some point, it's easier to handle it in your backend services.

**Debugging is harder**

When something goes wrong, you're debugging across your reverse proxy and your backend. Logs need to flow through multiple systems.

**Complexity for small projects**

If you have two or three simple backend services, YARP might be overkill. A simple nginx config could do the same thing with less overhead.

**State management is tricky**

YARP is stateless by design. If you need to track something across requests or coordinate between transformers, it gets complicated.

## When to Use YARP

Use YARP when you have:

Multiple backend services that need routing logic

Need to transform requests and responses consistently

Want authentication and authorization in one place

Running a .NET-based microservices architecture

Need load balancing with custom policies

Want something that integrates naturally with ASP.NET Core

Don't use YARP when you:

Have a simple API with one or two backends

Already have nginx or another reverse proxy working well

Want to avoid running another service

Need advanced networking features that nginx has

## Real Example: Adding Authentication

Let's say you want to check a JWT token for every request and block requests with invalid tokens:

```csharp
public class TokenValidationTransformer : HttpRequestTransformer
{
    private readonly ITokenValidator _validator;

    public TokenValidationTransformer(ITokenValidator validator)
    {
        _validator = validator;
    }

    public override async ValueTask TransformRequestAsync(HttpRequestTransformContext context)
    {
        var token = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault();

        if (string.IsNullOrEmpty(token))
        {
            context.HttpContext.Response.StatusCode = 401;
            await context.HttpContext.Response.WriteAsJsonAsync(new { error = "No token provided" });
            return;
        }

        var isValid = await _validator.ValidateAsync(token);
        if (!isValid)
        {
            context.HttpContext.Response.StatusCode = 401;
            await context.HttpContext.Response.WriteAsJsonAsync(new { error = "Invalid token" });
            return;
        }

        // Token is valid, continue with the request
    }
}
```

Now every request goes through token validation before hitting your backend services. You handle this in one place instead of repeating it in every service.

## Keep It Simple

Start with basic routing. Get that working. Then add transforms as you need them. Don't build a complicated system if you don't need it yet.

YARP is useful because it gives you options. But options mean complexity. Use what you actually need.

## Conclusion

YARP is a solid choice for managing request routing and transformation in .NET microservices. It's flexible, performant, and integrates well with ASP.NET Core.

The trade-off is running another service and keeping transforms maintainable. But if you have multiple backends or complex routing needs, that trade-off usually makes sense.

Start small, add features as you need them, and don't over-engineer it.

## Official Resources

For more detailed information and advanced features, check out the [official Microsoft documentation for YARP Getting Started](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/servers/yarp/getting-started?view=aspnetcore-10.0).

The official docs cover configuration options, advanced transforms, middleware integration, and more.
