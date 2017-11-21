# Bad-Value-Filter-from-Images
A JavaScript / HTML program that lets the user open a CSV file from disk, displays it in a text box, processes it, and displays the output in another text box. The CSV file basically contains a 2D matrix of numbers representing cell values of an image, where each line holds a single row, e.g.: “2&lt;delim>4&lt;delim>99&lt;delim>\n”. The delimiter can be either space or a single comma (‘,’).  The output in the same format as the input. Once the input data is read, the application performs filtering of “bad” values. Any entry of the matrix is “bad” when it has a value of 0 (zero). The application replaces these bad values and compute the true value by interpolating it from the surrounding values, i.e., from the spatial neighbors of the entry in the matrix. The application writes the matrix with the replaced values to the output text field.
