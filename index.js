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

	this._balance(newNode.parent);

	return newNode;
};

AvlTreeList.prototype._balanceLeftRight = function (node) {
	var left = node.left;
	var a = left.left;
	var b = left.right.left;

	left.right.left = left;
	node.left = left.right;
	left = node.left;
	left.parent = node;

	var leftLeft = left.left;
	leftLeft.parent = left;
	leftLeft.left = a;
	leftLeft.right = b;
	if (a !== null) {
		a.parent = leftLeft;
	}
	if (b !== null) {
		b.parent = leftLeft;
	}

	updateHeight(node.left.left);
	updateHeight(node.left);
};

AvlTreeList.prototype._balanceLeftLeft = function (node) {
	var left = node.left;
	var c = left.right;

	if (node === this.root) {
		this.root = left;
	} else {
		if (node.parent.right === node) {
			node.parent.right = left;
		} else {
			node.parent.left = left;
		}
	}

	left.right = node;
	left.parent = node.parent;
	node.parent = left;
	node.left = c;
	if (c !== null) {
		c.parent = node;
	}

	updateHeight(node);
};

AvlTreeList.prototype._balanceRightLeft = function (node) {
	var right = node.right;
	var a = right.right;
	var b = right.left.right;

	right.left.right = right;
	node.right = right.left;
	right = node.right;
	right.parent = node;

	var rightRight = right.right;
	rightRight.parent = right;
	rightRight.right = a;
	rightRight.left = b;
	if (a !== null) {
		a.parent = rightRight;
	}
	if (b !== null) {
		b.parent = rightRight;
	}

	updateHeight(node.right.right);
	updateHeight(node.right);
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
	if (c !== null) {
		c.parent = node;
	}

	updateHeight(node);
};

AvlTreeList.prototype._balance = function (node) {
	// Balancing the tree
	var current = node;
	while (current !== null) {
		var leftHeight = (current.left === null) ? 0 : current.left.height;
		var rightHeight = (current.right === null) ? 0 : current.right.height;
		var newHeight = 1 + Math.max(leftHeight, rightHeight);

		current.height = newHeight;
		if (leftHeight - rightHeight > 1) {
			// Left case
			if (current.left.right !== null &&
				(current.left.left === null || current.left.left.height < current.left.right.height)) {
				// Left Right Case
				this._balanceLeftRight(current);
			}

			// Left Left Case
			this._balanceLeftLeft(current);

			// The tree has been balanced
		} else if (rightHeight - leftHeight > 1) {
			// Right case
			if (current.right.left !== null &&
				(current.right.right === null || current.right.right.height < current.right.left.height)) {
				// Right Left Case
				this._balanceRightLeft(current);
			}

			// Right Right Case
			this._balanceRightRight(current);

			// The tree has been balanced
		} else {
			// TreeNode is balanced
			current = current.parent;
		}
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
		if (parent === null) {
			this.root = left;
		} else {
			if (parent.right === node) {
				parent.right = left;
			} else {
				parent.left = left;
			}
		}

		if (left !== null) {
			left.parent = parent;
		}

		this._balance(parent);
		return true;
	}

	var replacement = node.right;
	var balanceFrom;

	if (replacement.left === null) {
		balanceFrom = replacement;

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

		this._balance(balanceFrom);

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

	balanceFrom = replacement.parent;

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

	this._balance(balanceFrom);

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
	for (var current = this.first; current; current = current.next) {
		processingFunc(current.object, params);
	}
};

AvlTreeList.prototype.forEachReverse = function (processingFunc, params) {
	for (var current = this.last; current; current = current.previous) {
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
	for (var current = this.first; current; current = current.next) {
		objects.push(current.object);
	}
	return objects;
};

AvlTreeList.prototype.clear = function () {
	this._clearEachNode(this.root);
	this.length = 0;
	this.root = null;
};

AvlTreeList.prototype._clearEachNode = function (node) {
	if (node !== null) {
		this._clearEachNode(node.left);
		this._clearEachNode(node.right);
		node.left   = null;
		node.right  = null;
		node.parent = null;
		node.height = 1;
		node.container = null;
	}
};

function getHeight(node) {
	if (node === null) {
		return 0;
	}
	return node.height;
}

function updateHeight(node) {
	node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
}

module.exports = AvlTreeList;