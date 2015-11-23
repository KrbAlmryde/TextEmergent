/*
 * Yoda Quotes! For testing
 */

function Yoda() {
    var quotes = [
`Death is a natural part of life.
Rejoice for those around you who transform into the Force.
Mourn them do not.
Miss them do not.
Attachment leads to jealously.
The shadow of greed, that is.
- Yoda`
,

`Always pass on what you have learned.
- Yoda`
,

`You will know (the good from the bad) when you are calm, at peace.
Passive.
A Jedi uses the Force for knowledge and defense, never for attack.
- Yoda`
,

`Yes, a Jedi’s strength flows from the Force.
But beware of the dark side.
Anger, fear, aggression; the dark side of the Force are they.
Easily they flow, quick to join you in a fight.
If once you start down the dark path, forever will it dominate your destiny, consume you it will, as it did Obi-Wan’s apprentice.
- Yoda`
,

`Train yourself to let go of everything you fear to lose.
- Yoda`
,

`Powerful you have become, the dark side I sense in you.
- Yoda`
,

`PATIENCE YOU MUST HAVE my young padawan
- Yoda`
,
`Do, or do not. There is no try.
- Yoda`
,
`For my ally is the Force.
And a powerful ally it is.
Life creates it, makes it grow.
Its energy surrounds us and binds us.
Luminous beings are we, not this crude matter.
You must feel the Force around you.
Here, between you, me, the tree, the rock, everywhere!
Yes, even between the land and the ship.
- Yoda`
,
`If no mistake have you made, yet losing you are...
a different game you should play.
- Yoda`
,
`To be Jedi is to face the truth, and choose.
Give off light, or darkness, Padawan.
Be a candle, or the night, Padawan: but choose`
]

    this.quote = function() {
        var index = Math.floor(Math.random() * quotes.length)
        return quotes[index];
    }
}