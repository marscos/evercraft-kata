# EverCraft Kata

## Introduction
I spent approximately an hour and a half on modeling the domain for EverCraft as specified, as it was requested to keep a time constraint. I believe I was able to attend the first iteration requirements and at least some of the ideas listed for character *Classes*.

## Key Takeaways
Probably, doing combat through the `Character` class methods is going to be a burden, and it should be handled by a "*Server*" entity of some sort responsible to manage the game state (since it is supposed to be an MMORPG).

I envisioned to make the `Character` class extensible through heritage, but could not appropriately work out the modeling so that both *Classes* and *Races* could simultaneously affect modifiers and properties of a character. I believe it was an oversight to not scan through the iterations at first so I could try to accomodate for *Races* from the start.

Maybe a possible solution would involve defining *Classes* and *Races* as static entities that have their own functions to modify and make available to the `Character`'s.

I have also taken the liberty of changing the following requirement:
> double Strength modifier on critical hits

Instead, what I implemented was this:

> double Strength considered for the Strength modifier

As I believe it was an oversight to describe the behavior like this, as it would make some critical hits weaker. In a real situation, I would discuss this possibility with the requirement writers, and not make this change deliberately from my understanding of an RPG only.

## Next Steps
I could not write tests in time. However, I would have written unit tests based on the requirements specification provided for the first iteration, a few more for edge cases like negative *Ability* values, and *Classes* ideas, like "*Rogues can't have Good alignment*". I tried to design class methods so that it would be easy to test their effects.

Next steps would be to figure out the pattern and refactors required to allow for the desired extensibility and to write tests for designed character classes, races, skills and items behaviors.
