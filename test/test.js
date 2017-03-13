var assert = require('assert');
var AvlTree = require('../index.js');

function sortLeftToRight(a, b) {
	if (a < b) {
		return -1
	} else if (a > b) {
		return 1;
	}
	return 0;
}

function isBalanced(node) {
	if (node === null) {
		return true;
	}

	var heightLeft  = (node.left  === null) ? 0 : node.left.height;
	var heightRight = (node.right === null) ? 0 : node.right.height;

	if (Math.abs(heightLeft - heightRight) > 1 || node.height <= heightLeft || node.height <= heightRight) {
		return false;
	}

	return isBalanced(node.left) && isBalanced(node.right);
}

function isTreeCountConsistent(tree) {
	return getTreeCount(tree.root) === tree.length;
}

function isListCountConsistent(tree) {
	return getListCount(tree) === tree.length;
}

function getTreeCount(node) {
	if (node === null) {
		return 0;
	}

	return 1 + getTreeCount(node.left) + getTreeCount(node.right);
}

function getListCount(tree) {
	var first = tree.first;
	var count = 0;
	for (var current = first; current; current = current.next) {
		count += 1;
	}

	return count;
}

function isTreeSorted(tree, node) {
	if (node === null) {
		return true;
	}

	var isSortedLeft  = (node.left  === null) || (tree.cmpFunc(node.left.object, node.object)  <= 0);
	var isSortedRight = (node.right === null) || (tree.cmpFunc(node.object, node.right.object) <= 0);

	return isSortedLeft && isSortedRight && isTreeSorted(tree, node.left) && isTreeSorted(tree, node.right);
}

function isListSorted(tree) {
	var first = tree.first;
	if (first === null) {
		return true;
	}

	var previous = first.object;
	for (var current = first.next; current !== null; current = current.next) {
		if (tree.cmpFunc(previous, current.object) > 0) {
			return false;
		}
	}

	return true;
}


function assertTree(tree, nbElements) {
	assert.strictEqual(getListCount(tree), nbElements);
	assert.strictEqual(getTreeCount(tree.root), nbElements);
	assert.strictEqual(isTreeSorted(tree, tree.root), true);
	assert.strictEqual(isListSorted(tree), true);
	assert.strictEqual(isTreeCountConsistent(tree), true);
	assert.strictEqual(isListCountConsistent(tree), true);
	assert.strictEqual(isBalanced(tree.root), true);
}

describe('continaer-avltreeList tests', function() {
	describe('add', function () {
		var tree;
		beforeEach(function () {
			tree = new AvlTree(sortLeftToRight);
		});
		it('should contain the added value', function () {
			tree.add(1);

			assertTree(tree, 1);

			tree.add(2);

			assertTree(tree, 2);
		});
		it('should balance a right right heavy tree', function () {
			tree.add(1);
			tree.add(2);
			tree.add(3);

			assertTree(tree, 3);
		});
		it('should balance a left left heavy tree', function () {
			tree.add(3);
			tree.add(2);
			tree.add(1);

			assertTree(tree, 3);
		});
		it('should balance a right left heavy tree', function () {
			tree.add(1);
			tree.add(3);
			tree.add(2);

			assertTree(tree, 3);
		});
		it('should balance a left right heavy tree', function () {
			tree.add(3);
			tree.add(1);
			tree.add(2);

			assertTree(tree, 3);
		});
		it('should backtrack and balance', function () {
			tree.add(1);
			tree.add(2);
			tree.add(3);
			tree.add(4);
			tree.add(5);
			tree.add(6);

			assertTree(tree, 6);
		});
	});
	describe('removeByReference', function () {
		var tree;
		beforeEach(function () {
			tree = new AvlTree(sortLeftToRight);
		});
		it('should remove a leaf object from the tree', function () {
			tree.add(1);
			var two = tree.add(2);
			tree.removeByReference(two);

			assertTree(tree, 1);
		});
		it('should removeByReference the root from the tree', function () {
			var one = tree.add(1);
			tree.removeByReference(one);
			assertTree(tree, 0);
		});
		it('should removeByReference and replace the root', function () {
			var one = tree.add(1);
			tree.add(2);
			tree.removeByReference(one);

			assertTree(tree, 1);
		});
		it('should remove an object with only left children', function () {
			tree.add(3);
			var two = tree.add(2);
			assertTree(tree, 2);
			tree.removeByReference(two);

			assertTree(tree, 1);
		});
		it('should remove an object with only right children', function () {
			tree.add(1);
			var two = tree.add(2);
			tree.removeByReference(two);

			assertTree(tree, 1);
		});
		it('should balance a large tree', function () {
			tree.add(50);
			tree.add(25);
			tree.add(75);
			tree.add(10);
			tree.add(30);
			tree.add(60);
			var eighty = tree.add(80);
			tree.add(5);
			tree.add(15);
			tree.add(27);
			tree.add(55);
			tree.add(1);

			assertTree(tree, 12);

			tree.removeByReference(eighty);

			assertTree(tree, 11);
		});
		it('should remove an object with two children', function () {
			tree.add(1);
			tree.add(2);
			tree.add(3);
			var four = tree.add(4);
			tree.add(5);
			tree.removeByReference(four);

			assertTree(tree, 4);
		});
		it('should remove the root object with two children', function () {
			tree.add(1);
			var two = tree.add(2);
			tree.add(3);
			tree.removeByReference(two);

			assertTree(tree, 2);
		});
		it('should remove the root object with two children on a larger tree', function () {
			var four = tree.add(4);
			tree.add(2);
			tree.add(6);
			tree.add(1);
			tree.add(5);
			tree.add(3);
			tree.add(7);
			tree.removeByReference(four);

			assertTree(tree, 6);
		});
		it('should remove an element with two children, with a large tree, near bottom', function () {
			tree.add(1);
			var two = tree.add(2);
			var three = tree.add(3);
			var four = tree.add(4);
			var five = tree.add(5);
			var six = tree.add(6);
			var seven = tree.add(7);
			tree.add(8);
			tree.add(9);
			tree.add(10);
			tree.add(11);
			tree.add(12);
			tree.add(13);
			tree.add(14);
			tree.add(15);
			tree.add(16);
			tree.add(17);
			tree.add(18);
			tree.add(19);
			tree.add(20);
			tree.add(21);
			tree.add(22);
			tree.add(23);
			tree.add(24);
			tree.removeByReference(four);

			assertTree(tree, 23);

			tree.removeByReference(three); // leaf

			assertTree(tree, 22);

			tree.removeByReference(two);
			tree.removeByReference(six);
			tree.removeByReference(five);
			tree.removeByReference(seven);

			assertTree(tree, 18);
		});
		it('should remove an object with two children, with a large tree, near root', function () {
			tree.add(1);
			tree.add(2);
			tree.add(3);
			tree.add(4);
			tree.add(5);
			tree.add(6);
			tree.add(7);
			tree.add(8);
			tree.add(9);
			tree.add(10);
			tree.add(11);
			tree.add(12);
			tree.add(13);
			tree.add(14);
			tree.add(15);
			tree.add(16);
			tree.add(17);
			tree.add(18);
			tree.add(19);
			var twenty = tree.add(20);
			tree.add(21);
			tree.add(22);
			tree.add(23);
			tree.add(24);
			tree.removeByReference(twenty);

			assertTree(tree, 23);
		});
		it('should remove root of a large tree', function () {
			tree.add(1);
			tree.add(2);
			tree.add(3);
			tree.add(4);
			tree.add(5);
			tree.add(6);
			tree.add(7);
			tree.add(8);
			tree.add(9);
			tree.add(10);
			tree.add(11);
			tree.add(12);
			tree.add(13);
			tree.add(14);
			tree.add(15);
			var sixteen = tree.add(16);
			tree.add(17);
			tree.add(18);
			tree.add(19);
			tree.add(20);
			tree.add(21);
			tree.add(22);
			tree.add(23);
			tree.add(24);
			tree.removeByReference(sixteen);

			assertTree(tree, 23);
		});
		it('should swap object with a left left max value', function () {
			tree.add(5);
			var three = tree.add(3);
			tree.add(10);
			tree.add(2);
			tree.add(4);
			tree.add(11);
			tree.add(1);
			tree.removeByReference(three);

			assertTree(tree, 6);
		});
		it('should swap object with a left right max value', function () {
			tree.add(5);
			var three = tree.add(3);
			tree.add(10);
			tree.add(1);
			tree.add(4);
			tree.add(11);
			tree.add(2);
			tree.removeByReference(three);

			assertTree(tree, 6);
		});
		it('should not crash if the tree is empty', function () {
			tree.removeByReference(5);

			assertTree(tree, 0);
		});
		it('should not crash if the object is not in the tree', function () {
			tree.add(4);
			tree.removeByReference(5);

			assertTree(tree, 1);
		});
		it('should clear, nodes containers should be nulled out', function () {
			var a = tree.add(1);
			var b = tree.add(2);
			var c = tree.add(3);
			tree.clear();
			assert.strictEqual(a.container, null);
			assert.strictEqual(b.container, null);
			assert.strictEqual(c.container, null);

			assertTree(tree, 0);
		});

		it('should become empty, large addition and removal', function () {
			var nbElements = 5000;
			var references = [];
			for (var i = 0; i < nbElements; i += 1) {
				references[i] = tree.add(Math.round(Math.random() * 100));
			}

			assertTree(tree, nbElements);

			var half = Math.round(nbElements / 2);

			for (var i = half; i < nbElements; i += 1) {
				tree.removeByReference(references[i]);
			}

			assertTree(tree, half);

			for (var i = 0; i < half; i += 1) {
				tree.removeByReference(references[i]);
			}

			assertTree(tree, 0);
		});

		it('should remain stable, large addition and removal', function () {
			var nbIterations = 10;
			for (var j = 0; j < nbIterations; j += 1) {
				var nbOperations = 50000;
				var references = [];
				for (var i = 0; i < nbOperations; i += 1) {
					if (references.length === 0 || Math.random() < 0.6) {
						references.push(tree.add(Math.round(Math.random() * 100)));
					} else {
						var idx = Math.floor(Math.random() * references.length);
						tree.removeByReference(references[idx]);
						references.splice(idx, 1);
					}
				}

				assertTree(tree, references.length);
				tree.clear();
			}
		});
	});
	describe('forEach', function () {
		var tree;
		beforeEach(function () {
			tree = new AvlTree(sortLeftToRight);
		});
		it('should give forEach in the correct order', function () {
			var testArray = [600, 4, 1, 99, 7, 3, 10, 11, 45, 101, 500];
			for (var index in testArray) {
				tree.add(testArray[index]);
			}

			assertTree(tree, testArray.length);
		});
		it('should give the correct order after inserts and delete', function () {
			var testArray = [1,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
			tree.add(1);
			var two = tree.add(2);
			var three = tree.add(3);
			var four = tree.add(4);
			var five = tree.add(5);
			var six = tree.add(6);
			var seven = tree.add(7);
			tree.add(8);
			tree.add(9);
			tree.add(10);
			tree.add(11);
			tree.add(12);
			tree.add(13);
			tree.add(14);
			tree.add(15);
			tree.add(16);
			tree.add(17);
			tree.add(18);
			tree.add(19);
			tree.add(20);
			tree.add(21);
			tree.add(22);
			tree.add(23);
			tree.add(24);
			tree.removeByReference(four);
			tree.removeByReference(three); // leaf
			tree.removeByReference(two);
			tree.removeByReference(six);
			tree.removeByReference(five);
			tree.removeByReference(seven);

			assertTree(tree, testArray.length);
		});
	});
	describe('toArray', function () {
		var tree;
		beforeEach(function () {
			tree = new AvlTree(sortLeftToRight);
		});
		it('should give an array in the correct order', function () {
			var testArray = [600, 4, 1, 99, 7, 3, 10, 11, 45, 101, 500];
			for (var index in testArray) {
				tree.add(testArray[index]);
			}
			var sorted = testArray.sort(sortLeftToRight);
			var treeArray = tree.toArray();
			for (var index in treeArray) {
				assert.strictEqual(sorted.shift(), treeArray[index]);
			}
		});
		it('should be correct after add and remove', function () {
			var testArray = [1,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
			tree.add(1);
			var two = tree.add(2);
			var three = tree.add(3);
			var four = tree.add(4);
			var five = tree.add(5);
			var six = tree.add(6);
			var seven = tree.add(7);
			tree.add(8);
			tree.add(9);
			tree.add(10);
			tree.add(11);
			tree.add(12);
			tree.add(13);
			tree.add(14);
			tree.add(15);
			tree.add(16);
			tree.add(17);
			tree.add(18);
			tree.add(19);
			tree.add(20);
			tree.add(21);
			tree.add(22);
			tree.add(23);
			tree.add(24);
			tree.removeByReference(four);
			tree.removeByReference(three); // leaf
			tree.removeByReference(two);
			tree.removeByReference(six);
			tree.removeByReference(five);
			tree.removeByReference(seven);
			var sorted = testArray.sort(sortLeftToRight);
			var treeArray = tree.toArray();
			for (var index in treeArray) {
				assert.strictEqual(sorted.shift(), treeArray[index]);
			}
		});
	});
});

// TODO: test duplicates
// TODO: test min max related stuff