import json
import sys
import os

def split_json(input_file, n_parts):
    # Load the full JSON array
    with open(input_file, 'r') as f:
        data = json.load(f)

    if not isinstance(data, list):
        print("Error: JSON root must be an array.")
        return

    total = len(data)
    chunk_size = total // n_parts + (1 if total % n_parts else 0)

    base_name = os.path.splitext(os.path.basename(input_file))[0]

    for i in range(n_parts):
        start = i * chunk_size
        end = start + chunk_size
        chunk = data[start:end]

        output_file = f"{base_name}_part_{i+1}.json"
        with open(output_file, 'w') as out:
            json.dump(chunk, out, indent=2)

        print(f"Created {output_file} with {len(chunk)} items.")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python split_json.py <input_file.json> <n_parts>")
        sys.exit(1)

    input_file = sys.argv[1]
    n_parts = int(sys.argv[2])
    split_json(input_file, n_parts)