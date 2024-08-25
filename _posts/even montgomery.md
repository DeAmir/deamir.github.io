
But there aren't really choice of $R$ that are better than a power of two, so I thought about a way alter the scheme a bit, so we could still use the case for $R$ a power of 2.
I haven't found anything about case in the internet. So I solved that, and you can too! It's a nice exercise.

We write $N=2^lm$ for odd $m$. Using the Chinese Remainder Theorem, we know that $$\mathbb{Z}_N\cong \mathbb{Z}_{2^l}\times \mathbb{Z}_m$$. Now, if $m\lt\lt2^l$, then we can simply do the computations in the CRT domain. Reduction by $m$ is comparatively easy, 


Now let $\mathbb{Z}_m^{\*}$ be the montgomery space modulo $m$, using a power of two $R$ as we did. Then,

$$
\mathbb{Z}_N\cong \mathbb{Z}_{2^l}\times \mathbb{Z}_m^{*}
$$

Given that we've already converted our residue to the RHS form, we can do arithmetic efficiently in a pointwise fashion. Specifically, multiplication in this form involved computing two products: one modulo a power of two, and another in montgomery space with $R$ a power of 2. Arithmetic modulo a power of 2 is easy. In fact, in many programming languages, unsigned integers actually represent residues in a ring of integer modulo a power of 2 (e.g `uint32_t` in C++ represents an element in $\mathbb{Z}_{2^{32}}$). And as we've shown, arithmetic in montgomery space is efficient.

Now the question becomes how to transform into and out of the RHS, and if we can do that without division by $N$. 

I couldn't get the reverse transformation that way: given $(a,\hat{b})$ we do the reverse montgomery transformation to get $b$, and then compute the CRT interpolation $am(m^{-1}\mod 2^l)+b2^l(2^{-l}\mod m)$ which we reduce modulo $N$. Trying to bound this value shows that it's less than $N(m+2^l)$. If $m+2^l$ were small, then we'd be good, but $m+2^l$ is at least $2\sqrt N$, which is very big. Maybe we can somehow compute the interpolation efficiently, I don't know.

But the forward transformation can! Given $x\in \mathbb{Z}_N$ we can efficiently reduce modulo $2^l$. If we show that we can easily reduce modulo $m$, then we're effectively done, as all that's left is the forward montgomery transformation on the result.

Let $(a,b)$ be the RHS form of $x$. As we said, we efficiently computed $a=x(\mod 2^l)$, and want to compute $b=x(\mod m)$. Using the CRT interpolation, we can tie $a$, $b$ and $x$ together as:

$$
x=am(m^{-1}\mod 2^l)+b2^l(2^{-l}\mod m)
$$

Denote $\eta=m^{-1}(\mod 2^l)$ and $\zeta=2^{-l}(\mod m)$. Solving for $b$ yields

$$
b=\frac{x-am\eta}{2^l\cdot \zeta}
$$