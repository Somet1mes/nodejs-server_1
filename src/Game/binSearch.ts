/*

    My binary search algorithm

    Imports:
    elem - the element to find
    array - the array to search in
    comp - the function to compare values in the array with
    Exports:
    index - the position of the searched element. Returns -1 if none found

*/

export default function binSearch(elem, array, comp)
{
    let b = array.length;
    let a = 0;

    while(a < b)
    {
        b = Math.ceil((b - a)/2);
    }

}