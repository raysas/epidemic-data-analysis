#!/usr/bin/env python

# python code/scripts/process_log.py output/hadoop/logs/ --output output/hadoop/MR_performance_stats.csv
# -- saved metrics for 5 logs to 'output/hadoop/MR_performance_stats.csv'

import os
import re
import csv
from datetime import datetime

def parse_hadoop_log(file_path):
    """
    Extract useful MapReduce features from a Hadoop log file.
    Returns a dictionary of features.
    """
    features = {
        "mapInputRecords": None,
        "reduceOutputRecords": None,
        "jobDurationMillis": None,
        "physicalMemoryBytes": None,
        "virtualMemoryBytes": None,
        "cpuTimeMillis": None,
        "launchedMapTasks": None,
        "launchedReduceTasks": None,
        "bytesReadHDFS": None,
        "bytesWrittenHDFS": None
    }

    start_time = None
    end_time = None

    with open(file_path, "r") as f:
        for line in f:
            ts_match = re.match(r"(\d{2}/\d{2}/\d{2} \d{2}:\d{2}:\d{2})", line)
            if ts_match:
                timestamp = datetime.strptime(ts_match.group(1), "%y/%m/%d %H:%M:%S")
                if "Running job" in line:
                    start_time = timestamp
                if "completed successfully" in line:
                    end_time = timestamp

            # Extract map/reduce records
            if "Map input records=" in line:
                features["mapInputRecords"] = int(line.split("=")[1].strip())
            if "Reduce output records=" in line:
                features["reduceOutputRecords"] = int(line.split("=")[1].strip())
            
            # Memory and CPU
            if "Physical memory (bytes) snapshot=" in line:
                features["physicalMemoryBytes"] = int(line.split("=")[1].strip())
            if "Virtual memory (bytes) snapshot=" in line:
                features["virtualMemoryBytes"] = int(line.split("=")[1].strip())
            if "CPU time spent (ms)=" in line:
                features["cpuTimeMillis"] = int(line.split("=")[1].strip())

            # Launched tasks
            if "Launched map tasks=" in line:
                features["launchedMapTasks"] = int(line.split("=")[1].strip())
            if "Launched reduce tasks=" in line:
                features["launchedReduceTasks"] = int(line.split("=")[1].strip())

            # HDFS I/O
            if "HDFS: Number of bytes read=" in line:
                features["bytesReadHDFS"] = int(line.split("=")[1].strip())
            if "HDFS: Number of bytes written=" in line:
                features["bytesWrittenHDFS"] = int(line.split("=")[1].strip())

    # Compute job duration in milliseconds
    if start_time and end_time:
        duration_ms = int((end_time - start_time).total_seconds() * 1000)
        features["jobDurationMillis"] = duration_ms

    return features


def process_log_directory(directory_path, output_csv="hadoop_metrics.csv"):
    """
    Process all log files in a directory and save results to CSV.
    """
    rows = []
    for filename in os.listdir(directory_path):
        if filename.endswith(".log") or filename.endswith(".txt"):
            file_path = os.path.join(directory_path, filename)
            features = parse_hadoop_log(file_path)
            features["query_name"] = os.path.splitext(filename)[0]
            rows.append(features)

    if rows:
        fieldnames = ["query_name"] + [k for k in rows[0] if k != "query_name"]
        with open(output_csv, "w", newline="") as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for row in rows:
                writer.writerow(row)

    print(f"Saved metrics for {len(rows)} logs to '{output_csv}'.")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Extract MapReduce metrics from Hadoop logs.")
    parser.add_argument("log_dir", help="Path to directory containing Hadoop log files")
    parser.add_argument("--output", help="Output CSV file name", default="hadoop_metrics.csv")
    args = parser.parse_args()

    process_log_directory(args.log_dir, args.output)
