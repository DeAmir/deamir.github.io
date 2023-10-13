---
math: true
tags: 
categories:
  - Probability
date: 2023-10-13
title: Rejection Sampling - Sampling Discrete Uniform Distributions (1)
---
---
The other day I wondered how computers sample from a discrete uniform distribution over $$n$$ values. The method that straightly came to mind is sampling the necessary amount of random bits and getting a result. Yet, that works only for distributions whose $$n$$s are powers of two.

What about when $$n$$ isn't a power of 2? I took it as an exercise.

This post covers my path to analyze the first solution that came to my mind, which I later discovered is known as *rejection sampling*. It addresses its issues, which motivated me to achieve another solution, that's covered in the next post.

## Problem Definition
We are given a natural number $$n$$ and a random bit oracle. A call to the oracle takes constant time. The problem is to sample uniformly from the set $$[n]=\{ 1,...,n \}$$. Note that the sole source of randomness is the random bit oracle.

A solution is an algorithm (*sampler*), that gets $$n$$ as input, uses the random bit oracle, and returns a number from $$[n]$$, chosen uniformly.

## What Makes a Good Sampler?
A sampler is judged by its runtime complexity and the amount of random that it uses.
1. A good sampler should be fast.
2. A good sampler should use a small number of random bits. Crafting quality random bits can be costly, and we shouldn't waste too much of them.

When assessing the quality of the complexity of a certain sampler, what should be the benchmark that we shall compare it to?

We will use the trivial solution for powers of 2 as the benchmark. It would be good if we were to find a solution that achieves similar complexities as the ones for a simpler problem. 

Another justification is information-theoretic: we sample a random variable whose entropy is $$\log n$$. Therefore we'd want that in expectation we make, as close to as possible, $$\log n$$ random coin flips.

We will compare the complexities both asymptotically and in a fine-grained fashion that keeps the multipliers inside the big-O.


## Rejection Sampling

Given that $$n$$ isn't a power of 2, we can't use the trivial solution that samples $$\log n$$ bits. But we can sample $$\lceil \log n\rceil$$ bits.
When we do so, we sample a number from the set $$[2^{\lceil \log n\rceil} ]=\{1,...,n,...,2^{\lceil \log n\rceil}\}$$. Then, if that number isn't in $$[n]$$, we can resample until we do get a number in $$[n]$$.

The algorithm only outputs numbers in $$[n]$$ and does so uniformly. It's easily shown via symmetry.

Hence it's a sampler. Let's analyze it.

## Analysis of Rejection Sampling
### Runtime
The running time of the sampler depends on the number of trials it needs to make until it samples a number inside $$[n]$$. Therefore we shall analyze the expected running time.

Each sample taken from $$[2^{\lceil \log n\rceil}]$$, is conducted via $$\lceil \log n\rceil$$ calls to the random bit oracle. Since each call takes constant time, such a sample takes $$\lceil \log n\rceil$$ time. Such time is also what it takes to check whether the sampled number is in $$[n]$$. So each trial takes $$2\lceil \log n\rceil$$ time.

Let $$X$$ be the random variable that's the number of samples of $$\{ 1,...,n,...,2^{\lceil \log n\rceil}\}$$ the algorithm makes. Then, the running time is $$2X\lceil \log n\rceil$$.

Note that $$X$$ is a geometric random variable - we conduct independent trials, each being: uniformly sample a number in $$[2^{\lceil \log n\rceil}]$$, and the trial is successful if the sampled number is in $$[n]$$. 

What's the probability of a success? Because $$n$$ isn't a power of 2, the probability of success $$p$$ should be at least half. Look at the set from which we sample, and remember that $$n$$ isn't a power of 2:


$$
[2^{\lceil \log n\rceil}]=
\{
\underbrace{1,...,2^{\lceil \log n\rceil-1},...,n}_{[n]},...,2^{\lceil \log n\rceil}
\}
$$


Because $$2^{\lceil \log n\rceil}=2\cdot 2^{\lceil \log n\rceil-1}$$, and $$n$$ is strictly to the right of $$2^{\lceil \log n\rceil -1}$$, we get that $$p=[n]/2^{\lceil \log n\rceil}>1/2$$.
Therefore, $$E[X]=1/p<2$$, and the expected running time of the algorithm is at most  $$2\cdot 2\log n=4\log n$$.

Further note, that when $$n$$ is closer from above to a power of 2, the probability of success decreases, and when $$n$$ is closer from below to a power of 2, the success probability increases. 
We take the worst case, when $$n$$ is exactly one more than a power of two. For large $$n$$, the success probability is very close to half, and the runtime inequality is very close to equality.

### Random Used
The amount of sampled bits is $$X\cdot \log n$$ and in expectation $$2\log n$$.

## Can we do better?
Comparing rejection sampling to regular sampling for powers of 2, we see that it achieves the same asymptotical qualities.

Yet not asymptotically, the runtime is four times that of the trivial sampler and uses twice as much random as the trivial sampler.

### Does constant difference matter? Why asymptotic equivalence isn't enough?
Indeed, when considering a single run of the algorithm, the difference between a running time of $$4\log n$$ and $$\log n$$ is negligible. We probably wouldn't sample a distribution holding more than $$n=2^{1000}$$  values.

That being said, a sampler isn't run a single time, and the analysis should assume that the sampler is deployed and used many times. In this case, the trivial sampler of power of 2 is **four times faster** than a rejection sampler for not powers of 2. If we were to run the samplers many times, those constant multipliers would cause a considerable runtime gap.

The same argument is applied to the number of random bits used. With rejection sampling, we throw away (i.e. don't use) **half of the random bits we sample** (in expectation)!


So rejection sampling is wasting random bits. Is this waste necessary? Are extra $$\log n$$ random bits a bad waste? Can we achieve a solution that doesn't waste random?

The next post explores these questions and more, and covers an approximate solution.