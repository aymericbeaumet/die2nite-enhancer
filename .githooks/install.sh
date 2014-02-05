#!/bin/bash

# exit in case of error
set -e

cd "$(dirname "$0")"

HOOK_EXTENSION='hook'

for hook in *".$HOOK_EXTENSION" ; do
  ln -sf "../../.githooks/$hook" "../.git/hooks/$(basename "$hook" ".$HOOK_EXTENSION")"
done

exit 0
