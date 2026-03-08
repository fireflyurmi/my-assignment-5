<!-- No.1 question & answer -->

1️⃣ What is the difference between var, let, and const?

Ans :- (var) is function-scoped. It can be re-declared and re-assigned.(Hoisted).

(let) is safer than (var). It's block-scoped. It can be re-assigned but can not be re-declared.

(const) is also block-scoped. It can not be re-assigned and re-declared.


<!-- No.2 question & answer -->

2️⃣ What is the spread operator (...)?

Ans :- spread operator is generally used for merge & copy (array) and also merge & copy (object). It spread out an (array). For example :- 

const numbers = [1, 2, 3];
console.log(...numbers);

The output will be : 1 2 3


<!-- No.3 question & answer -->

3️⃣ What is the difference between map(), filter(), and forEach()?

Ans :- These 3 methods are generally used for (looping on array). map() is worked on each element of an array and return a new array.

filter() creates a new array by selecting some elements from an array according to the condition.

forEach() just loops over each element, but not return new array.


<!-- No.4 question & answer -->

4️⃣ What is an arrow function?

Ans :- In javascript arrow function is a short and modern way to write a function. For example :-

In normal function :  
            function add(a, b) {
            return a + b;
            }

In arrow function :
            const add = (a, b) => a + b;
            console.log(add(2,3));  the output will be 5. 


<!-- No.5 question & answer -->

5️⃣ What are template literals?

Ans :- template literals is a modern way of writing "string" in javascript, where variable can be dynamically used. Within backtick(``) string and variable can be easily used.
