---
title: My favorite factory pattern implementation
slug: favorite-factory
date: 10/25/2022
description: Design patterns!! There are a few design patterns I use often, one of which the the factory pattern. There are however some implementation aspects that I find a little yucky. A few years ago I stumbled across a page that I cannot find anymore with this implementation of the factory pattern and I absolutely love it, let's see how it works!
photo: "./blogContent/favorite-factory/favorite-factory-sm.png"
banner: "../blogContent/favorite-factory/favorite-factory.png"
---

Design patterns!! There are a few design patterns I use often, one of which the the factory pattern. There are however some implementation aspects that I find a little yucky. A few years ago I stumbled across a page that I cannot find anymore with this implementation of the factory pattern and I absolutely love it, let's see how it works!

## When should you use this pattern?

A creational pattern, the factory pattern is used to create objects without having to specify the class explicitly. Let's say you have a coffee ordering application. It takes in a user input 1, 2, 3, and for 1, you want to return a cappuccino, 2 espresso, 3 regular coffee. Each selection (1, 2, 3) maps to a specific coffee. This is a great use case for the factory pattern!

## The class diagram

![Class Diagram](../blogContent/favorite-factory/class-diagram.png)

## Implementing the pattern

First we create two interfaces, one for the types coming in, and one for the types going out. To continue with our example lets create an ICoffee interface for the types of coffee we're going to make, and ISelection for the users selection

_Note: since the input in this example is simple we could use an int without an interface._

<div style="background-color: #000000; color:#FFFFFF; padding: 8px;">

    public interface ICoffee
    {
        public List<string> Ingredients { get; }
    }

    public interface ISelection
    {
        public int Value { get; }
    }

</div>

Next, let's create the concrete types for each interface. Starting with the user selection types.

<div style="background-color: #000000; color:#FFFFFF; padding: 8px;">

    public class SelectionOne : ISelection
    {
        public SelectionOne(int value)
        {
            Value = value;
        }

        public int Value { get; }
    }

    public class SelectionTwo : ISelection
    {
        public SelectionTwo(int value)
        {
            Value = value;
        }

        public int Value { get; }
    }

    public class SelectionThree : ISelection
    {
        public SelectionThree(int value)
        {
            Value = value;
        }

        public int Value { get; }
    }


</div>

Now the coffee types.

<div style="background-color: #000000; color:#FFFFFF; padding: 8px;">

    public class Cappuccino : ICoffee
    {
        public List<string> Ingredients { get; }

        public Cappuccino(List<string> ingredients)
        {
            Ingredients = ingredients;
        }
    }

    public class Espresso : ICoffee
    {
        public List<string> Ingredients { get; }

        public Espresso(List<string> ingredients)
        {
            Ingredients = ingredients;
        }
    }

    public class RegularCoffee : ICoffee
    {
        public List<string> Ingredients { get; }

        public RegularCoffee(List<string> ingredients)
        {
            Ingredients = ingredients;
        }
    }

</div>

Now we create the abstract factory that will serve as the base class for our concrete factories.

<div style="background-color: #000000; color:#FFFFFF; padding: 8px;">

    public abstract class CoffeeFactoryBase
    {
        public abstract ICoffee MakeCoffee();
    }

</div>

Once we have our abstract factory, we create a concrete factory for each implementation of ICoffee.

<div style="background-color: #000000; color:#FFFFFF; padding: 8px;">

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

</div>

Notice how each factory has the information necessary to create the type its responsible for. If for example we wanted to change the ingredients for our cappuccino the only class we would have to change is the CappuccinoFactory.

Now that we have our factories, we create our initializer that will hold the mapping from our input types to our factories and actually create our classes!

<div style="background-color: #000000; color:#FFFFFF; padding: 8px;">

    private readonly Dictionary<int, CoffeeFactoryBase> _factories;

    public Initializer()
    {
        _factories = new Dictionary<int, CoffeeFactoryBase>
        {
            { 1, new CappuccinoFactory() },
            { 2, new EspressoFactory() },
            { 3, new RegularCoffeeFactory() },
        };
    }

    public static Initializer Init() => new();

    public ICoffee Create(ISelection selection)
        => _factories[selection.Value].Create();

</div>

We're ready for the final step and to use our new factory implementation. The best part of this implementation is it's single line execution keeping the calling code clean.

<div style="background-color: #000000; color:#FFFFFF; padding: 8px;">

    var customerCoffee = Initializer.Init().Create(userSelection);

</div>

That's all it takes, but can we improve? Let's look at the initializer 

<div style="background-color: #000000; color:#FFFFFF; padding: 8px;">

    private readonly Dictionary<int, CoffeeFactoryBase> _factories;

    public Initializer()
    {
        _factories = new Dictionary<int, CoffeeFactoryBase>
        {
            { 1, new CappuccinoFactory() },
            { 2, new EspressoFactory() },
            { 3, new RegularCoffeeFactory() },
        };
    }

    public static Initializer Init() => new();

    public ICoffee Brew(ISelection selection)
        => _factories[selection.Value].MakeCoffee();

</div>

We don't really need the Init function, we could instead mark the Dictionary static, remove the constructor and make the create function static. So our initializer becomes:

<div style="background-color: #000000; color:#FFFFFF; padding: 8px;">

    private static readonly Dictionary<int, CoffeeFactoryBase> _factories = new Dictionary<int, CoffeeFactoryBase>
        {
            { 1, new CappuccinoFactory() },
            { 2, new EspressoFactory() },
            { 3, new RegularCoffeeFactory() },
        };

    public static ICoffee Brew(ISelection selection)
        => _factories[selection.Value].MakeCoffee();

</div>

Which makes our implementation look like this:

<div style="background-color: #000000; color:#FFFFFF; padding: 8px;">

    var customerCoffee = Initializer.Brew(userSelection);

</div>

Now what about if we wanted to give the user the ability to add special requests. Since its October when I'm writing this, let's give the users the ability to add pumpkin spice to their coffees.
We can pass this as a parameter to our factories through the Brew method in our initializer, and pass it to our make coffee method.

<div style="background-color: #000000; color:#FFFFFF; padding: 8px;">

    private static readonly Dictionary<int, CoffeeFactoryBase> _factories = 
    new Dictionary<int, CoffeeFactoryBase>
        {
            { 1, new CappuccinoFactory() },
            { 2, new EspressoFactory() },
            { 3, new RegularCoffeeFactory() },
        };

    public static ICoffee Brew(ISelection selection, bool addPumpkinSpice)
        => _factories[selection.Value].MakeCoffee(addPumpkinSpice);

</div>

Now all thats left to do is update our interface and factory methods to accept this new parameter.

<div style="background-color: #000000; color:#FFFFFF; padding: 8px;">

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

</div>

Let's see how this looks in a console application.

![Coffee Factory](../blogContent/favorite-factory/screenshot_coffeefactory1.jpg)

I hope you find this implementation useful. You the working code by going to my _[github](https://github.com/wbratz/coffee-factory)_