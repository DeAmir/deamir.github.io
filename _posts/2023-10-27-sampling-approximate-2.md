---
math: true
tags: 
categories:
  - Probability
date: 2023-10-14
title: Approximating Uniform Distributions with Random Bits - Sampling Discrete Uniform Distributions (2)
---
---
The other day I wondered how computers sample from a uniform discrete distribution over $$n$$ values. The method that straightly came to mind is sampling the necessary amount of random bits. Yet, that works only for distributions whose $$n$$s are powers of two.

The previous post on *Rejection Sampling* addressed the first solution that came to my mind. To recap, this solution involves repeatedly sampling $$\lceil \log n\rceil$$ bits, rejecting samples that fall out of $$[n]$$, until such a number is reached.

This method is costly in the amount of random that it uses, and in expectation throws away (i.e. doesn't use) half of the bits it samples. It also runs 4 times slower than the trivial sampler for $$n$$ power of 2.

This raises the question: can we waste less random to achieve our goal?

 Recall that the amount of random that a rejection sampler uses varies and is random, as it depends on the number of trials it makes until successfully sampling a number in $$[n]$$.\
To try and solve this problem, I thought a good idea would be to explore the opposite type of samplers: *constant-random samplers*. These are samplers that always use the same number of random bits. That way we can guarantee that this constant number of random bits is **always** lower than the alternative expected bits usage $$2\log n$$, of a rejection sampler.

Can constant-random samplers sample perfectly a uniform distribution? If not, can an approximate distribution be achieved? Can it be done efficiently, with a small number of extra coin flips apart from $$\log n$$? What's even a *good* approximation of the uniform distribution?

This post explores the path I went through, to resolve these questions.
### Problem Definition & Basic Properties
We have a natural number $$n$$ **that's not a power of 2.**\
An  $r$-*constant-random sampler* is an algorithm that samples exactly $$r$$ random bits and returns a number in $$[n]$$. This is equivalent to an algorithm that takes as input $$r$$ bits and returns an output in $$[n]$$.

Therefore, a *constant-random sampler* $$S$$ is an algorithm that computes a function from $$r$$ random bits to $$[n]$$: 

$$s:\{ 0,1\}^r\rightarrow[n]$$

Now we may look at *the distribution induced by $$S$$*, denoted $$dist(S)$$, as the following distribution over $$[n]$$: the probability of $$i\in [n]$$ is the probability that $$r$$ random bits are mapped to $$i$$ by $$s$$.

$$
\Pr [i]=\frac{|s^{-1}(i)|}{2^r},\ \ \  i=1,...,n
$$

Note the following properties:

**No matter how we define $$r$$ and $$S$$, the distribution $$dist(S)$$ differs from uniform $$U([n])$$.** We can't achieve the uniform distribution over $$[n]$$, using a constant-random sampler, no matter how many bits we flip, and regardless of how we map them to a result in $$[n]$$. \
That's because if we were to induce the uniform distribution, for all output pairs, $$|s^{-1}(i)|=|s^{-1}(j)|=c>0$$, for some constant $$c\in \mathbb{N}$$, and


$$
1=\sum \Pr [i]=2^{-r}\sum |s^{-1}(i)|=2^{-r}\cdot nc
$$


Therefore, $$2^r$$ is a positive multiple of $$n$$, and $$n$$ must be a power of 2 (consider the decomposition into prime factors). Contradiction.

**We must approximate.** We need a way to quantify how far $$dist(S)$$ is from uniform. Then we want that given $$n$$, we may choose $$r$$ s.t. the distance from uniform is arbitrarily small. So $$r$$ is a function of $$n$$ and the wanted quality of our approximation.

Therefore we introduce another parameter, $$\epsilon$$, that controls how far we are from uniform. Given $$n$$ and $$\epsilon$$, we should be able to offer a constant-random sampler whose distribution is $$\epsilon$$-close to the uniform distribution over $[n]$.\
So given $$n$$ and $$\epsilon$$, we give a constant-random sampler that uses $$r=f(n,\epsilon)$$ random bits for a later defined function $$f$$, whose distribution is $$\epsilon$$-far from $$U([n])$$.


**We need at least $$\lceil \log n\rceil$$ bits, to achieve an arbitrarily good approximation for fixed $$n$$**.  
1. The ability to create an arbitrarily good approximation, induces the ability to create a distribution with an entropy arbitrarily close to the entropy of $$U([n])$$, which is $$\log n$$.
2. If we look at the distribution of a random sampler $$S$$ with $$r$$ bits, it is a function of the uniform distribution over $$F_2^r$$. Therefore, the entropy of $$dist(S)$$ is at most $$r$$, the entropy of $$U(F_2^r)$$.
3. Hence, if $$r<\lceil \log n\rceil$$, the entropy difference between the distribution that we aim for $$U([n])$$and the distribution that we have $$dist(S)$$ is at least $$\log n-(\lceil\log n\rceil-1)>0$$.
4. For fixed $$n$$, this difference is constant. If we define distribution distance appropriately, there is some small $$\epsilon$$ for which the distribution difference is so small, that it yields an entropy difference smaller than $$\log n-(\lceil\log n\rceil-1)$$. Therefore, for such $$\epsilon$$, and smaller epsilons, the number of random bits used $$r$$ must be at least $$\lceil \log n\rceil$$.

Now we'll see the constant-random sampler that I looked into.

### Approximation via Partitioning $$[0,1]$$ into Bins
#### The Partitioning
One way to make an $$r$$-constant-random sampler is to split the interval $$[0,1)$$ into $$n$$ consecutive and contiguous subintervals of the same length, and then use $$r$$ bits to approximate a continuous uniform variable over $$[0,1)$$. We denote
$$
[0,1)=B_1 \cup ...\cup B_n=[0,1/n)\cup [1/n,2/n)\cup...\cup [(n-1)/n,1)
$$.
![bin partitioning](/assets/img/approximatingUniform/bin_partitioning.png)
_Bin partitioning for $n=7$_

And then if we were to sample a uniform variable over $[0,1)$, the outcome would fall in exactly one $B_i$, and we return $$i$$.
How do we approximate $$U([0,1))$$ using $$r$$ bits? We sample a random $$r$$-bit number, that is, a random number in $$0,1,...2^r-1$$, and divide it by $$2^r$$.

This mapping from $$r$$-bit numbers to values in $$[0,1)$$, yields a "dotting" of the interval $$[0,1)$$, with $$2^r$$ dots being $$0,\frac{1}{2^r}, \frac{2}{2^r},...,\frac{2^r-1}{2^r}$$. Sampling $r$ random bits amounts to choosing a random dot.

![bin partitioning](/assets/img/approximatingUniform/dotting.png)
_Dotting of interval $[0,1)$, for $r=4$_
Then, combined with our partitioning of the interval into $$n$$ subintervals, we have the following figure:

![bin partitioning](/assets/img/approximatingUniform/part_and_dot.png)
_Partitioning and Dotting of $[0,1)$, with $n=7$ and $r=4$_

Then, our sampler works as such: choose a dot randomly using $$r$$ random bits, find the subinterval it falls within, and return its index.

Of course, if we want each outcome in $[n]$ to have a positive probability, each bin should include at least one dot. Therefore, we must have num-dots=$2^r\ge n$ and therefore $r\ge \lceil \log n\rceil$, which fits with what we said previously.

As shown before, this cannot yield the uniform distribution over $$[n]$$. That means some subintervals contain different numbers of dots. But note that what matters is the difference in the probability - which is the difference of the number of dots **w.r.t. the total number of dots**.  A justification could be that a difference $$\delta$$ in the number of dots inside two bins yields a probability difference $$\delta /2^r$$. If that's very small, the probabilities of the two bins are very close, and the distribution acts very like random on the two outcomes.

So the quality of our sampler is defined by the dot count differences, w.r.t. the total number of dots. We next show that $\delta$ is very small, and in fact at most 1, for any two bins.

#### Bin-Pair Dot Count Difference $\leq 1$
We will prove a stronger claim: the number of dots within two intervals $[a,b),[c,d)\subset[0,1)$ of length $1/n$, doesn't differ by more than 1. Then we can set them to any two bins. Assume the first interval is to the left of the second, i.e. $b<d$.\
We'll show their dot-counts differ by at most 1, by sliding left interval $[a,b)$ to the right towards $[c,d)$, and arguing that this process first loses (gains) a dot, and then gains (loses) a dot, and repeats this process until we finally either lose a dot or gain a dot once we reach $[c,d)$.

Let's prove it. We show that when sliding the left interval, we have at most one endpoint being a dot throughout the process.

> For $[a,b)\subset [0,1)$ with length $b-a=1/n$, at most one of $a$ and $b$ is a dot.

**Proof.** If both $a$ and $b$ are dots, we get $b=a+k\cdot 2^{-r}$  for some $k\in \mathbb{N}$, hence $1/n=b-a=k\cdot 2^{-r}$, making $n$ a power of 2, contradiction.

When continuously sliding the interval $[a,b)$, we may look at the current dot set, which contains the dots that fall within the current shifted interval, and the count of these dots. The set of dots changes through this continuous shifting process, as new dots enter through the right side, and leave through the left side. 

{% video /assets/img/approximatingUniform/animate_slide.mp4 824 %}

We start with $[a,b)$ to the left of $[c,d)$. Let's assume that $a$ is a dot. Therefore $b$ isn't a dot, and there's a small delta we can shift $b$ s.t. it's still before the adjacent dot to its right.
When sliding the interval $[a,b)$ to the right, we first lose the dot $a$, but what's next? The distance from $a$ to the next dot to its right is $2^{-r}$, and $b$ isn't a dot. If there's a dot to $b$s right, its distance to it is strictly less than $2^{-r}$. If not, this means the distance from $b$ to 1 is strictly less than $2^{-r}$, so any further **valid** sliding only loses $a$ (we can't slip out of $[0,1)$).

Therefore, if $a$ is a dot, **we first lose** $a$, and if there's any further change to the dot set, the first will be gaining the dot next to $b$. Assuming we actually gained the dot next to $b$, denoted $n(b)$, we shifted $[a,b)$ onto $[a+\delta,n(b))$, and this shift only lost us the dot $a$, every other dot stays inside the shifted interval $[a+\delta,n(b))$. (Note that $n(b)$ isn't in $[a+\delta,n(b))$.)

Now the dual argument follows - we have an interval $[a,b)$ with $b$ a dot, therefore **we first gain** $b$, and then either carry out a dotset-invariant shift onto the target or gain $n(a)$, arriving at $[n(a),b+\delta)$, an interval whose **left** endpoint is a dot. And this is exactly the previous case.

We showed that if we start with $[a,b)$, every +1 to the dot count is followed by -1, and every -1 is followed by +1. If $a$ is a dot, the original dot count in $[a,b)$ is either summed with $(-1+1)+(-1+1)+...+(-1+1)$ or with $(-1+1)+...+(-1+1)-1$, and hence either the count stays the same or decreased by 1. In the case that $b$ is a dot, we similarly keep the dot count or increase it by 1. And finally, in the case that neither $a$ nor $b$ is a dot, we can either dotset-invariantly shift right onto $[c,d)$, or we are closer to losing a dot or gaining a dot, in which case we arrive at an interval with exactly one endpoint, and continue as before.

#### Measuring Difference from Uniform
We need to define what's a *good* approximation. Two ways to do that, which are discussed below, are:

**Pointwise difference from uniform.** A distribution $$dist(S)$$ is $$\epsilon$$-close to uniform if for all $$i=1,...,n$$, we have $$\vert\Pr[i]-1/n\vert<\epsilon$$. This definition looks at every outcome separately.

**Mutual probability difference.** A distribution $$dist(S)$$ is $$\epsilon$$-close to uniform, if for every two $$i$$ and $$j$$, the difference of their probability is less than $$\epsilon$$: $$\vert\Pr [i]-\Pr [j]\vert<\epsilon$$. This definition quantifies the assertion that a distribution is close to uniform, iff the probabilities to get any two outcomes are almost identical.

For each of the distance measures we build $f(n,\epsilon)$. We also show the connection between the two, and their equivalence.

**Note on equivalence**. It can easily be shown that the two notions are equivalent in a black-box fashion using the triangle inequality. Yet, such a proof will induce superfluous use of random, created by the reduction from one problem to the other. As we care for every sampled bit, we show direct equivalence of the two, with direct constructions and comparison of the random each uses.

### Pointwise Difference from Uniform
#### Solving for the number of bits
We are given $n$ not power of 2 and $\epsilon>0$, and need to find the **minimal number of bits** $r$, s.t. the aforementioned constant-random sampler, is $\epsilon$-close to uniform via pointwise difference.

Denote $c_i$ to be the number of dots inside the $i$th bin $B_i$. For each $i\in [n]$, the probability to get $i$ is 

$$
\Pr [i]=\frac{\text{# dots in }B_i}{\text{# dots}}=\frac{c_i}{2^r}
$$

So being $\epsilon$-close via pointwise difference is to have

$$
\begin{align}
\left|\frac{c_i}{2^r} - \frac{1}{n}\right|&<\epsilon\\
\left|\frac{nc_i-2^r}{2^rn}\right|&<\epsilon
\end{align}
$$

We have $2^r=\sum c_j$, and because of the sliding argument, there are $k_j=0,+1,-1$, s.t. $c_j=c_i+k_j$. Hence,

$$
\begin{align}
2^r=\sum_{j=1}^n c_j=\sum_{j=1}^n (c_i+k_j)=nc_i+\sum_{j=1}^n k_j\\
\Rightarrow |2^r-nc_i|=\left|\sum_{j=1}^n k_j\right|\leq n
\end{align}
$$

And we get 

$$
|\Pr[i]-1/n|=\left|\frac{nc_i-2^r}{2^rn}\right|\leq\frac{n}{2^rn}=\frac{1}{2^r}
$$

Making the right side less than $\epsilon$ yields our $r$:

$$
2^{-r}<\epsilon\Rightarrow r>\lg\left(\frac{1}{\epsilon}\right)
$$

Therefore we have $r=\lg \frac{1}{\epsilon}$. If we wish to get an approximation that's relative to $n$, it's of the form $|\Pr[i]-1/n|<\epsilon/n$, and we get $r=\lg n+ \log\frac{1}{\epsilon}$.
Note that as $\epsilon$ is smaller, i.e. we request better approximations relative to $n$, we need to increase the number of bits we sample. Also note, that given a fixed $\epsilon$, the number of random bits we need is the same as the entropy $\lg n$, up to a constant addition.
#### Choosing epsilon, and distinguishing from random
The approximation parameter $\epsilon$ defines the deviation from random. Denote $X$ a Bernoulli variable with success probability $1/n$, and $Y$ a Bernoulli variable with success probability $\Pr[1]$. 

One way to quantify how good our approximation is to ask how easy it is to distinguish it from random, given many sampled numbers in $[n]$. If our approximation is good, an adversary shouldn't be able to distinguish $X$ (true random) from $Y$ (approximate random).

Given the approximation parameter $\epsilon$, the bias, or the difference of success probabilities of $X$ and $Y$ is at most $\epsilon$. Assume that the delta is exactly $\epsilon$ for our chosen $X$ and $Y$.\
A simple distinguisher can distinguish between $X$ and $Y$ in $O(1/\epsilon^2)$ time. Assuming that exponential time in $n$ is intractable for our adversary, we need an appropriate amount of random $r$ for an $\epsilon$ satisfying $1/\epsilon^2=2^n$, i.e. $\epsilon=2^{-n/2}$.

Thus we need $r=\log 2^{n/2}=n/2$ random bits. That is, for "exponential hardness" against the simple distinguisher, we only need to add polynomial work.


### Mutual Difference from Uniform
This distance measure was the motivation for the sliding argument, and its use here is simple and direct.
#### Solving for the number of bits
For $i\ne j$ and $c_i,c_j$ being the number of dots in the $i$th and $j$th bins respectively, we have

$$
|\Pr[i]-\Pr[j]|=\left|\frac{c_i-c_j}{2^r} \right|=\frac{|c_i-c_j|}{2^r}
$$

The sliding argument proved that $|c_i-c_j|\leq 1$, and now forcing $1/2^r<\epsilon$ we get $r=\lg \frac{1}{\epsilon}$. This is exactly the same as the result for pointwise difference.
### Concluding Remarks
We found that approximating the uniform distribution over $[n]$ with random bits, with approximation parameter $\epsilon$, requires $\lg \frac{1}{\epsilon}$ bits.

But if $n$ isn't constant, a constant $$\epsilon$$ wouldn't suffice, as for big $$n$$, even small biases are noticeable. In that case, the approximation parameter needs to be relative to $$n$$ and be of the form $$\epsilon/n$$. In this case, we need $$r=\lg n+\lg \frac{1}{\epsilon}$$ random bits. If we set, for example, $$\epsilon=2^{-300}$$, we get $r=\lg n+300$, that yields 

$$|\Pr[i]-1/n|<\frac{1}{2^{300}n}$$


I found it exciting: even if we make our approximation relative to $n$ at a constant fraction, we spend only an additional constant number of bits $\lg \frac{1}{\epsilon}$, compared to  $\lg n$, the ideal number of bits needed for sampling $U([n])$.

In our case, we spend only 300 extra random bits than ideal, to reach a pointwise probability difference that's at most $2^{-300}$ of the target probability $1/n$! That's, to me, a very small fraction.

I found it incredible because I'd assume that reaching a pointwise difference $1/2^{300}n$ is "harder" for larger $n$ - if $n$ is larger, the pointwise difference is smaller, and we should use more random to enforce the inequalities.

But it turns out that for a constant fraction $\epsilon$ of $1/n$, one pays the same extra random bits $\lg \frac{1}{\epsilon}$ other than the ideal $\lg n$, **regardless of the magnitude of $n$.** So if we say that a pointwise difference of $\frac{1}{2^{300}n}$ is practically the same as random, we reach a suitable approximation of uniform using $\lg n + 300$ random bits, which is better than the $2\lg n$ random bits used on expectation with rejection sampling for large $n$.

Does one actually sample from such large $n$s? I don't know. In our example, it'd mean $n>2^{300}$, which is quite large. But asymptotically, the approximation is more random-friendly. (This comparison isn't purely asymptotical, as we keep constant factors and terms. It's more of a semi-asymptotical comparison.)
