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

describe('continaer-avltreeList tests', function() {
	describe('add', function () {
		var tree;
		beforeEach(function () {
			tree = new AvlTree(sortLeftToRight);
		});
		it('should contain the added value', function () {
			tree.add(1);
			assert.strictEqual(tree.root.object, 1);
			tree.add(2);
			assert.strictEqual(tree.root.right.object, 2);
			assert.strictEqual(tree.root.height, 2);
		});
		it('should balance a right right heavy tree', function () {
			tree.add(1);
			tree.add(2);
			tree.add(3);
			assert.strictEqual(tree.root.object, 2);
			assert.strictEqual(tree.root.left.object, 1);
			assert.strictEqual(tree.root.right.object, 3);
			assert.strictEqual(tree.root.height, 2);
			assert.strictEqual(tree.root.left.height, 1);
			assert.strictEqual(tree.root.right.height, 1);
		});
		it('should balance a left left heavy tree', function () {
			tree.add(3);
			tree.add(2);
			tree.add(1);
			assert.strictEqual(tree.root.object, 2);
			assert.strictEqual(tree.root.left.object, 1);
			assert.strictEqual(tree.root.right.object, 3);
			assert.strictEqual(tree.root.height, 2);
			assert.strictEqual(tree.root.left.height, 1);
			assert.strictEqual(tree.root.right.height, 1);
		});
		it('should balance a right left heavy tree', function () {
			tree.add(1);
			tree.add(3);
			tree.add(2);
			assert.strictEqual(tree.root.object, 2);
			assert.strictEqual(tree.root.left.object, 1);
			assert.strictEqual(tree.root.right.object, 3);
			assert.strictEqual(tree.root.height, 2);
			assert.strictEqual(tree.root.left.height, 1);
			assert.strictEqual(tree.root.right.height, 1);
		});
		it('should balance a left right heavy tree', function () {
			tree.add(3);
			tree.add(1);
			tree.add(2);
			assert.strictEqual(tree.root.object, 2);
			assert.strictEqual(tree.root.left.object, 1);
			assert.strictEqual(tree.root.right.object, 3);
			assert.strictEqual(tree.root.height, 2);
			assert.strictEqual(tree.root.left.height, 1);
			assert.strictEqual(tree.root.right.height, 1);
		});
		it('should backtrack and balance', function () {
			tree.add(1);
			tree.add(2);
			tree.add(3);
			tree.add(4);
			tree.add(5);
			tree.add(6);
			assert.strictEqual(tree.root.object, 4);
			assert.strictEqual(tree.root.height, 3);
			assert.strictEqual(tree.root.left.object, 2);
			assert.strictEqual(tree.root.left.height, 2);
			assert.strictEqual(tree.root.left.left.object, 1);
			assert.strictEqual(tree.root.left.left.height, 1);
			assert.strictEqual(tree.root.left.right.object, 3);
			assert.strictEqual(tree.root.left.right.height, 1);
			assert.strictEqual(tree.root.right.object, 5);
			assert.strictEqual(tree.root.right.height, 2);
			assert.strictEqual(tree.root.right.right.object, 6);
			assert.strictEqual(tree.root.right.right.height, 1);
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
			assert.strictEqual(tree.root.right, null);
			assert.strictEqual(tree.root.object, 1);
			assert.strictEqual(tree.root.height, 1);
		});
		it('should removeByReference the root from the tree', function () {
			var one = tree.add(1);
			tree.removeByReference(one);
			assert.strictEqual(tree.root, null);
		});
		it('should removeByReference and replace the root', function () {
			var one = tree.add(1);
			tree.add(2);
			tree.removeByReference(one);
			assert.strictEqual(tree.root.object, 2);
			assert.strictEqual(tree.root.height, 1);
		});
		it('should remove an object with only left children', function () {
			tree.add(3);
			var two = tree.add(2);
			assert.strictEqual(tree.root.height, 2);
			assert.strictEqual(tree.root.left.height, 1);
			tree.removeByReference(two);
			assert.strictEqual(tree.root.object, 3);
			assert.strictEqual(tree.root.height, 1);
		});
		it('should remove an object with only right children', function () {
			tree.add(1);
			var two = tree.add(2);
			tree.removeByReference(two);
			assert.strictEqual(tree.root.object, 1);
			assert.strictEqual(tree.root.height, 1);
			assert.strictEqual(tree.root.right, null);
			assert.strictEqual(tree.root.left, null);
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
			assert.strictEqual(tree.root.object, 50);
			assert.strictEqual(tree.root.height, 5);
			assert.strictEqual(tree.root.left.object, 25);
			assert.strictEqual(tree.root.left.height, 4);
			assert.strictEqual(tree.root.right.object, 75);
			assert.strictEqual(tree.root.right.height, 3);
			assert.strictEqual(tree.root.left.left.object, 10);
			assert.strictEqual(tree.root.left.left.height, 3);
			assert.strictEqual(tree.root.left.right.object, 30);
			assert.strictEqual(tree.root.left.right.height, 2);
			assert.strictEqual(tree.root.right.left.object, 60);
			assert.strictEqual(tree.root.right.left.height, 2);
			assert.strictEqual(tree.root.right.right.object, 80);
			assert.strictEqual(tree.root.right.right.height, 1);
			assert.strictEqual(tree.root.left.left.left.object, 5);
			assert.strictEqual(tree.root.left.left.left.height, 2);
			assert.strictEqual(tree.root.left.left.right.object, 15);
			assert.strictEqual(tree.root.left.left.right.height, 1);
			assert.strictEqual(tree.root.left.right.left.object, 27);
			assert.strictEqual(tree.root.left.right.left.height, 1);
			assert.strictEqual(tree.root.right.left.left.object, 55);
			assert.strictEqual(tree.root.right.left.left.height, 1);
			assert.strictEqual(tree.root.left.left.left.left.object, 1);
			assert.strictEqual(tree.root.left.left.left.left.height, 1);
			tree.removeByReference(eighty);
			assert.strictEqual(tree.root.object, 25);
			assert.strictEqual(tree.root.height, 4);
			assert.strictEqual(tree.root.left.object, 10);
			assert.strictEqual(tree.root.left.height, 3);
			assert.strictEqual(tree.root.right.object, 50);
			assert.strictEqual(tree.root.right.height, 3);
			assert.strictEqual(tree.root.left.left.object, 5);
			assert.strictEqual(tree.root.left.left.height, 2);
			assert.strictEqual(tree.root.left.right.object, 15);
			assert.strictEqual(tree.root.left.right.height, 1);
			assert.strictEqual(tree.root.right.left.object, 30);
			assert.strictEqual(tree.root.right.left.height, 2);
			assert.strictEqual(tree.root.right.right.object, 60);
			assert.strictEqual(tree.root.right.right.height, 2);
			assert.strictEqual(tree.root.left.left.left.object, 1);
			assert.strictEqual(tree.root.left.left.left.height, 1);
			assert.strictEqual(tree.root.right.left.left.object, 27);
			assert.strictEqual(tree.root.right.left.left.height, 1);
			assert.strictEqual(tree.root.right.right.left.object, 55);
			assert.strictEqual(tree.root.right.right.left.height, 1);
			assert.strictEqual(tree.root.right.right.right.object, 75);
			assert.strictEqual(tree.root.right.right.right.height, 1);
		});
		it('should remove an object with two children', function () {
			tree.add(1);
			tree.add(2);
			tree.add(3);
			var four = tree.add(4);
			tree.add(5);
			tree.removeByReference(four);

			assert.strictEqual(tree.root.object, 2);
			assert.strictEqual(tree.root.height, 3);
			assert.strictEqual(tree.root.left.object, 1);
			assert.strictEqual(tree.root.left.height, 1);
			assert.strictEqual(tree.root.right.object, 5);
			assert.strictEqual(tree.root.right.height, 2);
			assert.strictEqual(tree.root.right.left.object, 3);
			assert.strictEqual(tree.root.right.left.height, 1);
		});
		it('should remove the root object with two children', function () {
			tree.add(1);
			var two = tree.add(2);
			tree.add(3);
			tree.removeByReference(two);

			assert.strictEqual(tree.root.object, 3);
			assert.strictEqual(tree.root.height, 2);
			assert.strictEqual(tree.root.left.object, 1);
			assert.strictEqual(tree.root.left.height, 1);
			assert.strictEqual(tree.root.right, null);
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

			assert.strictEqual(tree.root.object, 5);
			assert.strictEqual(tree.root.height, 3);

			assert.strictEqual(tree.root.left.object, 2);
			assert.strictEqual(tree.root.left.height, 2);
			assert.strictEqual(tree.root.right.object, 6);
			assert.strictEqual(tree.root.right.height, 2);

			assert.strictEqual(tree.root.left.left.object, 1);
			assert.strictEqual(tree.root.left.left.height, 1);
			assert.strictEqual(tree.root.left.right.object, 3);
			assert.strictEqual(tree.root.left.right.height, 1);
			assert.strictEqual(tree.root.right.right.object, 7);
			assert.strictEqual(tree.root.right.right.height, 1);
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
			assert.strictEqual(tree.root.object, 16);
			assert.strictEqual(tree.root.height, 5);

			assert.strictEqual(tree.root.left.object, 8);
			assert.strictEqual(tree.root.left.height, 4);
			assert.strictEqual(tree.root.right.object, 20);
			assert.strictEqual(tree.root.right.height, 4);

			assert.strictEqual(tree.root.left.left.object, 5);
			assert.strictEqual(tree.root.left.left.height, 3);
			assert.strictEqual(tree.root.left.right.object, 12);
			assert.strictEqual(tree.root.left.right.height, 3);
			assert.strictEqual(tree.root.right.left.object, 18);
			assert.strictEqual(tree.root.right.left.height, 2);
			assert.strictEqual(tree.root.right.right.object, 22);
			assert.strictEqual(tree.root.right.right.height, 3);

			assert.strictEqual(tree.root.left.left.left.object, 2);
			assert.strictEqual(tree.root.left.left.left.height, 2);
			assert.strictEqual(tree.root.left.left.right.object, 6);
			assert.strictEqual(tree.root.left.left.right.height, 2);
			assert.strictEqual(tree.root.left.right.left.object, 10);
			assert.strictEqual(tree.root.left.right.left.height, 2);
			assert.strictEqual(tree.root.left.right.right.object, 14);
			assert.strictEqual(tree.root.left.right.right.height, 2);
			assert.strictEqual(tree.root.right.left.left.object, 17);
			assert.strictEqual(tree.root.right.left.left.height, 1);
			assert.strictEqual(tree.root.right.left.right.object, 19);
			assert.strictEqual(tree.root.right.left.right.height, 1);
			assert.strictEqual(tree.root.right.right.left.object, 21);
			assert.strictEqual(tree.root.right.right.left.height, 1);
			assert.strictEqual(tree.root.right.right.right.object, 23);
			assert.strictEqual(tree.root.right.right.right.height, 2);

			assert.strictEqual(tree.root.left.left.left.left.object, 1);
			assert.strictEqual(tree.root.left.left.left.left.height, 1);
			assert.strictEqual(tree.root.left.left.left.right.object, 3);
			assert.strictEqual(tree.root.left.left.left.right.height, 1);
			assert.strictEqual(tree.root.left.left.right.right.object, 7);
			assert.strictEqual(tree.root.left.left.right.right.height, 1);
			assert.strictEqual(tree.root.left.right.left.left.object, 9);
			assert.strictEqual(tree.root.left.right.left.left.height, 1);
			assert.strictEqual(tree.root.left.right.left.right.object, 11);
			assert.strictEqual(tree.root.left.right.left.right.height, 1);
			assert.strictEqual(tree.root.left.right.right.left.object, 13);
			assert.strictEqual(tree.root.left.right.right.left.height, 1);
			assert.strictEqual(tree.root.right.right.right.right.object, 24);
			assert.strictEqual(tree.root.right.right.right.right.height, 1);

			tree.removeByReference(three); // leaf
			assert.strictEqual(tree.root.object, 16);
			assert.strictEqual(tree.root.height, 5);

			assert.strictEqual(tree.root.left.object, 8);
			assert.strictEqual(tree.root.left.height, 4);
			assert.strictEqual(tree.root.right.object, 20);
			assert.strictEqual(tree.root.right.height, 4);

			assert.strictEqual(tree.root.left.left.object, 5);
			assert.strictEqual(tree.root.left.left.height, 3);
			assert.strictEqual(tree.root.left.right.object, 12);
			assert.strictEqual(tree.root.left.right.height, 3);
			assert.strictEqual(tree.root.right.left.object, 18);
			assert.strictEqual(tree.root.right.left.height, 2);
			assert.strictEqual(tree.root.right.right.object, 22);
			assert.strictEqual(tree.root.right.right.height, 3);

			assert.strictEqual(tree.root.left.left.left.object, 2);
			assert.strictEqual(tree.root.left.left.left.height, 2);
			assert.strictEqual(tree.root.left.left.right.object, 6);
			assert.strictEqual(tree.root.left.left.right.height, 2);
			assert.strictEqual(tree.root.left.right.left.object, 10);
			assert.strictEqual(tree.root.left.right.left.height, 2);
			assert.strictEqual(tree.root.left.right.right.object, 14);
			assert.strictEqual(tree.root.left.right.right.height, 2);
			assert.strictEqual(tree.root.right.left.left.object, 17);
			assert.strictEqual(tree.root.right.left.left.height, 1);
			assert.strictEqual(tree.root.right.left.right.object, 19);
			assert.strictEqual(tree.root.right.left.right.height, 1);
			assert.strictEqual(tree.root.right.right.left.object, 21);
			assert.strictEqual(tree.root.right.right.left.height, 1);
			assert.strictEqual(tree.root.right.right.right.object, 23);
			assert.strictEqual(tree.root.right.right.right.height, 2);

			assert.strictEqual(tree.root.left.left.left.left.object, 1);
			assert.strictEqual(tree.root.left.left.left.left.height, 1);
			assert.strictEqual(tree.root.left.left.right.right.object, 7);
			assert.strictEqual(tree.root.left.left.right.right.height, 1);
			assert.strictEqual(tree.root.left.right.left.left.object, 9);
			assert.strictEqual(tree.root.left.right.left.left.height, 1);
			assert.strictEqual(tree.root.left.right.left.right.object, 11);
			assert.strictEqual(tree.root.left.right.left.right.height, 1);
			assert.strictEqual(tree.root.left.right.right.left.object, 13);
			assert.strictEqual(tree.root.left.right.right.left.height, 1);
			assert.strictEqual(tree.root.right.right.right.right.object, 24);
			assert.strictEqual(tree.root.right.right.right.right.height, 1);

			tree.removeByReference(two);
			tree.removeByReference(six);
			tree.removeByReference(five);
			tree.removeByReference(seven);
			assert.strictEqual(tree.root.object, 16);
			assert.strictEqual(tree.root.height, 5);

			assert.strictEqual(tree.root.left.object, 12);
			assert.strictEqual(tree.root.left.height, 4);
			assert.strictEqual(tree.root.right.object, 20);
			assert.strictEqual(tree.root.right.height, 4);

			assert.strictEqual(tree.root.left.left.object, 8);
			assert.strictEqual(tree.root.left.left.height, 3);
			assert.strictEqual(tree.root.left.right.object, 14);
			assert.strictEqual(tree.root.left.right.height, 2);
			assert.strictEqual(tree.root.right.left.object, 18);
			assert.strictEqual(tree.root.right.left.height, 2);
			assert.strictEqual(tree.root.right.right.object, 22);
			assert.strictEqual(tree.root.right.right.height, 3);

			assert.strictEqual(tree.root.left.left.left.object, 1);
			assert.strictEqual(tree.root.left.left.left.height, 1);
			assert.strictEqual(tree.root.left.left.right.object, 10);
			assert.strictEqual(tree.root.left.left.right.height, 2);
			assert.strictEqual(tree.root.left.right.left.object, 13);
			assert.strictEqual(tree.root.left.right.left.height, 1);
			assert.strictEqual(tree.root.left.right.right.object, 15);
			assert.strictEqual(tree.root.left.right.right.height, 1);
			assert.strictEqual(tree.root.right.left.left.object, 17);
			assert.strictEqual(tree.root.right.left.left.height, 1);
			assert.strictEqual(tree.root.right.left.right.object, 19);
			assert.strictEqual(tree.root.right.left.right.height, 1);
			assert.strictEqual(tree.root.right.right.left.object, 21);
			assert.strictEqual(tree.root.right.right.left.height, 1);
			assert.strictEqual(tree.root.right.right.right.object, 23);
			assert.strictEqual(tree.root.right.right.right.height, 2);

			assert.strictEqual(tree.root.left.left.right.left.object, 9);
			assert.strictEqual(tree.root.left.left.right.left.height, 1);
			assert.strictEqual(tree.root.left.left.right.right.object, 11);
			assert.strictEqual(tree.root.left.left.right.right.height, 1);
			assert.strictEqual(tree.root.right.right.right.right.object, 24);
			assert.strictEqual(tree.root.right.right.right.right.height, 1);
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
			assert.strictEqual(tree.root.object, 16);
			assert.strictEqual(tree.root.height, 5);

			assert.strictEqual(tree.root.left.object, 8);
			assert.strictEqual(tree.root.left.height, 4);
			assert.strictEqual(tree.root.right.object, 21);
			assert.strictEqual(tree.root.right.height, 3);

			assert.strictEqual(tree.root.left.left.object, 4);
			assert.strictEqual(tree.root.left.left.height, 3);
			assert.strictEqual(tree.root.left.right.object, 12);
			assert.strictEqual(tree.root.left.right.height, 3);
			assert.strictEqual(tree.root.right.left.object, 18);
			assert.strictEqual(tree.root.right.left.height, 2);
			assert.strictEqual(tree.root.right.right.object, 23);
			assert.strictEqual(tree.root.right.right.height, 2);

			assert.strictEqual(tree.root.left.left.left.object, 2);
			assert.strictEqual(tree.root.left.left.left.height, 2);
			assert.strictEqual(tree.root.left.left.right.object, 6);
			assert.strictEqual(tree.root.left.left.right.height, 2);
			assert.strictEqual(tree.root.left.right.left.object, 10);
			assert.strictEqual(tree.root.left.right.left.height, 2);
			assert.strictEqual(tree.root.left.right.right.object, 14);
			assert.strictEqual(tree.root.left.right.right.height, 2);
			assert.strictEqual(tree.root.right.left.left.object, 17);
			assert.strictEqual(tree.root.right.left.left.height, 1);
			assert.strictEqual(tree.root.right.left.right.object, 19);
			assert.strictEqual(tree.root.right.left.right.height, 1);
			assert.strictEqual(tree.root.right.right.left.object, 22);
			assert.strictEqual(tree.root.right.right.left.height, 1);
			assert.strictEqual(tree.root.right.right.right.object, 24);
			assert.strictEqual(tree.root.right.right.right.height, 1);

			assert.strictEqual(tree.root.left.left.left.left.object, 1);
			assert.strictEqual(tree.root.left.left.left.left.height, 1);
			assert.strictEqual(tree.root.left.left.left.right.object, 3);
			assert.strictEqual(tree.root.left.left.left.right.height, 1);
			assert.strictEqual(tree.root.left.left.right.left.object, 5);
			assert.strictEqual(tree.root.left.left.right.left.height, 1);
			assert.strictEqual(tree.root.left.left.right.right.object, 7);
			assert.strictEqual(tree.root.left.left.right.right.height, 1);
			assert.strictEqual(tree.root.left.right.left.left.object, 9);
			assert.strictEqual(tree.root.left.right.left.left.height, 1);
			assert.strictEqual(tree.root.left.right.left.right.object, 11);
			assert.strictEqual(tree.root.left.right.left.right.height, 1);
			assert.strictEqual(tree.root.left.right.right.left.object, 13);
			assert.strictEqual(tree.root.left.right.right.left.height, 1);
			assert.strictEqual(tree.root.left.right.right.right.object, 15);
			assert.strictEqual(tree.root.left.right.right.right.height, 1);
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
			assert.strictEqual(tree.root.object, 17);
			assert.strictEqual(tree.root.height, 5);

			assert.strictEqual(tree.root.left.object, 8);
			assert.strictEqual(tree.root.left.height, 4);
			assert.strictEqual(tree.root.right.object, 20);
			assert.strictEqual(tree.root.right.height, 4);

			assert.strictEqual(tree.root.left.left.object, 4);
			assert.strictEqual(tree.root.left.left.height, 3);
			assert.strictEqual(tree.root.left.right.object, 12);
			assert.strictEqual(tree.root.left.right.height, 3);
			assert.strictEqual(tree.root.right.left.object, 18);
			assert.strictEqual(tree.root.right.left.height, 2);
			assert.strictEqual(tree.root.right.right.object, 22);
			assert.strictEqual(tree.root.right.right.height, 3);

			assert.strictEqual(tree.root.left.left.left.object, 2);
			assert.strictEqual(tree.root.left.left.left.height, 2);
			assert.strictEqual(tree.root.left.left.right.object, 6);
			assert.strictEqual(tree.root.left.left.right.height, 2);
			assert.strictEqual(tree.root.left.right.left.object, 10);
			assert.strictEqual(tree.root.left.right.left.height, 2);
			assert.strictEqual(tree.root.left.right.right.object, 14);
			assert.strictEqual(tree.root.left.right.right.height, 2);
			assert.strictEqual(tree.root.right.left.right.object, 19);
			assert.strictEqual(tree.root.right.left.right.height, 1);
			assert.strictEqual(tree.root.right.right.left.object, 21);
			assert.strictEqual(tree.root.right.right.left.height, 1);
			assert.strictEqual(tree.root.right.right.right.object, 23);
			assert.strictEqual(tree.root.right.right.right.height, 2);

			assert.strictEqual(tree.root.left.left.left.left.object, 1);
			assert.strictEqual(tree.root.left.left.left.left.height, 1);
			assert.strictEqual(tree.root.left.left.left.right.object, 3);
			assert.strictEqual(tree.root.left.left.left.right.height, 1);
			assert.strictEqual(tree.root.left.left.right.left.object, 5);
			assert.strictEqual(tree.root.left.left.right.left.height, 1);
			assert.strictEqual(tree.root.left.left.right.right.object, 7);
			assert.strictEqual(tree.root.left.left.right.right.height, 1);
			assert.strictEqual(tree.root.left.right.left.left.object, 9);
			assert.strictEqual(tree.root.left.right.left.left.height, 1);
			assert.strictEqual(tree.root.left.right.left.right.object, 11);
			assert.strictEqual(tree.root.left.right.left.right.height, 1);
			assert.strictEqual(tree.root.left.right.right.left.object, 13);
			assert.strictEqual(tree.root.left.right.right.left.height, 1);
			assert.strictEqual(tree.root.right.right.right.right.object, 24);
			assert.strictEqual(tree.root.right.right.right.right.height, 1);
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
			assert.strictEqual(tree.root.object, 5);
			assert.strictEqual(tree.root.height, 3);

			assert.strictEqual(tree.root.left.object, 2);
			assert.strictEqual(tree.root.left.height, 2);
			assert.strictEqual(tree.root.right.object, 10);
			assert.strictEqual(tree.root.right.height, 2);

			assert.strictEqual(tree.root.left.left.object, 1);
			assert.strictEqual(tree.root.left.left.height, 1);
			assert.strictEqual(tree.root.left.right.object, 4);
			assert.strictEqual(tree.root.left.right.height, 1);
			assert.strictEqual(tree.root.right.right.object, 11);
			assert.strictEqual(tree.root.right.right.height, 1);
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
			assert.strictEqual(tree.root.object, 5);
			assert.strictEqual(tree.root.height, 3);

			assert.strictEqual(tree.root.left.object, 2);
			assert.strictEqual(tree.root.left.height, 2);
			assert.strictEqual(tree.root.right.object, 10);
			assert.strictEqual(tree.root.right.height, 2);

			assert.strictEqual(tree.root.left.left.object, 1);
			assert.strictEqual(tree.root.left.left.height, 1);
			assert.strictEqual(tree.root.left.right.object, 4);
			assert.strictEqual(tree.root.left.right.height, 1);
			assert.strictEqual(tree.root.right.right.object, 11);
			assert.strictEqual(tree.root.right.right.height, 1);
		});
		it('should not crash if the tree is empty', function () {
			tree.removeByReference(5);
		});
		it('should not crash if the object is not in the tree', function () {
			tree.add(4);
			tree.removeByReference(5);
		});
		it('should clear, nodes containers should be nulled out', function () {
			var a = tree.add(1);
			var b = tree.add(2);
			var c = tree.add(3);
			tree.clear();
			assert.strictEqual(a.container, null);
			assert.strictEqual(b.container, null);
			assert.strictEqual(c.container, null);

			assert.strictEqual(a.left, null);
			assert.strictEqual(a.right, null);
			assert.strictEqual(a.parent, null);
			assert.strictEqual(a.height, 1);

			assert.strictEqual(b.left, null);
			assert.strictEqual(b.right, null);
			assert.strictEqual(b.parent, null);
			assert.strictEqual(b.height, 1);

			assert.strictEqual(c.left, null);
			assert.strictEqual(c.right, null);
			assert.strictEqual(c.parent, null);
			assert.strictEqual(c.height, 1);

			assert.strictEqual(tree.root, null);
			assert.strictEqual(tree.length, 0);
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
			var sorted = testArray.sort(sortLeftToRight);
			tree.forEach(function (item) {
				assert.strictEqual(sorted.shift(), item);
			});
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

			var sorted = testArray.sort(sortLeftToRight);
			tree.forEach(function (item) {
				assert.strictEqual(sorted.shift(), item);
			});
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