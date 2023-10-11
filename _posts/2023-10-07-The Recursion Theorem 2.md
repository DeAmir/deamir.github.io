---
title: The Recursion Theorem 2
date: 2023-10-07
categories:
  - Computability Theory
tags: 
math: true
---
How can a TM call itself - and use recursion?
Recall the meaning of "calling" a TM from inside another TM: a TM $A$ calls TM $B$ on input $w$, by simulating the machine $B$ on input $w$. To do so, $A$ should have access to the description $B$, and then use that description to simulate the other machine on the chosen string.

## The Recursion Theorem: Final Version
Therefore, for a TM to call itself, it should have access to its own description. Then, making a recursive call amounts to simulating the same machine on the desired input.

The Recursion Theorem shows us how:

> Given a TM $T$ that computes a function $t:\Sigma^\*\times \Sigma^\*\rightarrow\Sigma^\*$, there exists a TM $R$ that computes the function $r(w)=t(w,\langle R\rangle)$. \
> $R$ first calculates $\langle R\rangle$ and then runs $T$ on $w\text{#} \langle R\rangle$.

The proof is constructive, which enables the creation of recursive TMs.

Then, for example, if we wish to craft a TM that calculates Fibonacci numbers recursively, we need to define $T$ as:
> $T$: given $\langle M\rangle, n$,
> 1. If $n=0,1$ write $1$ to tape and finish.
> 2. Simulate the machine $M$, using the description $\langle M\rangle$, on $n-1$ and $n-2$.
> 3. Write to the tape the sum of the two results.

The theorem will show us how to make a machine $R$ that sets $\langle M\rangle=\langle R\rangle$. That way, the calls in step 2 are recursive.

## Proof
The TM $R$ is composed of three parts, each carried out by a dedicated TM: $A, B$ and $T$.

The proof is similar to the SELF-printing machine (see the previous post), but this time we need to keep the given input, and not simply erase the tape. That's because the original tape contents $w$ will be a parameter of the call to $T$.

For this reason, we define $AP_s$ to be the TM that appends the string $\text{#}s$ to the existing tape contents and finishes.

**Construction:**
1. $A$ is set to $AP_{\langle BT\rangle}$ - the machine that appends the description of the last 2 steps to the existing tape. The tape after $A$ finishes contains $w\text{#}\langle BT\rangle$.
2. $B$ - will get the part of the tape before and after the #, denote $b$ and $e$ resp. We assume $e$ to be a valid representation of a TM (which is true by definition of $A$, but to avoid confusion we may simply check that and finish if it's not).
	Then calculate $\langle AP_{e}\rangle$.
	Change the contents of the tape to: $w\text{#}\langle AP_ee\rangle$. (Recall that $e$ is a TM representation.)
3. $T$ - run on the given tape. (Assume that its parameters are separated by #.)

These definitions are proper because the definitions of $B$ and $T$ don't rely on $A$'s definition. Then $A$ is also defined properly.

Let's see why the construction works by running the machine $R$:
1. Before $A$, the tape contains $w$.
2. $A$ runs and appends $\langle BT\rangle$ to the tape, resulting with the tape being $w\text{#}\langle BT\rangle$.
3. $B$ runs, it calculates $\langle P_{\langle BT\rangle}\rangle=\langle A\rangle$, combines it with 2+3 to get $\langle ABT\rangle=\langle R\rangle$. Then it makes the tape contain $w\text{#} \langle R\rangle$.
4. $T$ runs on the tape $w\text{#}\langle R\rangle$, resulting with output $t(w,\langle R\rangle)$.

## Python Implementation
We implement the machine $R$ that calculates Fibonacci numbers recursively. We begin by implementing $T$ and $B$, and then $A$. After that, $R$ would be the stacking of the code blocks of $A, B$ and $T$ one after the other.

### Implementing $T$
We already implemented $T$, as a TM. A python version is:

```python
# Tape on input: w#<M>  
first_sharp = tape.find('#')  
w, fib_rep = tape[:first_sharp], tape[first_sharp+1:]  
w = int(w)  
if w==0 or w==1:  
    tape='1'  
# make "recursive" calls   
else:  
    # call on w-1 
    tape = str(w-1)  
    ns = {}  
    ns.update(globals())  
    exec(fib_rep, ns)  
    f1 = int(ns['tape'])  
    # call on w-2  
    tape = str(w-2)  
    ns = {}  
    ns.update(globals())  
    exec(fib_rep, ns)  
    f2 = int(ns['tape'])  
  
    tape = str(f1+f2)
```

It first gets the parts of the input: the input number $w$, indicating the index of the Fibonacci number to calculate, and a TM description, that'd later be replaced with the description of the final machine.

Then, if we aren't in the base case, we make the 2 needed recursive calls. They are done by replacing the tape contents with $w-1$ and $w-2$ resp., and then running the code described by the second parameter fetched. We need to be careful when running the given code block - we need to run the new code in a separate namespace, that will use a separate set of variables separate from the ones in the code. This is the dual of not letting a simulated TM underflow the tape into the territory of a host TM, when simulating a TM inside of another.

### Implementing $B$
Recall that $B$ is the function that calculates the whole description $R$ and then sets the tape to $w\text{#} \langle R\rangle$.
```python
# Tape on input: w#BT  
first_sharp = tape.find('#')  
w, BT = tape[:first_sharp], tape[first_sharp+1:]  
# make A=AP_BT  
A = f"tape=tape+'#'+{repr(BT)}"  
# make R=ABT  
R=f"{A}\n{BT}"  
# make tape = w#R  
tape = w + '#' + R
```

### Implementing $A$
The easy-to-comprehend implementation for $A=AP_{BT}$:
```python
# Tape on input: w
B_rep = "first_sharp = tape.find('#')\nw, BT = tape[:first_sharp], tape[first_sharp+1:]\nA = f\"tape=tape+'#'+{repr(BT)}\"\nR=f\"{A}\\n{BT}\"\ntape = w+'#'+R"  
T_rep = "first_sharp = tape.find('#')\nw,fib_rep = tape[:first_sharp], tape[first_sharp+1:]\nw=int(w)\nif w==0 or w==1:\n\ttape= '1'\nelse:\n\ttape = str(w-1)\n\tns = {}\n\tns.update(globals())\n\texec(fib_rep, ns)\n\tf1 = int(ns['tape'])\n\ttape = str(w-2)\n\tns = {}\n\tns.update(globals())\n\texec(fib_rep, ns)\n\tf2 = int(ns['tape'])\n\ttape=str(f1+f2)"  
tape = tape + '#' + B_rep +'\n'+ T_rep
```
This will work, but the "proper" description would be to take this block and move it to a single line `tape=tape+'#'+'STR'` where STR is the concatenation of `B_rep` and `T_rep`. For further explanation of `repr` and the formatting of strings in Python, see the previous post.

### The Final Script: FIB
```python
tape = '8'  
  
######### A #########
# Tape on input: w
B_rep = "first_sharp = tape.find('#')\nw, BT = tape[:first_sharp], tape[first_sharp+1:]\nA = f\"tape=tape+'#'+{repr(BT)}\"\nR=f\"{A}\\n{BT}\"\ntape = w+'#'+R"  
T_rep = "first_sharp = tape.find('#')\nw,fib_rep = tape[:first_sharp], tape[first_sharp+1:]\nw=int(w)\nif w==0 or w==1:\n\ttape= '1'\nelse:\n\ttape = str(w-1)\n\tns = {}\n\tns.update(globals())\n\texec(fib_rep, ns)\n\tf1 = int(ns['tape'])\n\ttape = str(w-2)\n\tns = {}\n\tns.update(globals())\n\texec(fib_rep, ns)\n\tf2 = int(ns['tape'])\n\ttape=str(f1+f2)"  
tape = tape + '#' + B_rep +'\n'+ T_rep 

######### B #########
# Tape on input: w#BT  
first_sharp = tape.find('#')  
w, BT = tape[:first_sharp], tape[first_sharp+1:]  
# make A=AP_BT  
A = f"tape=tape+'#'+{repr(BT)}"  
# make R=ABT  
R=f"{A}\n{BT}"  
# make tape = w#R  
tape = w + '#' + R
  
# Tape on input: get w#<M>  
first_sharp = tape.find('#')  
w, fib_rep = tape[:first_sharp], tape[first_sharp+1:]  
w = int(w)  
if w==0 or w==1:  
    tape='1'  
# make "recursive" calls  
# call on w-1  
else:  
    tape = str(w-1)  
    ns = {}  
    ns.update(globals())  
    exec(fib_rep, ns)  
    f1 = int(ns['tape'])  
    # call on w-2  
    tape = str(w-2)  
    ns = {}  
    ns.update(globals())  
    exec(fib_rep, ns)  
    f2 = int(ns['tape'])  
  
    tape = str(f1+f2)
 
print('tape=',tape)
```