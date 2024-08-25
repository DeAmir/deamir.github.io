---
title: The Intuition Behind Montgomery Multiplication
date: 2024-08-23
categories: []
tags:
  - Computability-Theory
  - Computational-Number-Theory
math: true
---
---

In this post, we will derive the [*Montgomery Modular Multiplication*](https://en.wikipedia.org/wiki/Montgomery_modular_multiplication) method. The goal is to discover its intuitions by constructing it bottom-up, step by step.

In the improbable case that you haven't yet seen the technique, I recommend not looking at it until after this post, so you'll get the rush of discovery! If you're familiar with it, this post may shed some light on the different decisions the technique makes, and reveal the origins of the formula. Let's get started!

## The Goal: Fast Modular Multiplication

Many fields of computer science do modular arithmetic, i.e. arithmetic in the ring $\mathbb{Z}_N$, for a constant $N$. Such arithmetic includes two arithmetic operations: *addition* and *multiplication* modulo $N$. 

Implementing these operations is done using other basic operations over the *integers*, specifically addition, subtraction, multiplication and (Euclidean) division. The division operation is considered slower than the rest, notably for a large modulus.

<details>

<summary>For $0\le a,b<N$, how can we compute $(a+b)\mod N$ using basic integer operations?</summary>

<figure class="highlight">

\[

(a+b) \mod N =

\begin{cases}

a+b & a+b\lt N \\

a+b-N & a+b\ge N

\end{cases}

\]

</figure>

</details>

<details>

<summary>For $0\le a,b<N$, how can we compute $ab\mod N$ using basic integer operations?</summary>

<figure class="highlight">

$$

ab(\mod N) = ab-\left\lfloor \frac{ab}{N} \right\rfloor \cdot N

$$

</figure>

</details>

In some applications, the modulus $N$ is very large, e.g. thousands of bits long. This makes dividing by $N$ over the integers a costly operation (see long division). Of course, this also makes the addition operation more costly, but to a lesser extent. Note that these are *fine-grained* and even *empirical* complexity arguments, not asymptotical ones.

Alas, the trivial modular multiplication method divides by $N$. This gives rise to the following question: *can we do modular multiplication without dividing by $N$*? Interestingly, the answer is yes. ***Montgomery Multiplication*** is one such technique (another famous technique is the [*Barret Reduction*](https://en.wikipedia.org/wiki/Barrett_reduction)).

## The Problem

We are given a ***modulus*** $N$, and two ***residues*** $$0\le a,b \lt N$$. 

We wish to compute $ab\mod N$.

Computing $ab$ over the integers is easy, so we may approach the problem by first multiplying over the integers, and then ***reducing*** the product modulo $N$. If we manage to efficiently reduce the product, it's game over.

The product is in the interval $[0,N^2-2N+1]$. So our updated problem is: given an integer in $[0,N^2-2N+1]$, reduce it modulo $N$.

Before we go on, let's talk a bit about the sizes of the integers: given that $N$ is represented by $k=\lfloor \lg N \rfloor+1$ bits, the inputs $a$ and $b$ are each $k$-bit long, and their product $2k$-bit long. Hence the products are $2k$-bit long, and should be reduced to $k$-bit long residues.

## Motivation: Division by $2^i$ with Odd Modulus

### Modular Division by 2 Is Easy!

We put our goal aside for a bit, and note a simple fact: if the modulus is odd, multiplication by the modular inverse of 2 modulo N is very easy.

<details>

<summary>Why should $N$ be odd?</summary>

<figure class="highlight">

Because only in this case $2$ is invertible modulo $N$.

</figure>

</details>

<details>

<summary>Exercise: Given $x\in \mathbb{Z}_N$ for odd $N$, efficiently compute $x\cdot (2^{-1})\mod N$</summary>

<figure class="highlight">

If $x$ is even, then it's simply $x/2$. Otherwise, $(x+N)\equiv _N x$, and $x+N$ is even and $(x+N)/2\in \mathbb{Z}_N$ is the answer. 

The used operations are division by 2 (equivalent to a shift right), and integer addition.

</figure>

</details>

This technique works for integers in $[0,N-1]$. But what about a larger integer? In such case, the computed value is congruent to $x(2^{-1})\mod N$, but isn't necessarily a residue - it may be larger than $N-1$.

We note that when $x$ is even, the result is strictly smaller than $x$, and when it's larger, the result is strictly bigger than $x$. We may hope that if we repeat dividing by 2, the result will get smaller and smaller until it's small enough that we can reduce it efficiently. 

Although this hope is merely a hunch and on second thought wrong, it seems to me intriguing to see what happens when we do that.

Say that we divided by 2 in the above manner $i$ times and got to an integer $m$. Then $m\equiv _N x2^{-i}$. If $m\lt kN$ where $k$ is small and known to us, we could simply repeatedly reduce $m$ by $N$ until reaching $m\lt N$. If $k$ is small enough, we can do that efficiently and end up with $x2^{-i}\mod N$. And maybe, we could analyze the form of this division series, and get some insights that could come to our aid.

<details>

<summary>Question: Why don't we simply compute the relevant multiple of $N$, and reduce that from $m$ to get a residue?</summary>

<figure class="highlight">

Because it's exactly the computation we want to avoid: the long division of some value ($m$) by $N$. Instead, we "stupidly" subtract by $N$ until reaching a residue.

</figure>

</details>

How can we compute $x(2^{-i})\mod N$ efficiently? Can it be done for every $i$? Do we even need it to be for every $i$? How this relates to our original reduction problem will be clear soon, I promise. But now we'll side-quest into this second problem, for the sake of it.

### Efficiently computing $x(2^{-i})\mod N$

We'll try to find some $i$ such that computing $a(2^{-i})\mod N$ for every $a\in [0,N^2-2N+1]$ is easy. We start with some general $i$ and see what we need.

We do the repeated division described above: we get an integer $c$, if it's even we continue with $c/2$ and otherwise with $(c+N)/2$. We start with $a$. Let's analyze the form of this series. We first define that series, $(b_i)$:

$$

b_0=a

$$

$$

b_{i+1}=

\begin{cases}

\frac{b_i}{2}, & b_i\ \text{even} \\

\frac{b_i+N}{2}, & b_i \ \text{odd}

\end{cases}

$$

<details>

<summary>Exercise: find the general form of $b_i$, w.r.t. $a$, $N$, and $i$.</summary>

<figure class="highlight">

The general form is, over the integers:

$$

b_i=\frac{a+\lambda _i N}{2^i}

$$

where $\lambda _i$ is the number of odd integers in $b_0,...,b_{i-1}$.

</figure>

</details>

Looks good. We recall that $b_i$ is only *congruent* to $x(2^{-i})\mod N$, and not necessarily a residue.

Let's try to squeeze out some more juice from this form: let's find $\lambda _i$. By the previous identity,

$$

\lambda _i = \frac{b_i2^i-a}{N}

$$

Denote $R_i:=2^i(\mod N)$ and $S_i=R_i^{-1}(\mod N)$, i.e. $0\le S_i,R_i \lt N$.

Now a seemingly good idea is to represent $b_i$ as something plus a multiple of $N$, so things cancel out nicely. We use the fact that $b_i \equiv_N aS_i$ and write: 

$$b_i=aS_i+\beta_i N$$

There's a subtle point here: this representation isn't the representation of the division theorem, $aS_i$ may not be a residue. But this is merely a consequence of the identity $b_i-aS_i=0(\mod N)$.

Then, plugging that into the first identity of $\lambda _i$, we have the following identity over the integers:


$$
\lambda _i = \frac{aS_i2^i-a}{N}+\beta_i2^i=a\frac{S_i2^i-1}{N}+\beta_i2^i
$$

Looks good, we got a better form, but we don't stop here! We denote $a$s multiplier by $\gamma_i:=\frac{S_i2^i-1}{N}$, and finally:

$$
\lambda_i = a\gamma_i+\beta_i2^i
$$

We plug that back into the identity relating $b_i$ and $\lambda _i$, and get:

$$

b_i = 

\frac{a+(a\gamma_i)N}

{2^i}

+\beta_iN

$$

Looks good. We recall that $b_i$ is only *congruent* to $x(2^{-i})\mod N$, and not a residue by fact. We want to reduce $b_i$ modulo $N$, so we may as well begin with ignoring the second term.

$$

b_i\equiv_N \frac{a+(a\gamma_i)N}

{2^i} 

$$

Whooo, we came a long way, but look at that: the right-hand side is easy to compute! Wait, but why is that?

<details>

<summary>Exercise: show that the above equation holds when using $\hat{\gamma_i}:=\gamma_i(\mod 2^i)$ instead of $\gamma_i=\frac{S_i2^i-1}{N}$</summary>

<figure class="highlight">

As $\gamma_i=\hat{\gamma_i}+q2^i$, the term $q2^i$ doesn't change the modulo result: it gets multiplied by $N$ and divided by $2^i$, resulting in the addition of a multiple of $N$ to the final result.

</figure>

</details> 

<details>

<summary>Exercise: efficiently compute $\hat{\gamma_i}$</summary>

<figure class="highlight"> 

Starting with $\gamma_iN=S_i2^i-1$, we reduce both sides modulo $2^i$ and get $\hat{\gamma_i}(N\mod 2^i)\equiv_{2^i} -1$. As $0\le \hat{\gamma_i}\lt 2^i$ and $2^i$ and $N$ are co-prime, $\hat{\gamma_i}$ is the only solution to the equation $x(N\mod 2^i)\equiv_{2^i} -1$, which we can efficiently compute using the Euclidean Algorithm.

</figure>

</details>

The updated formula is:

$$

b_i\equiv _N \frac{a+(a\hat{\gamma_i})N}{2^i}

$$

Now we see that: the right-hand side is easily computable - these are only a multiplication, addition and division by a power of 2, all over the integers.

Now we only need to make the right-hand side small enough so we could iteratively subtract by $N$, and finally get to its residue. Now we use the coolest argument in this technique, which we already discovered: the factor that multiplies $N$ could be reduced modulo $2^i$. Every additive term that's a multiple of $2^i$ in $(a\gamma_i)$ is multiplied by $N$ and divided by $2^i$, which results in an additive term that's a multiple of $N$, which keeps the modulo. This reduces the numerator of the RHS, giving a smaller value - a step in the right direction!

So instead of $(a\hat{\gamma_i})$ we reduce modlo $2^i$ and replace it with $((a\mod 2^i)\hat{\gamma_i}\mod 2^i)$:

$$

b_i\equiv_N \frac{a+((a\mod 2^i)\hat{\gamma_i}\mod 2^i)N}{2^i}

$$

The inner reduction was done to reduce the input size of the inner multiplication, at zero cost.

<details>

<summary>Question: Why didn't we take an additional modulo on $\hat{\gamma_i}$, i.e. replace with $(a\mod 2^k)(\hat{\gamma_i}\mod 2^k)\mod 2^k$?</summary>

<figure class="highlight">

Because we already did that, by the definition of $\hat{\gamma_i}$. Only then, we did that with a different goal in mind - efficient computation of it.

</figure>

</details>

<details>

<summary>Question: why is it easy to reduce modulo $2^i$?</summary>

<figure class="highlight">

Because it's simply taking the $i$ least significant bits of the number.

</figure>

</details>

We're almost there! We want the RHS side to be "only a few subtractions of $N$ away". The ideal value is just one :) To see how to reach that, we first analyze the magnitude of the RHS.

The numerator is at most $a+2^iN$, and the RHS is at most $\frac{a}{2^i}+N$. For it to be at most one subtraction away, we need $a/2^i\lt N$, i.e. $2^i>a/N$. Because $N^2\gt a$ we can solve for $2^i\gt N^2/N=N$, which yields

$$

i>\lg N

$$

Finally, it's time to choose a value for $i$. As $N$ is odd, the RHS isn't integral, and we set the smallest $i$ possible: ladies and gentlemen, I hereby proclaim

$$i=\lceil \lg N \rceil $$

<details>

<summary>Question: Why take the smallest $i$? Where is it used?</summary>

<figure class="highlight">

The value $i$ is used both in the calculation of $\hat{\gamma_i}$ and in the calculation of $b_i$ - as a modulus and as a divisor. Bigger values aren't needed and come at a performance cost.

</figure>

</details>

Let's take a look at the final formula, now that we have everything figured out. Let $k:=\lceil \lg N \rceil$ be the number of bits in the binary representation of $N$. 

The ***Montgomery Reduction*** modulo $N$ of $0\le a\le (N-1)^2$ is defined as

$$

aS_{k} (\mod N) = \frac{a+((a\mod 2^k)\hat{\gamma_k}\mod 2^k)N}{2^k},

$$

for $S_k=2^{-k}\mod N$, $\hat{\gamma_k}=(-1)\cdot (N\mod 2^k)^{-1} (\mod 2^{k})$. Wonderful! We note that $\hat{\gamma}$ can be computed as a preprocessing step. We summarize what we got: given a number $a\in [0,N^2-2N+1]$, we can efficiently calculate $a(2^{-k})\mod N$.

This is insane - reducing in itself seems hard, but we somehow managed to both multiply $a$ by something, as well as reduce the result - more efficiently than only reducing!

## Montgomery Reduction: Analysis

<details>

<summary>Question: what operations are involved in the computation? On what bit-sizes does each operate?</summary

>

<figure class="highlight">

1) Taking $k$ least significant bits (LSBs) of a $2k$-bit integer, 2) multiplication of two $k$-bit integers, 3) taking the $k$ LSBs of a $2k$-bit integer, 4) multiplication of two $k$-bit integers, 5) addition of two $2k$-bit integers, 4) Shift right $k$ bits of a $2k+1$-bit integer.

</figure>
</details> 
Because we consider the time it takes to execute shifts and take LSBs as negligible compared to addition and multiplication, we ignore them. Denote by $A(n)$ and $M(n)$ the time it takes to add and multiply two $n$-bit values respectively. Then the algorithm runs in $A(2k)+2M(k)$ time.

This is already better than the naive algorithm for computing $a(2^{-k})\mod N$. Recall that $S_k=2^{-k}(\mod N)$, and that the naive algorithm computes the result as $aS_k - \lfloor aS_k/N \rfloor\cdot N$.

<details>

<summary>Question: What's the running time for the naive algorithm? </summary>

<figure class="highlight">

We start with a product of $2k$- and $k$-bit integers, which takes $M(2k)$ time. This results in a $3k$-bit integer. Then we reduce it modulo $N$ by first dividing it by $N$ at cost $Div_N(3k)$, getting an approximately $2k$-bit value. Then we multiply it by a $k$-bit value at $M(2k)$ time and finally subtract it from $a$ at $A(3k)$ time. So in total, we run at $M(2k)+Div_N(3k)+M(2k)+A(3k)=2M(2k)+Div_N(3k)+A(3k)$.

</figure>

</details>

Compared to $2M(k)+A(2k)$, we're pretty good! Especially if we consider division by $N$ to be costly. You might be saying, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA great, but this is an algorithm to modularly multiply a number by a constant, what about general multiplication?", and you're right. This comes right up...

## What can we do with this?

Recall what we've conjured: an oracle that given a number $0\le x\lt N^2-2N+1$, efficiently computes $xS(\mod N)$ for $S=R^{-1}(\mod N),R=2^k(\mod N)$. Our original goal was to compute the modular product of two residues. If we have two residues $a$ and $b$, their product $ab$ falls into the oracle input domain. So a natural thing to try is to feed the oracle this value. It's result is $abS\mod N$.

This extra $S$ factor breaks the form of the residues. But what if we were to alter the form of the residues before computing the product? Is there some residue form $f:\mathbb{Z}_N\rightarrow \mathbb{Z}_N$, that given the forms of two residues $f(a)$ and $f(b)$, the output of the oracle $f(a)f(b)S$ is the form of the product of the two $f(ab\mod N)$?

The answer is yes: the ***Montgomery Form*** of a residue $x$ is $f(x)=xR(\mod N)$. Given two residues in montgomery form $aR$ and $bR$, we can compute their integer product $abR^2$, and do a montgomery reduction that results with $abR^2S(\mod N)=abR(\mod N)$ - the montgomery form of the product!

We denote by $\mathbb{Z}_N^{\*}$ the montgomery space. We've essentially proved that we can multiply efficiently in $\mathbb{Z}_N^*$, where multiplication is a special operation we denote $\*$ that's $a\* b:= abS\mod N$. We can also trivially add efficiently in this space.

So $\mathbb{Z}_N^{\*}$ is a *ring* over the operations $(+,\*)$. The form conversion function $f(x)=xR(\mod N)$, is a *ring isomorphism* between the regular modulo ring $\mathbb{Z}_N$ and the montgomery space $\mathbb{Z}_N^{\*}$. It can be proven using the fact that $R$ is invertible modulo $N$.

Finally, we see some progress with our original problem: given two residues $a$ and $b$, we could get their montgomery form, multiply them in montgomery space, and go back and fetch the represented residue. But there's more to that: what if we have more multiplications to do relative to the conversions? For example, when computing $a^j\mod N$? We can simply convert the initial values to montgomery form, carry out efficient computations in montgomery space, and retrieve the results only once required, and only the ones we need.

But wait a minute: computing the forward and backward transformations involves reducing modulo $N$. Even if we were to compute these transformations inefficiently, it may be the case that those will get negligible if we make more multiplications than conversions. And yet, even these two computations can be optimized...

<details>

<summary>Question: How can we efficiently compute $aR\mod N$ and $aS\mod N$ using a Montgomery Reduction? </summary>

<figure class="highlight">

The forward transformation can be computed as the montgomery multiplication between $a,R^2(\mod N)\in \mathbb{Z}_N^{*}$ as $aR=aR^2R^{-1}(\mod N)$.

The backward transformation is similarly computed - given a montgomery form $x=aR$, do a montgomery reduction on $x$, whose result is $xS=aSR=a(\mod N)$.

</figure>

</details>

And that's it for montgomery multiplication. To summarize: to multiply two residues modulo $N$, we compute their montgomery forms, multiply in montgomery space, and compute the result's respective residue. All these operations are implemented using the montgomery reduction and include zero divisions by $N$, which are cleverly replaced with divisions and reductions modulo a power of 2.

## Summary

Montgomery multiplication is a more general method, that replaces division by $N$ with reduction and division by some $R$ that's co-prime to $N$. This post covered a specific case of it - for odd $N$ and $R$ a power of 2.

Many applications compute over an odd modulus, but what about an even modulus? In this case, we could use a different $R$. But for this to work well, division and modular reduction by $R$ should be efficient relative to division by $N$. Because of the way computers are built, there aren't better choices for $R$ than a power of two.

That being said, it's a good exercise to work out the derivation of the general form.

We've seen that montgomery multiplication originates from a simple argument about dividing by 2 in an integer ring with an odd modulus. Then we've seen how it gives us a method to compute a product and reduction at the same time efficiently, $a(2^{-k})\mod N$, given a large integer $a$. Then we found how we can utilize this oracle to compute products in $\mathbb{Z}_N$, without division by $N$.