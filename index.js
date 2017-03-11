/**
 * AVL TREE Class
 *
 * @author Brice Chevalier
 *
 * @param {function} comparisonFunction comparison function that takes two parameters a and b and returns a number
 *
 * @desc Avl Tree data structure, keep elements sorted and iterable as a linked list.
 */

function TreeListNode(obj, container) {
	this.object = obj;
	this.height = 1;

	this.left  = null;
	this.right = null;

	this.previous = null;
	this.next     = null;

	this.parent    = null;
	this.container = container;
}

function AvlTreeList(comparisonFunction, referencePropertyName) {
	this.length = 0;

	this.root  = null;
	this.first = null;
	this.last  = null;

	this.cmpFunc = comparisonFunction;

	this._referenceProperty = referencePropertyName;
}

AvlTreeList.prototype._addLeft = function (node, parent) {
	node.previous = parent.previous;
	node.next = parent;
	node.parent = parent;

	parent.left = node;
	parent.previous = node;

	if (node.previous) {
		node.previous.next = node;
	}

	if (parent === this.first) {
		this.first = node;
	}
};

AvlTreeList.prototype._addRight = function (node, parent) {
	node.previous = parent;
	node.next = parent.next;
	node.parent = parent;

	parent.right = node;
	parent.next = node;

	if (node.next) {
		node.next.previous = node;
	}

	if (parent === this.last) {
		this.last = node;
	}
};

AvlTreeList.prototype.popSmallest = function () {
	var smallestNode = this.first;
	this.removeByReference(smallestNode);
	return smallestNode.object;
};

AvlTreeList.prototype.popGreatest = function () {
	var greatestNode = this.last;
	this.removeByReference(greatestNode);
	return greatestNode.object;
};

AvlTreeList.prototype.add = function (obj) {
	this.length += 1;
	var newNode = new TreeListNode(obj, this);
	if (this.root === null) {
		this.root  = newNode;
		this.first = newNode;
		this.last  = newNode;
		return newNode;
	}

	var current = this.root;
	while (true) {
		var cmp = this.cmpFunc(obj, current.object);
		if (cmp < 0) {
			// Adding to the left
			if (current.left === null) {
				this._addLeft(newNode, current);
				break;
			} else {
				current = current.left;
			}
		} else if (cmp > 0) {
			// Adding to the right
			if (current.right === null) {
				this._addRight(newNode, current);
				break;
			} else {
				current = current.right;
			}
		} else {
			// In case of equal comparison, adding to the right
			if (current.right === null) {
				this._addRight(newNode, current);
				break;
			} else {
				current = current.right;
			}
		}
	}

	if (current.height === 1) {
		this._balance(newNode.parent, false);
	}

	return newNode;
};

AvlTreeList.prototype._balanceLeftRight = function (node) {
	var left  = node.left;
	var right = left.right;

	var a = left.left;
	var b = right.left;

	right.left = left;
	node.left  = right;

	right.parent = node;
	left.parent  = right;

	left.left  = a;
	left.right = b;

	var aHeight = 0;
	if (a !== null) {
		aHeight = a.height;
		a.parent = left;
	}

	var bHeight = 0;
	if (b !== null) {
		bHeight = b.height;
		b.parent = left;
	}
	
	var leftHeight = ((aHeight > bHeight) ? aHeight : bHeight) + 1;
	left.height = leftHeight;

	var rightHeight = (right.right === null) ? 0 : right.right.height;
	right.height = ((leftHeight > rightHeight) ? leftHeight : rightHeight) + 1;
};

AvlTreeList.prototype._balanceLeftLeft = function (node) {
	var left = node.left;
	var c = left.right;

	var parent = node.parent;
	if (node === this.root) {
		this.root = left;
	} else {
		if (parent.right === node) {
			parent.right = left;
		} else {
			parent.left = left;
		}
	}

	left.right = node;
	left.parent = parent;
	node.parent = left;
	node.left = c;

	var leftHeight;
	if (c === null) {
		leftHeight = 0;
	} else {
		c.parent = node;
		leftHeight = c.height;
	}

	var rightHeight = (node.right === null) ? 0 : node.right.height;
	node.height = ((leftHeight > rightHeight) ? leftHeight : rightHeight) + 1;
};

AvlTreeList.prototype._balanceRightLeft = function (node) {
	var right = node.right;
	var left = right.left;

	var a = right.right;
	var b = left.right;

	left.right = right;
	node.right = left;

	left.parent  = node;
	right.parent = left;

	right.right = a;
	right.left  = b;

	var aHeight = 0;
	if (a !== null) {
		aHeight = a.height;
		a.parent = right;
	}

	var bHeight = 0;
	if (b !== null) {
		bHeight = b.height;
		b.parent = right;
	}
	
	var rightHeight = ((aHeight > bHeight) ? aHeight : bHeight) + 1;
	right.height = rightHeight;

	var leftHeight = (left.left === null) ? 0 : left.left.height;
	left.height = ((leftHeight > rightHeight) ? leftHeight : rightHeight) + 1;
};


AvlTreeList.prototype._balanceRightRight = function (node) {
	var right = node.right;
	var c = right.left;

	if (node === this.root) {
		this.root = right;
	} else {
		if (node.parent.left === node) {
			node.parent.left = right;
		} else {
			node.parent.right = right;
		}
	}

	right.left = node;
	right.parent = node.parent;
	node.parent = right;
	node.right = c;

	var rightHeight;
	if (c === null) {
		rightHeight = 0;
	} else {
		c.parent = node;
		rightHeight = c.height;
	}

	var leftHeight = (node.left === null) ? 0 : node.left.height;
	node.height = ((leftHeight > rightHeight) ? leftHeight : rightHeight) + 1;
};

AvlTreeList.prototype._balance = function (node, goAllTheWay) {
	// Balancing the tree
	var current = node;
	while (current !== null) {
		var left  = current.left;
		var right = current.right;

		var leftHeight  = (left  === null) ? 0 : left.height;
		var rightHeight = (right === null) ? 0 : right.height;

		if (leftHeight - rightHeight > 1) {
			// Left case
			if (left.right !== null && (left.left === null || left.left.height < left.right.height)) {
				// Left Right Case
				this._balanceLeftRight(current);
			}

			// Left Left Case
			this._balanceLeftLeft(current);
		} else if (rightHeight - leftHeight > 1) {
			// Right case
			if (right.left !== null && (right.right === null || right.right.height < right.left.height)) {
				// Right Left Case
				this._balanceRightLeft(current);
			}

			// Right Right Case
			this._balanceRightRight(current);
		} else {
			// TreeNode is balanced
			var newHeight = ((leftHeight > rightHeight) ? leftHeight : rightHeight) + 1;
			if (!goAllTheWay) {
				if (newHeight === current.height) {
					break;
				}
			}

			current.height = newHeight;
		}

		current = current.parent;
	}
};

AvlTreeList.prototype.removeByReference = function (node) {
	if (node.container !== this) {
		return node;
	}

	this.length -= 1;

	if (node.previous === null) {
		this.first = node.next;
	} else {
		node.previous.next = node.next;
	}
	if (node.next === null) {
		this.last = node.previous;
	} else {
		node.next.previous = node.previous;
	}

	// Replacing the node by the smallest element greater than it
	var parent = node.parent;
	var left   = node.left;
	var right  = node.right;

	if (node.right === null) {
		if (left !== null) {
			left.parent = parent;
		}

		if (parent === null) {
			this.root = left;
		} else {
			if (parent.right === node) {
				parent.right = left;
			} else {
				parent.left = left;
			}

			if (left === null) {
				this._balance(parent, true);
			} else {
				if (left.height + 3 <= parent.height) {
					this._balance(parent, true);
				}
			}
		}

		return true;
	}

	var replacement = node.right;
	if (replacement.left === null) {
		if (left !== null) {
			left.parent = replacement;
		}
		replacement.left = left;

		if (parent === null) {
			this.root = replacement;
		} else {
			if (parent.right === node) {
				parent.right = replacement;
			} else {
				parent.left = replacement;
			}
		}
		replacement.parent = parent;

		this._balance(replacement, true);
		return true;
	}

	replacement = replacement.left;
	while (replacement.left !== null) {
		replacement = replacement.left;
	}

	if (replacement.right !== null) {
		replacement.right.parent = replacement.parent;
	}
	replacement.parent.left = replacement.right;

	if (right !== null) {
		right.parent = replacement;
	}
	replacement.right = right;


	if (left !== null) {
		left.parent = replacement;
	}
	replacement.left = left;

	if (parent === null) {
		this.root = replacement;
	} else {
		if (parent.right === node) {
			parent.right = replacement;
		} else {
			parent.left = replacement;
		}
	}

	var balanceFrom = replacement.parent;
	replacement.parent = parent;

	this._balance(balanceFrom, true);

	// Removing any reference from the node to any other element
	node.left      = null;
	node.right     = null;
	node.parent    = null;
	node.container = null;

	return null;
};

AvlTreeList.prototype.getSmallestAbove = function (obj) {
	if (this.root === null) {
		return null;
	}

	var smallestAbove = null;
	var current = this.root;
	while (current !== null) {
		var cmp = this.cmpFunc(obj, current.object);
		if (cmp < 0) {
			smallestAbove = current.object;
			// Searching left
			current = current.left;
		} else if (cmp > 0) {
			// Searching right
			current = current.right;
		} else {
			return current.object;
		}
	}

	return smallestAbove;
};

AvlTreeList.prototype.getGreatestBelow = function (obj) {
	if (this.root === null) {
		return null;
	}

	var greatestBelow = null;
	var current = this.root;
	while (current !== null) {
		var cmp = this.cmpFunc(obj, current.object);
		if (cmp < 0) {
			// Searching left
			current = current.left;
		} else if (cmp > 0) {
			greatestBelow = current.object;
			// Searching right
			current = current.right;
		} else {
			return current.object;
		}
	}

	return greatestBelow;
};

AvlTreeList.prototype.forEach = function (processingFunc, params) {
	for (var current = this.first; current !== null; current = current.next) {
		processingFunc(current.object, params);
	}
};

AvlTreeList.prototype.forEachReverse = function (processingFunc, params) {
	for (var current = this.last; current !== null; current = current.previous) {
		processingFunc(current.object, params);
	}
};

AvlTreeList.prototype._switchNodes = function (nodeA, nodeB) {
	var objectA = nodeA.object;
	var objectB = nodeB.object;
	var referenceA = objectA[this._referenceProperty];
	objectA[this._referenceProperty] = objectB[this._referenceProperty];
	objectB[this._referenceProperty] = referenceA;

	nodeA.object = objectB;
	nodeB.object = objectA;
};

AvlTreeList.prototype.reposition = function (node) {
	if (node.container !== this) {
		console.warn('[AvlTreeList.reposition] Trying to reposition a node that does not belong to the list');
		return;
	}

	var cmp;
	var object = node.object;

	// Switching place with nodes until correctly sorted
	var previous = node.previous;
	if (previous !== null) {
		cmp = this.cmpFunc(object, previous.object);
		if (cmp < 0) {
			do {
				this._switchNodes(node, previous);
				node = previous;
				previous = node.previous;
				if (previous === null) { break; }
				cmp = this.cmpFunc(object, previous.object);
			} while (cmp < 0);
			return;
		}
	}
	
	var next = node.next;
	if (next !== null) {
		cmp = this.cmpFunc(object, next.object);
		if (cmp > 0) {
			do {
				this._switchNodes(node, next);
				node = next;
				next = next.next;
				if (next === null) { break; }
				cmp = this.cmpFunc(object, next.object);
			} while (cmp > 0);
			return;
		}
	}
};

AvlTreeList.prototype.toArray = function () {
	var objects = [];
	for (var current = this.first; current !== null; current = current.next) {
		objects.push(current.object);
	}
	return objects;
};

AvlTreeList.prototype.clear = function () {
	var current = this.first;
	while (current !== null) {
		var next = current.next;

		current.container = null;
		current.left      = null;
		current.right     = null;
		current.parent    = null;
		current.next      = null;
		current.previous  = null;

		current = next;
	}

	this.length = 0;
	this.root = null;
	this.first = null;
	this.last = null;
};


AvlTreeList.prototype._isBalanced = function (node) {
	if (node === undefined) {
		node = this.root;
	}

	if (node === null) {
		return true;
	}

	var heightLeft  = (node.left  === null) ? 0 : node.left.height;
	var heightRight = (node.right === null) ? 0 : node.right.height;

	if (Math.abs(heightLeft - heightRight) > 1 || node.height <= heightLeft || node.height <= heightRight) {
		return false;
	}

	return this._isBalanced(node.left) && this._isBalanced(node.right);
};

AvlTreeList.prototype._isTreeCountConsistent = function () {
	return this._getTreeCount() === this.length;
};

AvlTreeList.prototype._isListCountConsistent = function () {
	return this._getListCount() === this.length;
};

AvlTreeList.prototype._getTreeCount = function (node) {
	if (node === undefined) {
		node = this.root;
	}

	if (node === null) {
		return 0;
	}

	return 1 + this._getTreeCount(node.left) + this._getTreeCount(node.right);
};

AvlTreeList.prototype._getListCount = function () {
	var count = 0;
	for (var current = this.first; current; current = current.next) {
		count += 1;
	}

	return count;
};

AvlTreeList.prototype._isTreeSorted = function (node) {
	if (node === undefined) {
		node = this.root;
	}

	if (node === null) {
		return true;
	}

	var isSortedLeft  = (node.left  === null) || (this.cmpFunc(node.left.object, node.object)  <= 0);
	var isSortedRight = (node.right === null) || (this.cmpFunc(node.object, node.right.object) <= 0);

	return isSortedLeft && isSortedRight && this._isTreeSorted(node.left) && this._isTreeSorted(node.right);
};

AvlTreeList.prototype._isListSorted = function () {
	if (this.first === null) {
		return true;
	}

	var previous = this.first.object;
	for (var current = this.first.next; current !== null; current = current.next) {
		if (this.cmpFunc(previous, current.object) > 0) {
			return false;
		}
	}

	return true;
};


module.exports = AvlTreeList;