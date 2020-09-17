# Parsons Problems (proof of concept)

## history/context

[parsons problems](https://www.computingatschool.org.uk/news_items/365) are a method of practicing function composition where learners are faced with a function that has the lines out of order. The learner then has to put them back in order. 

## as a micromaterial

A lot of times, these parsons problems are constructed by individual instructors, and this seems like a reproduction of both time and effort. This also has the disadvantageous possibility of presenting functions that are less than authentic.

If instead, we compose these parsons problems from actual code (eg, on GitHub), it's possible to present much more authentic samples of functions that learners will actually encounter in the real world.

Another advantage of this approach is that when viewing a particular code snippet example, there's a link that will go directly to where it's located in the original github source.

This approach also contains disadvantages, however, since it's not trivial to extract the purpose of the function from the source code. So the only thing we can really do with these snippets is just ask the learner to put them back in order. It's also not trivial to determine whether the reordered code, if different from the original order, would still run. This is easier to do with AST parsing for JS, but for python is a bit more difficult. For that reason, this project only focuses on putting the function back into the ORIGINAL order rather than putting it into a POSSIBLE successful order.


## Running locally

```
$ git clone git@github.com:lpmi-13/parsons-problems
$ npm install
$ npm start
```
 
