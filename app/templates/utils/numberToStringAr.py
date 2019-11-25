import sys
from num2words import num2words

s = []
s.append(num2words(int(sys.argv[1]), lang='ar'))
s.append(num2words(int(sys.argv[2]), lang='ar'))

print(s)
