#!/usr/bin/env bash
# Shrink every image in a folder to a max long-edge size, in place.
# Only ever shrinks (never upscales) and re-encodes using each file's actual
# format rather than its extension, since some images in this repo are
# mislabeled (e.g. a .png that's actually JPEG or WebP data).
#
# Usage: scripts/resize-images.sh <folder> [max-edge] [quality]
# Example: scripts/resize-images.sh assets/images/3dprinting 1920 82

set -euo pipefail

folder="${1:?Usage: resize-images.sh <folder> [max-edge] [quality]}"
edge="${2:-1920}"
quality="${3:-82}"

find "$folder" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) | while read -r f; do
    format=$(identify -format '%m' "$f" 2>/dev/null | head -c3)
    case "$format" in
        JPE) coder=jpeg ;;
        PNG) coder=png ;;
        WEB) coder=webp ;;
        *) echo "skip (unrecognized format): $f"; continue ;;
    esac

    before=$(du -h "$f" | cut -f1)
    magick "$f" -auto-orient -strip -background white -alpha remove -alpha off \
        -resize "${edge}x${edge}>" -quality "$quality" "$coder:$f"
    after=$(du -h "$f" | cut -f1)
    echo "$f: $before -> $after"
done
