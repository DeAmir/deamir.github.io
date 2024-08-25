---
title: "Public vs Private Randomness: Two Sides of the Same Coin"
date: 2023-11-26
categories: []
tags:
  - Interactive-Proofs
  - Computability-Theory
math: true
---
---
Let's play a game: we start with two graphs, $$G_1$$ and $$G_2$$, both over $$n$$ vertices. Say we label the nodes as $$1,...,n$$.

![iso_graphs](/assets/img/publicCoins/iso_graphs.png)
_Example graphs for $n=4$_

The two graphs are *isomorphic* - denoted $$G_1\sim G_2$$, if there's some one-to-one mapping $$f:[n]\rightarrow [n]$$ between the vertices of the first graph and the second, s.t. after applying the mapping on the labels of $$G_1$$, we get $$G_2$$. Formally, for all pairs of nodes $$v,u\in G_1$$ we have $$\{v,u\}\in E(G_1) \Leftrightarrow \{f(v),f(u)\}\in E(G_2)$$.

![iso_graphs](/assets/img/publicCoins/iso_mapping.png)
_The isomorphism between the graphs: $f(1)=2,f(2)=3,f(3)=4,f(4)=1$_

You and I take different roles: you, the *prover*, should convince me, the *verifier*, that the two graphs aren't isomorphic. I'm weak and constrained by polynomial time computation, so I can't find the solution myself.

So I'll ask you to do the work. I will ask you questions, and you should provide convincing answers. I choose to be convinced that $$G_1\nsim G_2$$ as I wish, and if you convince me, you win.

This is the process I'll go through, asking you 2 questions, both of which you should answer correctly to convince me.
1. I pick a graph randomly $$G_b\in \{G_1,G_2\}$$ (effectively flip a coin). This is called the *source graph*.
2. I select a random permutation $$f$$ of $$n$$ elements.
3. I send you $$f(G_b)$$, i.e. I send you the graph that's the result of a random permutation applied on a randomly selected graph.
4. You should respond with the index (1 or 2) of the source graph, $$b$$. If I get message $$M$$, I immediately reject if $$M\neq b$$.
5. I repeat 1-4 but this time accept (i.e. get convinced) if you guessed correctly.

Note what happens, depending on whether $$G_1$$ and $$G_2$$ are isomorphic or not:
1. If $$G_1\sim G_2$$, then any graph could have been the source graph of the graph sent in step 3. In fact, given the graph at 3, each of $$G_1$$ and $$G_2$$ could've been the source, with equal probability. Therefore, no matter what you send in step 4, it's correct with probability $$1/2$$. The process is done two times, and therefore the probability of convincing me that $$G_1\nsim G_2$$ is $$1/4$$.
2. If $$G_1\nsim G_2$$, you can succeed in convincing me. A working strategy is to search all of the permutations and apply them on both graphs, in search for a result being the graph received in step 3. In our case, this search results in only one graph that's isomorphic to the graph in step 3, and it'd be the source graph. Send it to me and I'll accept both times.

This seems powerful - the verifier forces the prover to do the hard work of solving the problem, only by using a small amount of random and work (both are polynomial). If the graphs aren't isomorphic - some prover could convince me, but if they are, no prover could convince me with significant probability (in our case, with probability larger than $$1/4$$).

But this protocol's validity depends on the *secrecy* of the random bits. If these bits were public, the prover would know which graph was chosen as the source and could cause the verifier to accept or reject as he wishes. So it would seem that the secrecy of random gives additional power to the verifier.

Yet this impression is false. I came by the result IP=AM ([due Goldwasser & Sipser](https://pages.cs.wisc.edu/~jyc/710/Goldwasser-Sipser.pdf)), which shows that the secrecy of random doesn't supply more power to the verifier. IP is private coin and AM is public coin.
It shows that every language that could be certified interactively with a private coined verifier, can also be certified with a public coined verifier.
Trying to understand it, I found a smaller version of the proof that captures the essence of the general proof.

It gives a transition from private to public coin interactive proofs of the problem we just discussed, GNI. That is, by giving an interactive proof system for GNI that uses **public coins**, instead of private ones. This led me to the following resources [(1)](https://www.cs.jhu.edu/~lixints/class/toc/AM.pdf) [(2)](https://webdocs.cs.ualberta.ca/~zacharyf/courses/complexity_2019/notes/complexity-w19-lec12.pdf), which left me with some doubt as to my understanding of it. 
The proof is "in its final form", hiding the reasons that it uses specific tools, and the constants lack the intuition behind them (apart from "we solved for a variable and that's the result").

The second point isn't covered at all in these resources, which quite bugged me. I found one such intuition, which I believe is novel.

This post's aims are twofold: give a derivation of the theorem as if I were to come up with it myself, deriving it step by step; and giving the intuition behind the resulting constants.

--- 

## A Different Perspective of GNI
Recall our problem: we have two undirected graphs $$G_1$$ and $$G_2$$ over $$n$$ nodes labelled $$1,...,n$$. We're tasked with giving a public-coin interactive proof for proving they aren't isomorphic.

The public-coin system for GNI will be based on the following insight: if the two graphs aren't isomorphic, there are "much more" graphs isomorphic to at least one of them, compared to when they are isomorphic. If $$S_1$$ and $$S_2$$ are the sets of isomorphic labelled graphs over $$1,...,n$$ to $$G_1$$ and $$G_2$$ resp., then the size of $$S_1\cup S_2$$ is "much bigger" when $$G_1\nsim G_2$$ compared to when $$G_1\sim G_2$$. Then, the work of the prover becomes to show that the set $S_1\cup S_2$ is "very big".

How can we define $$S_1$$ and $$S_2$$ s.t. we know for certain the size of their union based on whether $$G_1\sim G_2$$? A first guess would be
to define $$S_1$$ and $$S_2$$ to be the sets of graphs isomorphic to the resp. graph. Hoping to achieve known cardinality of $$n!$$, we apply on $$G_i$$ all $$n!$$ permutations:  $$S_1=\{f(G_1)|f\in PERMS(1,...,n)\}$$, and similarly $$S_2$$.

Yet definition can yield $$|S_1|<n!$$. 
That's because different permutations could yield the same labelled graph, as the following figure shows.

![iso_graphs](/assets/img/publicCoins/diff_perm_same_output.png)
_Example of applying two different permutations on $G$ resulting with the same graph $f_1(G)=f_2(G)$._


Because $$S_1$$ is the set of all isomorphic graphs to $$G_1$$, and because there could be less than $$n!$$ such graphs, we need to take a different approach.

Say the graphs $$G_1$$ is isomorphic to are $$I_1,...,I_k$$, and again $$k\leq n!$$. We want to create a set $$S_1$$, s.t.:

1. $\|S_1\|=n!$. We can get that if we were to map every permutation to a unique item in $S_1$. 
2. If $$G_1\sim G_2$$, we have $$S_1=S_2$$, and otherwise $S_1\cap S_2=\emptyset$.

Take representative permutations that map $$G_1$$ to the graphs it's isomorphic to: $$m_1,...,m_k$$ s.t. $$I_j=m_j(G_1)$$ for all $$j=1,...,k$$.

Then, we note a connection between every permutation $$p$$ over $$n$$ to the representatives: say $$p(G_1)=I_j$$ for a single $$j$$. We could always denote $$p=q\circ m_j$$ for a single permutation $$q=p\circ m_j^{-1}$$. Hence, $$I_j=qm_j(G_1)=q(I_j)$$. The permutation $$q$$ is called an *automorphism* of the graph $$I_j$$.

This shows that applying a permutation on a graph is equivalent to first achieving the target graph via a representative permutation, and then applying an automorphism of that graph.

This enables us to create a mapping between permutations $$p$$ to tuples holding the isomorphic graph $$I_j$$ and the automorphism $$q$$:

$$
S_1=
\{
(m_j(G_1),q)|p\in PERMS(1,...,n), p=q\circ m_j
\}
=
\{(I, q)|I\sim G_1\text{ and } q(I)=I\}
$$

To recap, $$\vert S_1\vert=n!$$ because we can map each permutation $$p$$ of the $$n!$$ possible permutations to a unique tuple in $$S_1$$ as such: set $$I=p(G_1)=I_j$$ and set $$q=p\circ m_j^{-1}$$. Unique because if $$p(G_1)=p'(G_1)$$ and $$q=q'$$ we have $$q=p\circ m_j^{-1}$$ and $$q'=p'\circ m_j^{-1}$$ (i.e. the same $$j$$) and therefore $$p=p'$$.

Similarly defining $$S_2$$, yields property 2. Assume $$G_1\sim G_2$$, and we show $$S_1=S_2$$ by double-sided inclusion. If $$G_1\sim G_2$$, and $$(I,q)\in S_1$$, then $$I\sim G_1$$ and by transitivity $$I\sim G_2$$ and $$(I,q)\in S_2$$. The other way is symmetric.

Now assume $$G_1\nsim G_2$$. Then $$S_1\cap S_2=\emptyset$$, merely because each first item is isomorphic to at most one of $$G_1$$ and $$G_2$$.

We got the following definitions and results:

$$
\begin{align}
S_1=\{(I, q)&|I\sim G_1\text{ and } q(I)=I\}\\
S_2=\{(I, q)&|I\sim G_2\text{ and } q(I)=I\}\\
S=&S_1\cup S_2
\end{align}
$$

1. If $$G_1\nsim G_2$$, then $$\vert S\vert=2\cdot n!$$.
2. If $$G_1\sim G_2$$, then $$\vert S\vert=n!$$.

Now, this gap gives a different way to prove $$G_1\nsim G_2$$: only show that $$\vert S\vert =2(n!)$$, or that $$\vert S\vert>n!$$. This is called a *set lower bound*.

## Proving Set Lower Bounds
Recall our set $S$:

$$
S=S_1\cup S_2=\{(I, q)|(I\sim G_1\text{ or } I\sim G_2) \text{ and } q(I)=I\}
$$

The cardinality of this set is $2n!$ if the graphs $G_1$ and $G_2$ aren't isomorphic, and $n!$ if they are.

Graphs could be represented by their adjacency matrix, and permutations by the ordering of the series $1,...,n$. The adjacency matrix takes $n^2$ space and the ordering takes $n\lg n$ space, so effectively each tuple in $S$ can be represented by $m=n^2+n\lg n$ bits: $S\subset F_2^m$.

![iso_graphs](/assets/img/publicCoins/universe_and_set.png)
_The universe $F_2^m$ and it's subset $S$, based on whether $G_1\nsim G_2$ or not._

Looking at the figure, we see that if we sample a random element from $F_2^m$, the probability that it's in $S$ is twice as much when $G_1\nsim G_2$ compared to when $G_1\sim G_2$. Specifically, it's $2n!/2^m$ compared to $n!/2^m$.

Therefore showing a set lower bound is equivalent to distinguishing which distribution our instance of the problem (i.e. $G_1$ and $G_2$) yields: $X_\nsim =Ber(2n!/2^m)$ or $X_\sim =Ber(n!/2^m)$.

Traditionally, distinguishing between distributions involves the ability to sample our unknown distribution. In our case, this means sampling an element from $F_2^m$ and knowing whether it's inside $S$ or not. But it seems hard to do so: how can a weak verifies check if a sampled graph is isomorphic to one of $G_1$ and $G_2$ in polynomial time?

That we can make the prover do: $S$ is easily verifiable given a proper certificate. For $(I,q)$ I only need a proof that $I\sim G_1$ or $I\sim G_2$, to show that $(I,q)\in S$. (Specifically, a permutation that maps $I$ to $G_1$ or $G_2$.) I myself can see whether $q$ is an automorphism of $I$ in polynomial time.
Therefore, when sampling an element from $F_2^m$, we could ask the prover to supply a proof that it's inside $S$.

Let us say we sample many elements from $F_2^m$: $v_1,...,v_N$ and let $X_i$ be the indicator that $v_i\in S$. Then the number of $v$s in $S$ is $$\# _S=X_1+...+X_N$$. These variables are independent and equivalently distributed: if $G_1\nsim G_2$ we have $X_i\sim X_\nsim$ and if $G_1\sim G_2$ we have $X_i\sim X_\sim$.

For large $N$, we get from the central limit theorem that the sum $$\# _S$$ is approximately a normal distribution. We get two different approximations, based on whether the sampled distribution is $X_\nsim$ or $X_\sim$.

![bin partitioning](/assets/img/publicCoins/sep_2_dists.png)
_The distribution $$\# _S$$ for large $N$ is the blue one if $G_1\sim G_2$, and the red if $G_1 \nsim G_2$._

When $X_i\sim X_\sim$, the distribution $$\# _S$$ is very close to the blue distribution, and if $X_i\sim X_\nsim$, to the red distribution. In the figure, there's also a green threshold.

For large $N$, the number of sampled elements in $S$ will be larger than the threshold when $G_1\nsim G_2$, and smaller than the threshold when $G_1\sim G_2$, with high probability.

Now we could craft our first protocol: the verifier samples $N$ elements from $F_2^m$, sends them to the prover, and receives proofs that some of them are in $S$. It checks how many elements pass the verification of the proofs, and if this number passes the threshold, it's convinced that $G_1\nsim G_2$, and otherwise that $G_1\sim G_2$.

If $G_1\sim G_2$, then for large $N$, with high probability, the number of elements the verifier sampled that are in $S$ is lower than the threshold. As the prover can convince the verifier only that a subset (or all) of them is inside $S$, he cannot convince the verifier to accept with more than negligible probability.

If $G_1\nsim G_2$, then w.h.p. there are enough sampled elements that fall inside $S$. Therefore, the prover that provides their certificates convinces the verifier w.h.p.


Everything is fine except for one detail: how large should $N$ be? We have $p_\sim =n!/2^m$ and $p_\nsim=2\cdot p_\sim$. Therefore we have bias $\epsilon=(p_\nsim -p_\sim)/2=p_\sim /2$, and a simple distinguisher (see page 941 [here](https://crypto.stanford.edu/~dabo/cryptobook/BonehShoup_0_5.pdf)) achieves high success probability with $N\approx 1/\epsilon ^2=4\cdot 2^m/n!$. Because $m>n^2$ we have

$$
\frac{2^m}{n!}>\frac{2^{n^2}}{n!}\approx \frac{2^{n^2}}{2^{n\lg n}}
=
EXP(n)
$$

As the verifier runs in polynomial time, it can't sample an exponential number of elements. What keeps us from running in polynomial time is the fact that the probability gap - $n!/2^m$ - is just too small.

It's quite interesting that we can deal with this problem elegantly.

## Reducing the Sample Space
What we need is control over the probability gap - or equivalently the cardinality delta of $S$, so we can carry out a distinguishing process.

To achieve such control, we will apply some function $h$ from the large universe $F_2^m$ to some small universe $F_2^t$. Then, we could sample the target space, and distinguish between indicators of membership in $h(S)$.

![The mapping h](/assets/img/publicCoins/mapping_h.png)
*The mapping $h$ from the initial large universe into a smaller one and its effect on $S$.*

Because we control both *how* we map ($h$) and the *size* of the space we map into (via control of $t$), we could enforce a mapping that makes a cardinality delta in $h(S)$ for when $G_1\nsim G_2$ or not, that is large w.r.t. the target space (hence controlling $\epsilon$).

Then, we could sample the small universe, and distinguish between the distribution of falling inside *the image of our set $S$ w.r.t. our function $h$* - $h(S)$. This process is the same as before, except for the additional element in the certificate: to verify that a sampled $y\in F_2^t$ is in $h(S)$, we need 1) preimage $x$ - i.e. $x\in F_2^m$ s.t. $h(x)=y$, and 2) proof that $x\in S$. This introduces an additional restriction on $h$: it should be computable in polynomial time, so a verifier could certify membership in $h(S)$.

This approach is applicable if we could choose $$t\leq n$$ and a polynomial-time computable mapping $$h:F_2^m\rightarrow F_2^t$$, s.t. $$\epsilon=\frac{1}{2}(p_\nsim - p_\sim)$$ isn't too small. 

---
## Choosing the Mapping $h$
Because it seems hard to construct $h$ for each specific instance of the problem $(G_1, G_2)$ that would satisfy our needs, or to construct a single $h$ that applies to all instances, we turn to a "random mapping". We define what it means shortly, but now we assume that such a function acts as if for each $x$ it chooses a $y$ randomly from the target space.

Such a function intuitively has good traits: if $h$ is random, given that the target size $2^t$ is large enough, the function will keep the approximate size of $S$, and "spreads" the outputs inside the target space. Then, when $G_1\nsim G_2$, the size of $h(S)$ is approximately twice that of $h(S)$ when $G_1\sim G_2$. Then, we have a probability delta of approximately $n!/2^t$, and we can choose a $t$ that's small enough so $n!/2^t$ is at least some constant. But we have a tradeoff - a smaller $t$ would yield a smaller *cardinality* delta, but decreases the divisor we use to get the probability gap. \
We hope to find a $t$ s.t. both the cardinality delta is big, and the divisor $2^t$ is small.

So we settle that $h$ will be a "random function" from $F_2^m$ to $F_2^t$. How can we create a "random function"? The verifier could sample a function $h$ from a *family of functions* $\mathcal{H}$. Then for our initial setting, a sampled function is *random*, if it's pointwise random on every input: for every $x\in F_2^m$, the distribution of outputs when $h$ if randomly selected from $\mathcal{H}$ is uniform - $h(x)\sim Uniform(F_2^t)$. Alternatively,

$$
\forall x\in F_2^m, \forall y\in F_2^t:\ \ \ \Pr_{h\in \mathcal{H}} [h(x)=y]=2^{-t}
$$

There is a family $\mathcal{H}$ for every $t$ we choose that satisfies this condition, which can be sampled in polynomial time. Its definition is a technicality, and I refer you to one of the linked PDFs to read it.

Because $h$ isn't a specific function, but is a sampled function, we update our protocol: the verifies samples both a $y\in F_2^t$ and a $h\in \mathcal{H}$, and sends them both to the prover. The rest is the same. Therefore, the probabilities are now taken also over $h$ - we first sample a function $h$, and then ask whether a sampled target falls within $h(S)$. The probability that it happens, depending on whether $G_1\nsim G_2$ or not, is:

$$
\begin{align}
p_\nsim = \Pr _{h\in \mathcal{H},y\in F_2^t}[y\in h(S)\vert G_1\nsim G_2]\\
p_\sim = \Pr _{h\in \mathcal{H},y\in F_2^t}[y\in h(S)\vert G_1\sim G_2]
\end{align}
$$

## Choosing the Target Size $2^t$
Intuitively $p_\sim$ is the lower probability. Recall that we should aim at a large probability gap, $p_\nsim - p_\sim$. Let's bound this quantity from below, and solve for $t$ s.t. this lower bound is at least a constant.

For this, we bound $p_\sim$ from above and $p_\nsim$ from below. We start with the easy one, $p_\sim$, which uses the union bound: 

$$
\begin{align}
p_\sim &= \Pr _{h\in \mathcal{H},y\in F_2^t}[y\in h(S)\vert G_1\sim G_2]
=\Pr _{h\in \mathcal{H},y\in F_2^t}\left[ y\in \{ h(s_1),...,h(s_{n!})\}\right]\\
&=\Pr _{h\in \mathcal{H},y\in F_2^t}\left[ \bigcup_{i=1}^{n!}(y=h(s_i))\right]
\leq \sum_{i=1}^{n!}\Pr _{h\in \mathcal{H},y\in F_2^t}\left[ y=h(s_i) \right]=n!\cdot 2^{-t}
\end{align}
$$

Where the last equality applies from our restriction on the function family $\mathcal{H}$. Now we bound $p_\nsim$ from below, using the [Bonferroni Inequality](https://en.wikipedia.org/wiki/Boole%27s_inequality#Bonferroni_inequalities) (note the difference in the number of elements in $S$ - now it's $2n!$):

$$
\begin{align}
p_\nsim &= \Pr _{h\in \mathcal{H},y\in F_2^t}[y\in h(S)\vert G_1\nsim G_2]\\
&=\Pr _{h\in \mathcal{H},y\in F_2^t}\left[ \bigcup_{i=1}^{2n!}(y=h(s_i))\right]\\
&\ge 
\sum_{i=1}^{2n!}\Pr _{h\in \mathcal{H},y\in F_2^t}\left[ y=h(s_i) \right] - \sum_{\{s_i,s_j\}\in \binom{S}{2}}\Pr_{h\in \mathcal{H},y\in F_2^t} [y=h(s_i)\cap y=h(s_j)]
\end{align}
$$

where $\binom{S}{2}$ is the set of all set pairs from $S$: 

$$
\binom{S}{2}=\{ \{a,b\}\subseteq S|a\neq b \}
$$

We know the value of the first sum, as we did before. For the second, we would like to say the probability in each term is $2^{-2t}$ - because a "random function" is also pairwise independent. So we enforce another condition on the function family $\mathcal{H}$, which is called *pairwise independence*:

$$
\forall x_1\neq x_2\in S,\forall y_1,y_2:\ \ \ \Pr _{h\in \mathcal{H}}\left[  h(x_1)=y_1\cap h(x_2)=y_2 \right] = 2^{-2t}
$$

This condition is stronger than what we need - we only need it to work for a single $y$ and not every pair $y_1,y_2$. But this stronger condition also implies our initial pointwise uniformness condition, so this condition alone suffices. There's still a family $\mathcal{H}$ that is pairwise independent and could be sampled in polynomial time, so everything we said up until now still holds.

Now we continue with our lower bound,

$$
\begin{align}
p_\nsim &\ge
\sum_{i=1}^{2n!}\Pr _{h\in \mathcal{H},y\in F_2^t}\left[ y=h(s_i) \right] - \sum_{\{s_i,s_j\}\in \binom{S}{2}}\Pr_{h\in \mathcal{H},y\in F_2^t} [y=h(s_i)\cap y=h(s_j)]\\
&=2n!\cdot 2^{-t}-\binom{2n!}{2}\cdot 2^{-2t}
=2n!\cdot 2^{-t}-\frac{2n!\cdot (2n!-1)}{2}\cdot 2^{-2t}
=2n!\cdot 2^{-t}-2n!\cdot (2n!-1)\cdot 2^{-2t-1}\\
&\ge
2n!\cdot 2^{-t}-4(n!)^2\cdot 2^{-2t-1}
=
2n!\cdot 2^{-t}-n!^2\cdot 2^{-2t+1}
\end{align}
$$

Note that we didn't actually need a random $y$ to achieve these bounds - we could have just used some constant $y$. But as randomly selecting $y$ was the intuition, we kept to it.

Now we bound the probability gap $p_\nsim - p_\sim$:

$$
\begin{align}
p_\nsim - p_\sim &\ge \left( 2n!\cdot 2^{-t}-n!^2\cdot 2^{-2t+1}\right) - n!\cdot 2^{-t}\\
&=
n!\cdot 2^{-t}-(n!)^2\cdot 2^{-2t+1}\\
&=
\frac{n!}{2^t}\cdot
\left(
1-n!\cdot 2^{-t+1}
\right)
=
\frac{n!}{2^t}\cdot (1-2\cdot \frac{n!}{2^t})
\end{align}
$$

Now we can set $t$ s.t. the expression above is a positive constant for large $n$, and finish. Denote $x=n!/2^t$, and we have the expression $x(1-2x)=-2x^2+x$. Only values of $x$ between 0 and 0.5 will yield a positive lower bound. But we should have a constant lower bound for every $n$. That is, there should be some $0<\delta_1<\delta_2 <1/2$ s.t. $x\in (\delta_1,\delta_2)$ for every $n$. 

Because we search for $x<1/2$, we get $n!/2^t < 1/2 \Rightarrow 2^t>2n!\Rightarrow t>1+\lg (n!)$.\
Because $\lg(n!)$ is never an integer for $n>2$, the smallest $t$ possible is $t=1+\lceil \lg (n!) \rceil$.
As our first guess, we try this $t$ and search for $0<\delta<1/2$ satisfying:

$$
\begin{align}
\frac{n!}{2^{1+\lceil \lg (n!)\rceil}}&<\frac{1}{2}-\delta\\
\frac{2^{\lg (n!)}}{2^{\lceil \lg (n!)\rceil}}&<1-2\delta\\
\end{align}
$$

The right hand is a constant lower than 1. But it seems hard (to me at least) to show that, for almost all but a constant number of natural numbers, the value $\frac{2^{\lg (n!)}}{2^{\lceil \lg (n!)\rceil}}\in (0,1)$ is lower than a constant $\delta '\in (0,1)$. It seems possible that $\lceil \lg (n!) \rceil$ gets arbitrarily close to $\lg (n!)$ infinitely many times, causing the fraction to be arbitrarily close to 1 and thus not satisfying the inequality infinitely many times. 

Moving on to the next guess, $t=2+\lceil \lg (n!)\rceil$, we see:

$$
\begin{align}
x&=\frac{n!}{2^{2+\lceil \lg (n!)\rceil}}=\frac{n!}{4\cdot2^{\lceil \lg (n!)\rceil}}<1/4\\
x&=
\frac{n!}{2^{2+\lceil \lg (n!)\rceil}}\ge\frac{n!}{2^{3+\lg (n!)}}=1/8
\end{align}
$$

And we got what we want: for $t=2+\lceil \lg (n!)\rceil$, the probability gap satisfies:

$$
p_\nsim - p_\sim\ge
x\cdot (1-2\cdot x)\ge \frac{1}{8}(1-2\cdot1/4)=\frac{1}{8}\cdot \frac{1}{2}=\frac{1}{16}
$$

We got a constant probability gap! Now it can be shown that repeating the process some constant number of times yields the needed error bounds on the protocol. The proof is very similar to showing that $BPP$ is invariant to the probability delta as long as it's constant.

## Intuition for the Value of $t$
Why did we get $t=2+\lceil \log (n!) \rceil$? Let's analyze the consequences of this choice more thoroughly.

We look on the expected size of $h(S)$: we define indicator random variables $X_i=I[i\in h(S)]$ for $i\in F_2^t$, and then $\vert h(S)\vert=\sum X_i$. Assuming $h$ is randomly and independently puts balls (items in $F_2^m$) into buckets (items in $F_2^t$), we have

$$
\begin{align}
\mathbb{E}[X_i]&=\Pr[i\in h(S)]=1-\Pr[i\notin h(S)]=1-\prod_{s\in S}\Pr [h(s)\neq i]\\
&=1-\prod_{s\in S}\frac{2^t-1}{2^t}=1-\prod_{s\in S}\big( 1 -\frac{1}{2^t}\big) =1-\big( 1 -\frac{1}{2^t}\big)^{\vert S\vert}
\end{align}
$$

Therefore, noting that $p_\sim = \vert h(S) \vert /2^t$ for $\vert S\vert =n!$ and similarly for $p_\nsim$,

$$
\begin{align}
\mathbb{E}[\vert h(S)\vert ]&=2^t\cdot \left(1-\big( 1 -\frac{1}{2^t}\big)^{\vert S\vert} \right)\\
\Rightarrow &
\begin{cases} 
\mathbb{E}[p_\sim]= 1-\big( 1 -\frac{1}{2^t}\big)^{n!}  \\
\mathbb{E}[p_\nsim]= 1-\big( 1 -\frac{1}{2^t}\big)^{2n!}  
\end{cases}\\
\end{align}

$$

Therefore, the expected probability gap is

$$
\mathbb{E}[p_\nsim - p_\sim] = \big( 1 -\frac{1}{2^t}\big)^{n!}-\left[ \big( 1 -\frac{1}{2^t}\big)^{n!} \right] ^2
$$

And we got a familiar series: $(1-1/k)^k \rightarrow 1/e$. Therefore an approximate value of $t\approx \lg (n!)$ yields a constant expected probability gap, assuming $n$ is large.

Another intuition is this: *it's enough that on average $\vert h(S)\vert$ would be a constant multiple of  $2^t$.*\
The value we got for $t$ makes $\vert h(S)\vert$ a constant multiple of the target space size, on average. Say we have on average $\vert h(S)\vert /2^t=\alpha$ for a constant $\alpha \in (0,1)$ and $\vert S\vert =n!$. Then for the case that $\vert S\vert =2\cdot n!$, we can write $S=S_1\cup S_2$, with $\vert S_1\vert =\vert S_2\vert =n!$. Then, as we did before, on average $\vert h(S_1)\vert =\vert h(S_2)\vert = \alpha \cdot 2^t$. \
We can then calculate the cardinality difference as such: let $Y_i = I[i\notin h(S_1)]$ for $i\in h(S_2)$. Then the cardinality delta is $\Delta=\sum Y_i$, which on average is $\vert h(S_2)\vert \cdot \frac{2^t - \alpha 2^t}{2^t}=\alpha 2^t\cdot (1-\alpha)$, and hence the probability gap is $\Delta /2^t = \alpha (1-\alpha)$, on average, which is constant. \
Although this intuition isn't rigorous, it demonstrates a similarity with its deterministic counterpart - if $S$ were to be a fraction of the base universe, we would've had a constant probability gap to begin with.
