#!/bin/bash

# Usage:
#   ./split_json.sh input.json n_parts [jq_path]
# Examples:
#   ./split_json.sh data/covid.json 4            # auto-detect array or .records
#   ./split_json.sh data/file.json 3 .rows      # explicitly split the array at .rows

set -euo pipefail

input="$1"
n="$2"
jq_path="${3:-}"

# determine jq path: if provided, use it; otherwise auto-detect
if [ -n "$jq_path" ]; then
  path="$jq_path"
else
  # detect top-level type
  top_type=$(jq -r 'type' "$input")
  if [ "$top_type" = "array" ]; then
    path='.'
  elif [ "$top_type" = "object" ]; then
    # find the first key whose value is an array
    key=$(jq -r 'keys[] as $k | if (.[$k] | type) == "array" then $k else empty end' "$input" | head -n1 || true)
    if [ -n "$key" ]; then
      path=".${key}"
    else
      echo "Error: top-level object does not contain an array. Provide a jq path as third argument." >&2
      exit 2
    fi
  else
    echo "Error: unsupported JSON top-level type: $top_type" >&2
    exit 2
  fi
fi

# get total length of array at path
total=$(jq "${path} | length" "$input")
if [ "$total" -eq 0 ]; then
  echo "No elements to split (length == 0)" >&2
  exit 0
fi

chunk_size=$(( (total + n - 1) / n ))  # round up

for ((i=0; i<n; i++)); do
  start=$((i * chunk_size))
  end=$((start + chunk_size))
  out="${input%.json}_part_$((i+1)).json"
  jq "${path}[${start}:${end}]" "$input" > "$out"
  echo "Wrote $out (items $start..$((end-1)))"
done

