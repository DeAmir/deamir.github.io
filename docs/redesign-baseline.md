# Blog redesign baseline

Captured before redesign implementation on 2026-08-22.

## Repository state

- Branch: `main`
- Commit: `1565a16` (`3- vs 2-variant of AWPM`)
- The worktree was already dirty before redesign work began.
- Existing modified files belong to Amir and must not be overwritten.
- Existing untracked work included the ELF post, ELF includes/assets, the
  generated `_site`, and `Gemfile.lock`.
- Approved change (2026-08-22): Amir requested deletion of the unfinished ELF
  post. Its route and source hash are therefore no longer protected; the
  supporting ELF reference assets remain untouched.

## Published route baseline

```text
/
/about/
/archives/
/categories/
/posts/3-AWPM-vs-2/
/posts/montgomery-intuition/
/posts/public-private-coins/
/posts/recursion-theorem-1/
/posts/recursion-theorem-2/
/posts/sampling-approximate-2/
/posts/sampling-rejection-1/
/posts/uncharted-4/
/tags/
/tags/computability-theory/
/tags/computational-number-theory/
/tags/elf/
/tags/interactive-proofs/
/tags/probability/
/feed.xml
/sitemap.xml
```

## Authored-content hashes

The redesign must not change these files without explicit approval.

```text
51cf1bd71670b8e74265606f224946cfec64128e6a2fab0e93ddfdc147244100  _posts/2023-10-06-recursion-theorem-1.md
5c366ee6dfdabfcfd11e10c3b16794ca32f4527b5cb3a21c2d4e7bb22531c5c3  _posts/2023-10-07-recursion-theorem-2.md
f738bcd44637148be491274f533d1fe43deb55cbc17a0f6c6cd3c68f79598a96  _posts/2023-10-13-sampling-rejection-1.md
3f497b512ee1e546cb44dca1180ada2130d8ec2200ceac5393bcd3c598f38294  _posts/2023-10-27-sampling-approximate-2.md
59e4d682814b2961c290c4ad80a5a5181473b5dbd7cc1c4393a12c2b0c4965b7  _posts/2023-11-26-public-private-coins.md
94777a4f327933826ee2de391417ab8d06c825068ca9f1645d428e68372fa356  _posts/2024-08-23-montgomery-intuition.md
4021178106f17d62c28cdf0c9f31b78f58b3f92cbc1893e931ce5a4b69b1ef1b  _posts/2024-10-11-uncharted-4.md
e1035ecdb25e593c32c38d7594d1ffcc032854981a07b91d4b2f74cdde540412  _posts/2024-11-1-3-AWPM-vs-2.md
d870682d3b59398df44ede40d25f650b7e905d8a4048730185a01600d7a3c2d5  _posts/great.html
e90573e17dea253fcbf5bd06e3a44e25a422fab6140aa9ebfab4975afc6595e3  _tabs/about.md
57115bc5940a38cca43ddcc19e34cb3a6ed857252e44d248af33863a1f00b40e  _tabs/archives.md
cbed5350b349bfb76e169d266b63f3a49e108c9563188847581be93cc27211df  _tabs/categories.md
51d852c50def5443291f071e54e44e112857fa36467d5794edcee4604ce1a3e3  _tabs/tags.md
```

Image, video, and ELF-reference assets are also content and must remain
unchanged. Their combined manifest hash is:

```text
eb0b119ba48a4f715d3b31fda207ef89fc71b1bdef725eb763b510b6973388b7
```

Their integrity is checked mechanically by `scripts/test-redesign`.

## Baseline build condition

The initial local production build failed before any redesign code was added.
The cause is a platform mismatch: the lockfile selected
`sass-embedded 1.68.0-x86_64-darwin` while the machine is `arm64`.

Correcting this toolchain issue is an implementation prerequisite, not a
content change.
