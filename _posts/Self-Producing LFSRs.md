First notion - the $n$ first elements produce the $n+1$th element by applying the LFSR defined by the first n elts on the first elts.
This results in a series that's uniquely determined by the choice of $a_0$, and has the form $a_i=[C_i]a_0^{i+1}$ for $i\ge 1$ where $C_i$ is the ith Catalan number, and the braces indicate the summing of 1 such times (i.e. we take mod the char(F)).

What's left to do:
1. How does this look for F2?
2. Use the subtractive formula for Catalan numbers. How long is it until the series becomes degenerate with inifinite number of 0s?
3. Generalize to char=p, using a theorem on when a prime divides a Catalan number.
4. Does this actually yield a fixed point w.r.t. berlekamp massey? how long should the series prefix be, to produce itself? What's the minimal and maximal sizes?
	Make experiments in sage.
5. How do longest lin complx series of length n look like? there are X of those according to the distribution calculation, try to characterize them and maybe build them (inductively?)