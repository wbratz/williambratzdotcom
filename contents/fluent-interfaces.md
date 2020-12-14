---
title: Extension methods, fluent Interfaces, and method chaining in C#
slug: fluent-interfaces
date: 12/14/2020
description: Fluent interfaces, and method chaining in C# helpful ways to reduce lines of code, increase code readability, and allow the next developer to quickly look through you code and easily know what is happening. In this blog I'll walk you through building extension methods, using method chaining and fluent interfaces, Let's dive in!
photo: "./blogContent/fluent-interfaces/extension_sm.jpg"
banner: "../blogContent/fluent-interfaces/extension.jpg"
---

Fluent interfaces, and method chaining in C# helpful ways to reduce lines of code, increase code readability, and allow the next developer to quickly look through you code and easily know what is happening. In this blog I'll walk you through building extension methods, using method chaining and fluent interfaces, Let's dive in!

## What are extension methods?

> Extension methods enable you to "add" methods to existing types without creating a new derived type, recompiling, or otherwise modifying the original type. Extension methods are static methods, but they're called as if they were instance methods on the extended type. For client code written in C#, F# and Visual Basic, there's no apparent difference between calling an extension method and the methods defined in a type.

> _[Microsoft](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods)_

What does that mean? Simply put, extension methods allow you to modify parts of your application (types) without having to call a method. Take this example.

![Example 1](../blogContent/fluent-interfaces/example1.JPG)

Here we're calling a database, and returning an Animal object (Context.Animal) by its id. In this scenario it is best practice to not return the same object as your database context. So lets add on to our method to return an AnimalModel, which is an object defined inside of our application.

![Example 2](../blogContent/fluent-interfaces/example2.JPG)

Now our method has multiple responsibilities it gets the animal context from the database, and it also holds the conversion logic. So we make a private method that converts Context.Animal to AnimalModel. Then we apply it to our first method, and alter the return type, and the name so our code ends up looking like this.

![Example 3](../blogContent/fluent-interfaces/example3.JPG)

This is fine, we can do this and we're ticking the best practice boxes, but there are still some potential problems, and things we can make better. First our repository is now holding the logic for our conversion methods. If we use this repository to return different types from out database we could have a whole host of extension methods cluttering our class. So what do we do?

## Enter extension methods

Lets start by creating a class AnimalExtensions.cs. Then lets define our class as static.

![Example 4](../blogContent/fluent-interfaces/example4.JPG)

Then lets copy and past our code from our repository into our new AnimalExtensions class and make two changes. Let's change the input parameter from (Context.Animal animal) to (this Context.Animal animal) and make this method static, we could have also done this inside of our repository. These are the key things your need in order to make an extension method, a static class, a static method, and a parameter of (this [the object type you're extending]).

![Example 5](../blogContent/fluent-interfaces/example5.JPG)

Now we can call our extension method from our repository by using animal.ConvertToAnimalModel(), and we end up with this.

![Example 6](../blogContent/fluent-interfaces/example5.JPG)

And ta-da! We've made an extension method for Context.Animal and we've cleaned up our repository, but there are a couple more things we can do. We're using Async/Await to pull the data from our database, so lets utilize the same logic in our extension method. With a couple more changes we can reduce the lines of code even more. Let's make our extension method async by adding the async keyword, chaining the input parameter to take a Task<Context.Animal> and return a Task<AnimalModel>. Finally lets change our method name to end with async, and await our Task<Context.Animal> parameter.

![Example 7](../blogContent/fluent-interfaces/example7.JPG)

Now let's change our repository to use our new async extension method, simply by removing the new var and adding .ConvertToAnimalModelAsync (let's also change the method in our repository to reflect that its async).

![Example 8](../blogContent/fluent-interfaces/example8.JPG)

We have now reduced everything down to 4 lines of code, making our repository nice and clean. We've also taken the conversion logic out of the hands of the repository and given that responsibility to another class. We've also done something else you may not have noticed.

## Method chaining and fluent interfaces

Take our previous example

<div style="background-color: #000000; color:#FFFFFF">

    public async Task<AnimalModel> GetAnimalModelByIdAsync(int animalId)
    {
        return await _dbContext.Animals
            .Include(x => x.AnimalType)
            .FirstOrDefaultAsync(x => x.Id == animalId)
            .ConvertToAnimalModelAsync();
    }

</div>
This is an example of method chaining. We're taking methods and literally chaining them together. The first two methods are built into linq, we're including data from an additional table with the Include method, we're also getting the first result with the FirstOrDefaultMethod, then we're converting the Context.Animal to an AnimalModel with the extension method we've created. This is also the pattern behind fluent interfaces.

### The difference between method chaining and fluent interfaces

Fluent interfaces utilize method chaining the difference comes where method chaining changes the object type we're working with. Like in our example our method is taking a Context.Animal and returning an AnimalModel. Fluent interfaces (I've also heard this called the fluency pattern) returns an object of the same type as the original. Lets see an example.

Let's say we want our AnimalModel to be Immutable so it cannot be changed directly, but we want to still offer ways to change certain properties. For this example I'll quickly create a new class called ImmutableAnimal and utilize the constructor to set the properties. There are better ways to do this, but for this example its fine.

![Example 9](../blogContent/fluent-interfaces/example9.JPG)

Now let's add an extension method to Convert an AnimalModel to an ImmutableAnimalModel, again lets utilize tasks and Async/Await.

![Example 10](../blogContent/fluent-interfaces/example10.JPG)

And change our repository to return an ImmutableAnimalModel, since we utilized Async/Await we can chain our new extension method, making our repository method only one line longer.

![Example 11](../blogContent/fluent-interfaces/example11.JPG)

As mentioned above fluent interfaces are implemented using method chaining, but not all method chaining uses are fluent interfaces, up until this point we've just been using method chaining, let's implement our first fluent interface. We start out by adding some additional extension methods.

![Example 12](../blogContent/fluent-interfaces/example12.JPG)

One to rename our animal.

![Example 13](../blogContent/fluent-interfaces/example13.JPG)

One to change our animals birthday.

![Example 14](../blogContent/fluent-interfaces/example14.JPG)

And one to change the color of our animal.

Now we're just going to make a method that calls our repository to get our ImmutableAnimalModel, and utilizes our extension methods to change some aspects of our ImmutableAnimal type.

![Example 15](../blogContent/fluent-interfaces/example15.JPG)

Let's clean this up by making async versions of our extension methods and reduce these 5 lines of code further.

![Example 16](../blogContent/fluent-interfaces/example16.JPG)
![Example 17](../blogContent/fluent-interfaces/example17.JPG)
![Example 18](../blogContent/fluent-interfaces/example18.JPG)

Finally we're left with this.

![Example 19](../blogContent/fluent-interfaces/example19.JPG)

We have successfully implemented a fluent interface, our code is clean, the next person who sees this method can quickly and easily understand this method gets an ImmutableAnimalModel, renames it to "Frank" , sets it birthday to 12-12-2005, and changes it color to blue without having to see all the code that actually makes these actions happen. I encourage you to think about use cases for extension methods and fluent interfaces during your development journey.

A couple quick notes:
<br></br>Make sure you understand Async/Await before implementing, for more information on Async/Await see: [Microsoft Async](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/async/)

To see a working implementation of this code visit my [Github Repo](https://github.com/wbratz/fluent-interfaces-example) (no database needed).
