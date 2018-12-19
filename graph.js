
class _Vertex {
    constructor (_g, _id, _data) {
        let data = _data || {};
        let g = _g;
        let id = _id;
        this.getData =  () => (data);
        this.getGraph =  () => (g);
        this.getId =  () => (id);
    }

    get data () {
        return this.getData();
    }

    get graph () {
        return this.getGraph();
    }

    get id () {
        return this.getId();
    }

    toJSON () {
        return {
            id: this.id,
            data: this.data
        }
    }
}

class _Edge {
    constructor (_g, _id, v1, v2, type, _data) {
        let data = _data || {};
        let g = _g;
        let id = _id;
        let from = v1;
        let to = v2;
        this.type = type;
        this.getData =  () => (data);
        this.getGraph =  () => (g);
        this.getId =  () => (id);
        this.getPair = () => ({
            from: from,
            to: to
        });
    }

    get data () {
        return this.getData();
    }

    get graph () {
        return this.getGraph();
    }

    get id () {
        return this.getId();
    }

    get pair () {
        return this.getPair();
    }

    get to () {
        return this.pair.to;
    }

    get from () {
        return this.pair.from
    }

    toJSON () {
        return {
            id: this.id,
            pair: this.pair,
            type: this.type,
            data: this.data
        }
    }
}

class Graph {
    constructor (_data) {
        let data = _data || {};
        this.V = [];
        this.E = [];

        this.getData = () => (data);
    }

    get data () {
        return this.getData();
    }

    get edges() {
        return this.E;
    }

    Vertex (data)  {
        let vertex = new _Vertex(this, this.V.length, data);
        this.V.push(vertex);
        return vertex;
    }

    Edge (v1, v2, type, data)  {
        let edge = new _Edge(this, this.E.length, v1, v2, type, data);
        this.E.push(edge);
        return edge;
    }

    findEdges(filter) {
        if (filter) return this.edges.filter(filter);
        else return this.edges;
    }

    toJSON () {
        return {
            data: this.data,
            V: this.V,
            E: this.E
        }
    }
}

module.exports = {
    Graph: Graph,
    Vertex: _Vertex,
    Edge: _Edge
}