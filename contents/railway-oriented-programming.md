---
title: "You're Not Using Railway Oriented Programming and You're an Idiot"
slug: railway-oriented-programming
date: 6/12/2025
description: "A no-BS guide to Railway Oriented Programming in C# with real-world examples and why you should stop writing spaghetti error-handling logic."
photo: "./blogContent/railway-oriented-programming/railway_thumbnail.png"
banner: "../blogContent/railway-oriented-programming/railway-banner.png"
---

## Let’s be real for a second.

If your codebase still uses a bunch of `try/catch`, nulls, or `if (!IsValid)` chains strung together like Christmas lights, then I’m sorry—but you’re doing it wrong. Or at least, you're doing it the hard way.

Let’s fix that. The concept is called **Railway Oriented Programming**, and if you’ve written more than 10 lines of backend code in your life, it’s going to click immediately. And once it does, you’ll wonder how you tolerated the old way for so long.

---

## What Is Railway Oriented Programming?

Railway Oriented Programming (ROP) is basically this:

> Instead of writing "do X, then Y, then Z" while constantly checking for errors, you write a **rail**—a track where success flows naturally—and only derail if something fails.

So your code ends up looking like a train ride:

* Step 1: Validate the input
* Step 2: Transform something
* Step 3: Call a service
* Step 4: Save the result
* Step 5: Celebrate 🎉

And if any of those fail? The train stops. You don't manually track it. You just stop chaining.

---

## A Quick Glance at the Tool

I use [CSharpFunctionalExtensions](https://github.com/vkhorikov/CSharpFunctionalExtensions) to write ROP-style code in C#. It gives you a `Result<T>` type and chaining methods like `Bind`, `Map`, `Tap`, `Ensure`, and `TapError`.

That’s it. The library’s not the point here—it just gives you the hammer. We’re talking carpentry.

---

## Your Garbage Flow Without ROP

Here’s the kind of code I used to write (and see way too often):

```csharp
public async Task<Order?> PlaceOrder(OrderRequest request)
{
    if (!IsValid(request))
    {
        _logger.LogWarning("Invalid order request");
        return null;
    }

    var inventory = await GetInventory(request.ItemId);
    if (inventory == null || !inventory.Available)
    {
        _logger.LogWarning("Item unavailable");
        return null;
    }

    var charged = await ChargeCard(request.PaymentInfo);
    if (!charged)
    {
        _logger.LogError("Payment failed");
        return null;
    }

    var order = await SaveOrder(request);
    return order;
}
```

This is **linear** but not **expressive**. It's "railway-adjacent," sure, but every `if` is boilerplate. And it scales like wet cardboard.

---

## Same Thing, Railway Style

Now here’s the same flow rewritten in Railway Oriented Programming style using `CSharpFunctionalExtensions`:

```csharp
public async Task<Result<Order>> PlaceOrder(OrderRequest request)
{
    return await Validate(request)
        .Bind(valid => GetInventory(valid.ItemId))
        .Ensure(inv => inv.Available, "Item unavailable")
        .Bind(inv => ChargeCard(request.PaymentInfo, inv.Price))
        .Bind(_ => SaveOrder(request))
        .Tap(order => _logger.LogInformation("Order placed: {OrderId}", order.Id))
        .TapError(error => _logger.LogWarning("Order failed: {Error}", error));
}
```

See the difference?

* There’s no null-checking.
* There’s no `if`.
* There's no `try/catch`.
* Every step either continues the happy path or exits gracefully.

---

## Real Example: One of My Verifications

This is pulled from a verification pipeline I built—simplified here.

```csharp
public async Task<Result<Verification>> RunVerification(Document doc)
{
    return await Validate(doc)
        .Bind(ExtractData)
        .Tap(data => _logger.LogInformation("Data extracted"))
        .Bind(GeneratePrompt)
        .Bind(SendToGPT)
        .Map(ExtractVerification);
}
```

I don’t need a logger that says “I’m starting step 2!” because this reads *exactly like a script*. It's readable, testable, and debuggable—**without instrumentation gymnastics**.

---

## When It Doesn’t Shine (Yes, There Are Limits)

### Example 1: Conditional branches inside chains

If you’ve got a fork in the track—“if A do B, else do C”—ROP can get awkward.

```csharp
return await Validate()
    .Bind(x =>
        x.Type switch
        {
            TypeA => DoTypeAStuff(x),
            TypeB => DoTypeBStuff(x),
            _ => Result.Failure("Unsupported type")
        });
```

It works, but it smells. You’re putting logic inside a `Bind`. I usually punt and break it out into a private method to make the chain cleaner.

---

### Example 2: You Actually Want Recovery

ROP assumes failure means “stop the train.” But sometimes you want to try again—fallback logic, circuit breakers, retries.

For example, say your GPT call fails, and you want to try a fallback prompt instead:

```csharp
return await TryPrimaryPrompt()
    .TapError(_ => _logger.LogWarning("Primary prompt failed"))
    .OnFailureCompensate(_ => TryFallbackPrompt());
```

That works—and it's idiomatic. `OnFailureCompensate` lets you jump rails and try something else. But if you find yourself doing this a lot, you might not be doing ROP—you might be writing a state machine.

---

## Wrapping Up

Railway Oriented Programming is one of the **cleanest ways** to write service logic that’s:

* Easy to follow
* Safe to test
* Self-documenting
* And honestly, more fun to work in

It’s not *magical*. It’s not *functional elitism*. It’s just a better default when working with workflows where things can go wrong.

So yeah, if you’re not using ROP (and you're writing business logic in C#), you’re kind of being an idiot. But good news: now you don’t have to be.

If you liked this post, follow me on [X](https://x.com/Tennessee_Thor) hit me up with your comments or just to say hello.