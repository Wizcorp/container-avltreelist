# container-avltreelist
AvlTreeList implementation in Javascript

It's a tree and a list at the same time.

To manage a pool of sorted elements. **Complexity in O(log2(n)) for addition and removal**.
Plus, **complexity in O(1)** in the best case **for repositioning an element** after updating its sorting property.
This container is best used for managing a list of element sorted when the values of the ordering properties change slowly over time.

## List of methods and their time complexity

Method            | Time Complexity
----------------- | -------------
add               | O(log2(n))
removeByReference | O(log2(n))
getCount          | O(1)
popSmallest       | O(log2(n))
popGreatest       | O(log2(n))
getSmallestAbove  | O(log2(n))
getGreatestBelow  | O(log2(n))
forEach           | O(n * p)
forEachReverse    | O(n * p)
toArray           | O(n)
clear             | O(n)
reposition        | best case in O(1), worst case in O(n)

Where:
- ```n``` is the number of elements in the tree
- ```p``` is the complexity of the process function.
- ```m``` is the number of elements that compare similarly to the given element


## API usage


To **instantiate** a new tree:
``` javascript
// In this example, myTree will hold elements sorted by zIndex
function myComparisonFunction(a, b) {
	return a.zIndex - b.zIndex;
}

var myTree = new AvlTree(myComparisonFunction);
```

To **add** an element:
``` javascript
var myObjectReference = myTree.add(myObject); // O(log2(n))
```

To **remove** an element:
``` javascript
myTree.removeByReference(myObjectReference); // O(log2(n))
```

To **apply a treatment** on all the elements in sorted ordered:
``` javascript
myTree.forEach(function (object) {
	console.log(object);
});
```

To **apply a treatment** on all the elements in opposite sorted ordered:
``` javascript
myTree.forEachReverse(function (object) {
	console.log(object);
});
```

To **get the smallest element greater or equal to a given object**:
``` javascript
var myObjectAbove = myTree.getSmallestAbove({ zIndex: 4 }); // O(log2(n))
```

To **get the greatest element smaller or equal to a given object**:
``` javascript
var myObjectBelow = myTree.getGreatestBelow({ zIndex: 4 }); // O(log2(n))
```

To **convert into an array**:
``` javascript
var myArray = myTree.toArray(); // O(n)
```

To **get the number of elements in the tree**:
``` javascript
var nbElements = myTree.length;
```

To **reposition an element whose sorting property changed**:
``` javascript
var mTreey = new AvlTree(myComparisonFunction, 'avlTreeListReference'); // Setting the name of the property on which objects will keep their references
myObject.zIndex = 9;
myObject.avlTreeListReference = myTree.add(myObject);
myObject.zIndex = 10; // Sorting property (here zIndex) of element changed
myTree.reposition(myObject); // Repositioning object with respect to new sorting property value, will use the property name defined when constructing the tree, i.e 'avlTreeListReference'
```
**Note 1**: ```reposition``` method is in O(1) in the best case, and O(n) in worst case, depending on how much the value of sorting property changed.

**Note 2**: It is important to attach the object reference on the ```_avlTreeListReference``` property of the object.
