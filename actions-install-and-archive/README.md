# actions-install-and-archive

From [tecolicom/actions-install-and-archive](https://github.com/tecolicom/actions-install-and-archive)

![actions-install-and-archive](https://github.com/tecolicom/actions-install-and-archive/actions/workflows/test.yml/badge.svg)

This GitHub action execute given script, and archive installed files.
Before installation, an epoch file is made, and any files those have
newer timestamp than this epoch file are archived.

This is a backend action for other series of actions and not supposed
to be used from normal workflow.

## Usage

```yaml
# inputs:
#   run:     { required: true,  type: string }
#   archive: { required: false, type: string }
#   path:    { required: false, type: string }
#   list:    { required: false, type: string, default: "/tmp/updated-list" }
#   sudo:    { required: false, type: boolean }
#   verbose: { required: false, type: boolean, default: false }

- uses: shiron-dev/actions/actions-install-and-archive@v1
  with:
    # install script
    run: ""

    # archive file
    # if empty, do not archive
    archive: ""

    # install path
    # multiple directories can be specified
    # must start with /
    path: ""

    # sudo: run install script as root
    sudo: false

    # verbose: show verbose output
    verbose: false
```

## Example

```yaml
- uses: shiron-dev/actions/actions-install-and-archive@v1
  with:
    run: apt-get install -qq mecab mecab-ipadic-utf8
    archive: /tmp/apt-archive.tz
    sudo: true
    path: >-
      /etc
      /usr/bin
      /usr/sbin
      /usr/lib
      /usr/share
      /var/lib
```

## See Also

### [tecolicom/actions](https://github.com/tecolicom/actions)

### [tecolicom/actions-install-and-cache](https://github.com/tecolicom/actions-install-and-cache)
