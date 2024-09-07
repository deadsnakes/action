[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/deadsnakes/action/main.svg)](https://results.pre-commit.ci/latest/github/deadsnakes/action/main)

deadsnakes/action
=================

a GitHub action to install (pre-release) pythons from [deadsnakes]

[deadsnakes]: https://github.com/deadsnakes

### using this action

To use this action, add it adjacent to `setup-python` and opt into it
conditionally.  Here's an example which uses `python-version` as a matrix.

```yaml
on:
  push:

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [3.6, 3.7, 3.8, 3.9-dev, 3.10-dev]
    name: main
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        if: "!endsWith(matrix.python-version, '-dev')"
        with:
          python-version: ${{ matrix.python-version }}
      - uses: deadsnakes/action@v3.2.0
        if: endsWith(matrix.python-version, '-dev')
        with:
          python-version: ${{ matrix.python-version }}
          # debug: true  # Optional, to select a Python debug build
          # nogil: true  # Optional, to select a free-threaded Python build (3.13+ only)
      - run: python --version --version && which python
```

### available versions

- to use nightly builds, add `-dev` to the end of the version name.
    - [available nightly versions]
- to use tagged builds, just use the version number
    - [available versions]

In either case, the actions's `debug` input can be used to install a
debug build of the selected Python version, by adding `debug: true`.

The `nogil` input can be used instead of `debug` to install an *experimental*
free-threaded build of the selected Python version, by adding `nogil: true`
Only available for Python 3.13 and later.

The action's `tk` input can be used to install Tkinter, which is not included
by default. If `debug` is set then `tk-dbg` will be used. If `nogil` is set
then `tk-nogil` will be used; only available for Python 3.13 and later.

[available nightly versions]: https://launchpad.net/~deadsnakes/+archive/ubuntu/nightly/+packages
[available versions]: https://launchpad.net/~deadsnakes/+archive/ubuntu/ppa/+packages
