// Use Graph Theory library
let { Graph, Vertex } = require('./graph');

//
// Relationship constants
//
const CHILD = 'child';
const PARENT = 'parent';
const MARRIED = 'married';

//
// Tree traversal constants
//
const ANCSESTORS = 'ancestors';
const DESCENDANTS = 'descendants';


//
// Helper function to label generations
//
function generation(gen, direction) {
    const LABELS = {
        [ANCSESTORS]: [
            'Self',
            'Parent',
            'Grand Parent'
        ],
        [DESCENDANTS]: [
            'Self',
            'Child',
            'Grand Child'
        ]
    };
    let labels = LABELS[direction];
    let label = '';
    if (gen > 2) {
        for (let i = 3; i <= gen; i++) label += `Great `;
        label = label + labels[2];
    } else label = labels[gen];
    return label
};

//
// Class person extends the basic Vertex class from the Graph library
//
// Adds family tree related functions
//
class _Person extends Vertex {
    constructor(tree, data) {
        super(tree, tree.V.length, data);
        this.tree = tree
    }

    //
    // Create the child/parent relationships between this person and it's parents
    // 
    isBorn(p1, p2, data) {
        this.tree.Relate(this, CHILD, p1, data);
        this.tree.Relate(this, CHILD, p2, data);
        this.tree.Relate(p1, PARENT, this, data);
        this.tree.Relate(p2, PARENT, this, data);
        return this;
    }

    //
    // Create the spousal relationships between this person and it's spouse
    //
    marries(p1, data) {
        this.tree.Relate(this, MARRIED, p1, data);
        this.tree.Relate(p1, MARRIED, this, data);
        return this;
    }

    //
    // Get an array of spouses for this person, based on spousal relationships
    //
    spouses() {
        let filter = rel => (rel.from === this) && (rel.type === MARRIED);
        return this.tree.findEdges(filter).map(e => ({
            spouse: e.to,
            data: e.data
        }))
    }

    //
    // Get an array of parents for this person 
    //
    parents() {
        let filter = rel => (rel.from === this) && (rel.type === CHILD);
        return this.tree.findEdges(filter).map(e => (e.to))
    }

    //
    // Get an array of children for this person
    //
    children() {
        let filter = rel => (rel.from === this) && (rel.type === PARENT);
        return this.tree.findEdges(filter).map(e => (e.to))
    }

    //
    // Get an array of siblings for this person
    //
    // Siblings are persons who share a parent
    //
    // Mark siblings as 'full' or 'half' depending on it they share all parents
    //
    siblings() {
        let siblings = [];
        let parents = this.parents();
        parents.forEach(parent => {
            let children = parent.children();
            siblings = siblings.concat(children.filter(
                child => (child !== this) && siblings.findIndex(_child => (child === _child)) < 0)
            )
        })
        siblings = siblings.map(sibling => {
            let sParents = sibling.parents();
            if (sParents.every(parent => parents.includes(parent))) return {
                type: 'full',
                ...sibling.toJSON()
            }
            else return {
                type: 'half',
                ...sibling.toJSON()
            };
        })
        return siblings;
    }

    //
    // Recursive traversal of the descendants or ancestors of this person
    //
    traverse (_level, direction) {
        let nextGeneration;
        if (direction === ANCSESTORS) nextGeneration = this.parents.bind(this);
        else if (direction == DESCENDANTS) nextGeneration = this.children.bind(this);
        else throw new Error('Invalid direction for traversal');

        let level = _level || 1
        let group = null;

        // For each parent or child, recursively get the next set of ancestors/descendants
        nextGeneration().forEach((person) => {
            group = group || []
            group.push(
                { 
                    generation: { 
                        level: level, 
                        title: generation(level, direction) // Label the generation
                    }, 
                    ...person.toJSON(), 
                    [direction]: person.traverse(level + 1, direction) // Recursive call to get the next generation
                }
            );
        })
        return group;
    }

    //
    // Get a tree of ancestors for this person
    //
    ancestors () {
        return this.traverse(1, ANCSESTORS);
    }

    //
    // Get a tree of descendants for this person
    //
    descendants () {
        return this.traverse(1, DESCENDANTS);
    }
}

//
// Family Tree extends a basic Graph
//
class FamilyTree extends Graph {
    constructor(name, data) {
        super(name, data);
        this.People = this.V;
        this.Relationships = this.E
    }

    Person(data) {
        let person = new _Person(this, data);
        this.People.push(person);
        return person;
    }

    Relate(p1, type, p2, data) {
        return this.Edge(p1, p2, type, data);
    }

    toJSON() {
        return {
            People: this.People,
            Relationships: this.Relationships,
            data: this.data
        }
    }
}

module.exports = FamilyTree;
