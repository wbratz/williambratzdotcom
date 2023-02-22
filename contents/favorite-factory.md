---
title: Simplifying Object Creation and Reducing Code Duplication with A Unique Factory Pattern Implementation
slug: favorite-factory
date: 10/25/2022
description: Simplify object creation and reduce code duplication with a unique factory pattern implementation. Learn how to create concrete types for each interface and an abstract factory class to serve as a base for the concrete factories. Plus, see how to modify your interface and factory methods to accept additional parameters.
photo: "./blogContent/favorite-factory/favorite-factory-sm.png"
banner: "../blogContent/favorite-factory/favorite-factory.png"
---

Design patterns, including the factory pattern, are useful in software development. This post will show my favorite implementation of the factory pattern in C#.

## When should you use this pattern?

The factory pattern is a creational pattern used to create objects without having to specify the class explicitly. An example use case would be a coffee ordering application that maps user inputs (1, 2, or 3) to specific types of coffee (cappuccino, espresso, or regular coffee).

## The class diagram

![Class Diagram](../blogContent/favorite-factory/class-diagram.png)

## Implementing the pattern

The first step is to create two interfaces, one for input types and one for output types. In this example, we will create an ICoffee interface for types of coffee and an ISelection interface for the user's selection.

```csharp
public interface ICoffee
{
    public List<string> Ingredients { get; }
}

public interface ISelection
{
    public int Value { get; }
}
```

Next, we create concrete types for each interface.

```csharp
public class SelectionOne : ISelection
{
    public SelectionOne(int value) => Value = value;

    public int Value { get; }
}

public class SelectionTwo : ISelection
{
    public SelectionTwo(int value) => Value = value;

    public int Value { get; }
}

public class SelectionThree : ISelection
{
    public SelectionThree(int value) => Value = value;

    public int Value { get; }
}
```

Now the coffee types.

```csharp
public class Cappuccino : ICoffee
{
    public List<string> Ingredients { get; }

    public Cappuccino(List<string> ingredients) => Ingredients = ingredients;
}

public class Espresso : ICoffee
{
    public List<string> Ingredients { get; }

    public Espresso(List<string> ingredients) => Ingredients = ingredients;
}

public class RegularCoffee : ICoffee
{
    public List<string> Ingredients { get; }

    public RegularCoffee(List<string> ingredients) => Ingredients = ingredients;
}
```

After creating the concrete types, we can create an abstract factory class that will serve as a base class for the concrete factories. With the abstract factory class, we can create a concrete factory for each type of coffee. The factory is responsible for instantiating the concrete type and returning it to the calling code. The calling code doesn't need to know the details of how the object is created, it simply asks the factory to create it.

Let's create a `CoffeeFactoryBase` class that defines the `MakeCoffee()` method, which will be overridden by the concrete factories to create their respective types of coffee.

```csharp
public abstract class CoffeeFactoryBase
{
    public abstract ICoffee MakeCoffee();
}
```
Now we can create a concrete factory for each implementation of `ICoffee`.

```csharp
public class CappuccinoFactory : CoffeeFactoryBase
{
    private static List<string> _ingredients = new List<string> 
    {
        "Espresso",
        "Foamed Milk"
    }
    public override ICoffee MakeCoffee()
    {
        return new Cappuccino(_ingredients);
    }
}

public class EspressoFactory : CoffeeFactoryBase
{
    private static List<string> _ingredients = new List<string> 
    {
        "Fine Ground Coffee",
        "Water"
    }
    public override ICoffee MakeCoffee()
    {
        return new Espresso(_ingredients);
    }
}

public class RegularCoffeeFactory : CoffeeFactoryBase
{
    private static List<string> _ingredients = new List<string> 
    {
        "Coffee Grounds",
        "Water"
    }
    public override ICoffee MakeCoffee()
    { 
        return new RegularCoffee(_ingredients);
    }
}
```

Notice how each factory has the information necessary to create the type it's responsible for. If, for example, we wanted to change the ingredients for our cappuccino, the only class we would have to change is the `CappuccinoFactory`.

To create our classes, we need an initializer that holds the mapping from our input types to our factories. We can create a dictionary object to achieve this.

```csharp
private static readonly Dictionary<int, CoffeeFactoryBase> _factories = new Dictionary<int, CoffeeFactoryBase>
    {
        { 1, new CappuccinoFactory() },
        { 2, new EspressoFactory() },
        { 3, new RegularCoffeeFactory() },
    };

public static ICoffee Brew(ISelection selection)
    => _factories[selection.Value].MakeCoffee();
```

We're ready for the final step and to use our new factory implementation. The best part of this implementation is it's single line execution keeping the calling code clean.

```csharp
var customerCoffee = Initializer.Brew(userSelection);
```

With this implementation, we can pass additional parameters to our factories. For instance, we can pass a boolean value to add pumpkin spice to the coffee.

We can modify our interface and factory methods to include the new parameter.

```csharp
private static readonly Dictionary<int, CoffeeFactoryBase> _factories = 
new Dictionary<int, CoffeeFactoryBase>
    {
        { 1, new CappuccinoFactory() },
        { 2, new EspressoFactory() },
        { 3, new RegularCoffeeFactory() },
    };

public static ICoffee Brew(ISelection selection, bool addPumpkinSpice)
    => _factories[selection.Value].MakeCoffee(addPumpkinSpice);
```

Now all thats left to do is update our interface and factory methods to accept this new parameter.

```csharp
public abstract class CoffeeFactoryBase
{
    public abstract ICoffee MakeCoffee(bool addPumpkinSpice);
}

public class CappuccinoFactory : CoffeeFactoryBase
{
    private static readonly List<string> _ingredients = new List<string>
    {
        "Espresso",
        "Foamed Milk"
    };
    public override ICoffee MakeCoffee(bool addPumpkinSpice)
    {
        if (addPumpkinSpice)
        {
            _ingredients.Add("Pumpkin Spice");
        }
        return new Cappuccino(_ingredients);
    }
}

public class EspressoFactory : CoffeeFactoryBase
{
    private static List<string> _ingredients = new List<string>
    {
        "Fine Ground Coffee",
        "Water"
    };
    public override ICoffee MakeCoffee(bool addPumpkinSpice)
    {
        if (addPumpkinSpice)
        {
            _ingredients.Add("Pumpkin Spice");
        }
        return new Espresso(_ingredients);
    }
}

public class RegularCoffeeFactory : CoffeeFactoryBase
{
    private static List<string> _ingredients = new List<string>
    {
        "Coffee Grounds",
        "Water"
    };
    public override ICoffee MakeCoffee(bool addPumpkinSpice)
    {
        if (addPumpkinSpice)
        {
            _ingredients.Add("Pumpkin Spice")
        };
        return new RegularCoffee(_ingredients);
    }
}
```

Let's see how this looks in a console application.

![Coffee Factory](../blogContent/favorite-factory/screenshot_coffeefactory1.jpg)

In this blog post, we saw a great implementation of the factory pattern in C# that simplifies object creation and reduces code duplication. We created two interfaces, one for input types and one for output types. Then, we created concrete types for each interface and an abstract factory class that served as a base class for the concrete factories. We created a concrete factory for each implementation of ICoffee and an initializer that held the mapping from our input types to our factories. Finally, we modified our interface and factory methods to accept additional parameters, such as adding pumpkin spice to the coffee.

Check out the full code on my _[github](https://github.com/wbratz/coffee-factory)_