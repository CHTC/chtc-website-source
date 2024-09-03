#!/usr/bin/env python3
# Usage: least_squares.py [CSV] [Country] [Year, optional]

import os, sys
import csv

# Calculates least squares
def least_squares(years, data):
    # Check length of data
    assert len(years) == len(data)
    x_sum = 0
    y_sum = 0
    x_sq_sum = 0
    xy_sum = 0
    n = len(data)
    # Least squares regression calculation
    for i in range(0, n):
        x = int(years[i])
        y = float(data[i])
        x_sum = x_sum + x
        y_sum = y_sum + y
        x_sq_sum = x_sq_sum + (x ** 2)
        xy_sum = xy_sum + (x * y)
    m = ((n*xy_sum)-(x_sum*y_sum))/((n*x_sq_sum)-(x_sum ** 2))
    b = (y_sum-m*x_sum)/n
    # Return results
    print("Linear regression (y = mx + b):")
    print("m =", format(m, '.3f'), "b =", format(b, '.3f'))
    return m, b


# Extract life expectancy data for a country
def extract_data(filename, country):
    header = []
    data = []
    with open(filename, 'r') as csvfile:
        csvreader = csv.reader(csvfile)
        for row in csvreader:
            if len(row) > 1:
                header.append(row[0])
                data.append(row[1:-1])
    years = data[0]
    i = header.index(country)
    country_data = data[i]
    return years, country_data

# Check arguments
# Usage: least_squares.py [CSV] [Country] [Year, optional]
if len(sys.argv) < 3 or len(sys.argv) > 4:
    print(f'Usage: {os.path.basename(sys.argv[0])} [CSV] [Country] [Year, optional]')
    sys.exit(1)

# Least squares on a country
filename = sys.argv[1]
country = sys.argv[2]
years, country_data = extract_data(filename, country)
m, b = least_squares(years, country_data)

# Estimated life expectancy from year
if len(sys.argv) == 4:
    x = int(sys.argv[3])
    print('Estimated life expectancy for', country, 'in the year', x)
    print(format(m*x+b, '.3f'))
