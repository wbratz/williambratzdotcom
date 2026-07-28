---
title: A Factory Pattern for Simpler Object Creation
slug: favorite-factory
date: 2022-10-25
updated: 2026-07-28
description: A C# factory pattern that reduces repeated object-creation logic while keeping concrete types and parameters easy to extend.
photo: "./blogContent/favorite-factory/favorite-factory-sm.png"
banner: "../blogContent/favorite-factory/favorite-factory.png"
imageAlt: A code-themed illustration for a C# factory pattern implementation.
topics:
  - C#
  - Software Design
featured: false
---

A factory is useful when choosing an object and constructing it are decisions that deserve their own home.

That distinction matters. Moving every `new` expression behind a class called `Factory` does not improve a design. A factory earns its place when creation involves selection, configuration, validation, dependencies, or rules that the caller should not need to know.

This example uses a coffee application because the mapping is easy to see: a customer's selection determines which drink to create.

## The problem hiding in a switch

The most direct implementation is a switch:

```csharp
public static ICoffee Brew(int selection)
{
    return selection switch
    {
        1 => new Cappuccino(["Espresso", "Foamed Milk"]),
        2 => new Espresso(["Fine Ground Coffee", "Water"]),
        3 => new RegularCoffee(["Coffee Grounds", "Water"]),
        _ => throw new ArgumentOutOfRangeException(nameof(selection))
    };
}
```

For three simple types, this is perfectly reasonable. It is explicit, compact, and easy to debug.

The pressure to introduce a factory appears when creation begins to change independently. Perhaps each drink needs different dependencies, recipes come from configuration, or new selections are added by separate features. At that point the switch becomes a meeting place for unrelated construction rules.

## Give each recipe one responsibility

First define the product:

```csharp
public interface ICoffee
{
    IReadOnlyList<string> Ingredients { get; }
}

public sealed record Cappuccino(
    IReadOnlyList<string> Ingredients) : ICoffee;

public sealed record Espresso(
    IReadOnlyList<string> Ingredients) : ICoffee;

public sealed record RegularCoffee(
    IReadOnlyList<string> Ingredients) : ICoffee;
```

Then define the creation contract:

```csharp
public interface ICoffeeFactory
{
    ICoffee MakeCoffee(bool addPumpkinSpice);
}
```

Each concrete factory owns one recipe:

```csharp
public sealed class CappuccinoFactory : ICoffeeFactory
{
    public ICoffee MakeCoffee(bool addPumpkinSpice)
    {
        var ingredients = new List<string>
        {
            "Espresso",
            "Foamed Milk"
        };

        if (addPumpkinSpice)
        {
            ingredients.Add("Pumpkin Spice");
        }

        return new Cappuccino(ingredients);
    }
}
```

The list is created inside the method intentionally. A static mutable list would retain changes between orders, allowing one customer's pumpkin spice to leak into the next customer's drink.

The other factories follow the same contract:

```csharp
public sealed class EspressoFactory : ICoffeeFactory
{
    public ICoffee MakeCoffee(bool addPumpkinSpice) =>
        new Espresso(AddOptionalSpice(
            ["Fine Ground Coffee", "Water"],
            addPumpkinSpice));
}

public sealed class RegularCoffeeFactory : ICoffeeFactory
{
    public ICoffee MakeCoffee(bool addPumpkinSpice) =>
        new RegularCoffee(AddOptionalSpice(
            ["Coffee Grounds", "Water"],
            addPumpkinSpice));
}
```

Shared mechanics can remain a small helper without taking ownership of the recipes:

```csharp
private static IReadOnlyList<string> AddOptionalSpice(
    IEnumerable<string> ingredients,
    bool addPumpkinSpice)
{
    return addPumpkinSpice
        ? [.. ingredients, "Pumpkin Spice"]
        : [.. ingredients];
}
```

## Separate selection from construction

The caller should not know which concrete factory handles a selection. A registry makes that mapping explicit:

```csharp
public sealed class CoffeeMachine
{
    private readonly IReadOnlyDictionary<int, ICoffeeFactory> _factories;

    public CoffeeMachine(IEnumerable<KeyValuePair<int, ICoffeeFactory>> factories)
    {
        _factories = factories.ToDictionary(
            pair => pair.Key,
            pair => pair.Value);
    }

    public ICoffee Brew(int selection, bool addPumpkinSpice)
    {
        if (!_factories.TryGetValue(selection, out var factory))
        {
            throw new ArgumentOutOfRangeException(
                nameof(selection),
                selection,
                "That drink is not on the menu.");
        }

        return factory.MakeCoffee(addPumpkinSpice);
    }
}
```

Registration happens once:

```csharp
var machine = new CoffeeMachine(
[
    KeyValuePair.Create<int, ICoffeeFactory>(1, new CappuccinoFactory()),
    KeyValuePair.Create<int, ICoffeeFactory>(2, new EspressoFactory()),
    KeyValuePair.Create<int, ICoffeeFactory>(3, new RegularCoffeeFactory())
]);

var coffee = machine.Brew(selection: 1, addPumpkinSpice: true);
```

The calling code expresses intent while the registry and factories own the construction details.

![A console application using the coffee factory](/blogContent/favorite-factory/screenshot_coffeefactory1.jpg)

## What this design buys you

The value is not the one-line call. The value is where change lands:

- A recipe change stays inside one factory.
- A new drink adds a product, a factory, and a registration.
- The caller depends on `ICoffee`, not a concrete drink.
- Each construction rule can be tested independently.
- Dependencies can be injected into the factory that needs them.

The cost is more types and more indirection. If creation is only a short stable switch, keep the switch. Patterns are tools for concentrating change, not badges of architectural maturity.

## The decision to remember

Use a factory when object creation contains knowledge that should be isolated from the code requesting the object. Keep selection explicit, keep construction local, and do not let shared mutable state sneak into either.

The complete example is available in the [coffee factory repository](https://github.com/wbratz/coffee-factory).
