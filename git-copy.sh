#!/bin/bash
# Target directory
TARGET=$3
echo "Coping to $TARGET"
git diff --name-only $1 $2 >test
        mkdir -p "$TARGET/$(dirname)"
        # Then copy over the file.
        cp Delta/* "$TARGET/"
echo "Done";