# Bad-Value-Filter-for-2D-Matrix
This is a JavaScript / HTML program lets the user open a CSV file containing 2D matrix of numbers (representing cell values of an image) from disk, displays it in a text box, processes it, and displays the output in another text box. The delimiter for the matrix can be either space or a single comma (‘,’). The program writes the output in the same format as the input. Once the input data is read, the application performs filtering of “bad” values. Any entry of the matrix is “bad” when it has a value of 0 (zero). The application replaces these bad values and compute the true value by interpolating it from the surrounding values, i.e., from the spatial neighbors of the entry in the matrix. The application writes the matrix with the replaced values to the output text field.  

## Usage
Please use google chrome to test this code the code is optimized for google chrome only

## Remarks

1. Neighbors selection:
at first all the immidiate surrounding neighbors are selected. If all those neighbors have a 0 value then the next surrounding neighbors are selected. This porces goes on until at least one neighbor get a non-zero value. This process ensure that the code also work if there is a big chunk of 0 values at the begining.

2. Interpolation methods
Two methods have been used to interpolate the 0 values based on the standard deviation of the value of neighbors

a. if the standard deviation of the neighbors is very high (>15 this parameter can be reset at line no.126)
then 0 is replaced with the average of top and bottom value only with a consideration that the value changes 
considerably from column to column (column direction). Of course this could be extended for row direction 
as well but did not implemented in this code due to time limitation.

b. if the standard deviation of the neighbors is low (in this case <15) then O is replaced with the average 
of all neighboring values


Thanks...
