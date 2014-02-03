#!/bin/sh

# exit in case of error
set -e

HOOK_EXTENSION='hook'

for hook in .githooks/*".$HOOK_EXTENSION" ; do
  ln -sf "../../$hook" ".git/hooks/$(basename $hook ".$HOOK_EXTENSION")"
done

exit 0
