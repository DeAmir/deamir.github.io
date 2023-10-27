---
title: The Recursion Theorem 1
date: 2023-10-06
categories:
  - Computability Theory
tags: []
math: true
---
This part covers the construction of a Turing Machine (TM) that prints the description of itself. The [next part]({% post_url 2023-10-07-recursion-theorem-2 %}) is more worthy of the name and covers the implementation of actual recursion in TMs.
Both parts contain Python examples that demonstrate the concepts.
## Motivation
Recursion is a powerful tool. It's easily utilized on actual computers, because of the way computers load and execute programs: first, a function is put into a defined memory chunk, and then the chunk address is loaded into any self-reference that the function makes.

But TMs are different from actual computers and don't enjoy such benefits.

The Recursion Theorem proves that TMs, too, can utilize recursion. This result isn't so trivial to prove, as TMs don't have their descriptions loaded into memory as computer programs do.
The result is another confirmation of the Church-Turing thesis.

## Recurrence in TMs
How can a TM call itself? One way to do so is by getting its own description, and then simulating it on an input. Hence, a TM would have to be able to get its own description and then do some computation with it.

For example, the following is a TM that recursively calculates the $n$th Fibonacci number:
> $FIB$: given $n$,
> 1. If $n=0,1$ write $1$ to tape and finish.
> 2. Otherwise, get my own description $\langle FIB\rangle$.
> 3. Simulate the machine $FIB$, using the description calculated in 2, on $n-1$ and $n-2$.
> 4. Write to the tape the sum of the two results.

## $SELF$: A SELF-printing TM


A relaxed version of the theorem is the following:
> There exists a TM that once done executing, the tape contains its own description.

This version provides the basic methods behind the full theorem.
We now need to construct such a TM. This is difficult to do explicitly - try to create a Python program that prints itself. For example, if you start with `print(` then you need another `print(` inside etc., infinitely many times.

### The Construction
We construct such a machine, $SELF$, by separating the printing process into two parts, each carried out by a dedicated TM. The machines are $A$ and $B$. The $SELF$ machine would be executing $A$ and then $B$.

If $A$ prints the string $S_A$, then $B$ could get the description of $A$: it's the description of the machine $P_{S_A}$ that only prints the string $S_A$ - which resides on the tape as it arrives to $B$.
So $B$ has the description of $A$. If it also had the description of itself, then it'd have access to $\langle A\rangle$  and $\langle B\rangle$ and then write to tape $\langle AB\rangle$ (a description of the machine that first executed $A$ and then $B$). That's exactly the description of $SELF$.

So we only need $B$ to have access to the description of itself. The only input it has is the tape, which contains $S_A$. So we need $S_A=\langle B\rangle$ and we're done.

The definitions are valid, as we can define $B$ to be a TM that looks upon the tape, finds that it contains a string $s$, calculates $\langle P_s\rangle$, and writes to tape the description of the machine:
> 1. Erase the input.
> 2. Run the TM described by $\langle P_s\rangle$.
> 3. Run the TM described by $s$.

Now $A=P_{\langle B\rangle}$ is also defined properly.
The final definition of the self-printing machine is:
> $SELF$: on input $w$,
> 1. Erase the input.
> 2. Run $A$.
> 3. Run $B$.


### Correctness
After running $A$, the tape contains $\langle B\rangle$. Then $B$ calculates $\langle P_{\langle B\rangle}\rangle=\langle A\rangle$, and prints the description of the machine that first erases the input, then runs $A$, and then runs $B$, which is the description of $SELF$.

## Python Implementation
Implementing the $SELF$ machine in Python requires us to define the Python analogues of TMs and their descriptions.

One way to do so is to define the tape to be a global string variable, and a TM would be a block of code. Running the TM is equivalent to running the code block, and it writes and reads from the tape variable to produce its output and read its input.

Further, the description of a TM becomes the *code* it executes. A description of a Python code block is a string that one may print and the result is the code. Or, a string that one may evaluate using `eval`, resulting in the execution of the code.
### Implementing $B$
First comes the code block for $B$, which in our setting is a Python code block that looks at the tape, calculates the description of the code block that prints it, and writes to tape the calculated string and then the original string, and finally makes a `print(tape)` so we may see the result. (It also erases the tape beforehand.)

```python
# code for B
desc_B = output_buffer # printing this prints this code block
desc_A = f"output_buffer={repr(desc_B)}" # printing this prints As code block
# erase buffer ; run A ; run B ; print tape
output_buffer = f"output_buffer=\"\"\n{desc_A}\n{desc_B}\nprint(output_buffer)"
```
We use `repr` because we need to get a string that can be used to initialize a string variable holding the same value as `desc_B`. `repr` is a function that takes a variable $x$ and returns a string that can be executed to create an instance of the variable with the same value. That is, when printing `repr(x)` the result is a line of code that can be executed to initialize $x$.

Think of what would happen if we were to 1) remove `repr`, and 2) remove `repr` but add single quotes around the right side of the equation (note what happens when `desc_B` contains whitespaces).

### Implementing $A$
Recall that $A$ is a code block that sets the tape to the description of $B$. To do so we simply take the code of $B$ from above, and calculate its `repr`.

This is done by hand as such: remove the whitespaces - newlines and tabs - and replace them with their descriptions `\n` and `\t` respectively, and replace any `\` character with `\\`. Then printing the resulting string brings forth exactly the code of $B$.

```python
# code for A
output_buffer='desc_B = output_buffer\ndesc_A = f"output_buffer={repr(desc_B)}"\noutput_buffer = f"output_buffer=\\"\\"\\n{desc_A}\\n{desc_B}\\nprint(output_buffer)"'
```

### $SELF$ - The Final Script
```python
output_buffer=""  
output_buffer='desc_B = output_buffer\ndesc_A = f"output_buffer={repr(desc_B)}"\noutput_buffer = f"output_buffer=\\"\\"\\n{desc_A}\\n{desc_B}\\nprint(output_buffer)"'  
desc_B = output_buffer  
desc_A = f"output_buffer={repr(desc_B)}"  
output_buffer = f"output_buffer=\"\"\n{desc_A}\n{desc_B}\nprint(output_buffer)"  
print(output_buffer)
```
