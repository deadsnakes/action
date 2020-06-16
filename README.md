[![Build Status](https://github.com/deadsnakes/action/workflows/deploy/badge.svg)](https://github.com/deadsnakes/action/actions)

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
      - uses: deadsnakes/action@v1.0.0
        if: endsWith(matrix.python-version, '-dev')
        with:
          python-version: ${{ matrix.python-version }}
      - run: python --version --version && which python
```

### available versions

- to use nightly builds, add `-dev` to the end of the version name.
    - [available nightly versions]
- to use tagged builds, just use the version number
    - [available versions]

note: this action is incompatible with ubuntu-16.04 due to a limitation in
`add-apt-repository`

[available nightly versions]: https://launchpad.net/~deadsnakes/+archive/ubuntu/nightly/+packages
[available versions]: https://launchpad.net/~deadsnakes/+archive/ubuntu/ppa/+packages
