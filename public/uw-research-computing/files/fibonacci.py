#!/usr/bin/env python3

from datetime import datetime
import socket
import sys
import time

CHECKPOINT_FILENAME = 'fibonacci.checkpoint'

# Number of seconds to sleep (do nothing) between outer loop iterations
SLEEP_SECONDS = 30

# Number of outer loop iterations to complete before self-checkpointing
CHECKPOINT_FREQUENCY = 2

def timestring():
    return datetime.now().strftime('%Y-%m-%h %H:%M:%S')

# Read command-line argument, which is total number of iterations to perform
if len(sys.argv) != 2:
    print('Usage: fibonacci.py TOTAL_ITERATIONS', file=sys.stderr)
    sys.exit(1)
total_iterations = int(sys.argv[1])

# Figure out where to start from
completed_iterations = 0
n_minus_2 = 0
n_minus_1 = 1
try:
    f = open(CHECKPOINT_FILENAME, 'r')
    completed_iterations = int(f.readline().rstrip())
    n_minus_2 = int(f.readline().rstrip())
    n_minus_1 = int(f.readline().rstrip())
    f.close()
except IOError:
    pass

hostname = socket.gethostname()
print('{}: Starting up on {}, asked to do {} iterations total'.format(timestring(), hostname, total_iterations))
print('{}: Completed iterations = {}'.format(timestring(), completed_iterations))

while completed_iterations < total_iterations:
    # Record current iteration
    print('{}: Starting iteration #{}'.format(timestring(), completed_iterations + 1))

    # Do Science!
    new_value = n_minus_2 + n_minus_1
    print('{}: Calculated that {} + {} = {}'.format(timestring(), n_minus_2, n_minus_1, new_value))
    n_minus_2, n_minus_1 = n_minus_1, new_value
    completed_iterations += 1

    time.sleep(SLEEP_SECONDS)

    # Possibly checkpoint here
    if (completed_iterations < total_iterations) and (completed_iterations % CHECKPOINT_FREQUENCY == 0):
        print('{}: Checkpointing'.format(timestring()))
        try:
            f = open(CHECKPOINT_FILENAME, 'w')
            f.write("{}\n{}\n{}\n".format(completed_iterations, n_minus_2, n_minus_1))
            f.close()
        except IOError:
            print('Could not write checkpoint: {}'.format(IOError.strerror))
            sys.exit(2)
        sys.exit(85)

# Write output file and terminate normally
f = open('fibonacci.result', 'w')
f.write("The Fibonacci number after {} iterations is {}\n".format(completed_iterations, new_value))
sys.exit(0)