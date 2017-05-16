export default function Graph() {
    this.nodes = [];
    this.links = [];

    this.addNode = (name) => {
        if(this.nodes.findIndex((n) => {return n.name === name}) === -1)
            this.nodes.push({name, isGateway: false});
    }
    
    this.addLink = (n1, n2) => {
        if(this.links.findIndex((l) => {return (l.n1 === n1 && l.n2 === n2) || (l.n1 === n2 && l.n2 === n1)}) === -1)
          this.links.push({n1, n2, isBlocked: false});
    }
    
    this.markGateway = (node) => {
        var i = this.nodes.findIndex((n) => {return n.name === node});
        this.nodes[i].isGateway = true;
    }
    
    this.getPathToNearestGateway = (agent) => {
        var gateways = this.getGateways();
        var paths = [];
        for (var i = 0; i < gateways.length; i++)
            paths.push(this.getShortestPath(agent, gateways[i].name));
        
        paths.sort((a, b) => {
            if(a.length > b.length) return 1;
            if(a.length < b.length) return -1;
            return 0;
        });
        return paths[0];
    }
    
    this.getGateways = () => {
        return this.nodes.filter((n) => {return n.isGateway === true});
    }
    
    this.getShortestPath = (start, target) => {
        var parents = [];
        var queue = [];
        var visited = [];
        var current;
        
        queue.push(start);
        parents[start] = null;
        visited[start] = true;
        
        while (queue.length) {
            current = queue.shift();
            
            if (current === target)
                return this._buildPath(parents, target);
            
            for (var i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].name !== current && this._isAdjacent(current, this.nodes[i].name) && !visited[this.nodes[i].name]) {
                    parents[this.nodes[i].name] = current;
                    visited[this.nodes[i].name] = true;
                    queue.push(this.nodes[i].name);
                }
            }
        }
        return null;
    }
    
    this.blockLink = (n1, n2) => {
        var i = this.links.findIndex((l) => {return (l.n1 === n1 && l.n2 === n2) || (l.n1 === n2 && l.n2 === n1)});
        this.links[i].isBlocked = true;
    }
    
    this._buildPath = (parents, targetNode) => {
        var result = [targetNode];
        while (parents[targetNode] !== null) {
            targetNode = parents[targetNode];
            result.push(targetNode);
        }
        return result.reverse();
    }
    
    this._isAdjacent = (node, neightbour) => {
        return this.links.filter((l) => {
            return !l.isBlocked && (l.n1 === node && l.n2 === neightbour) || (l.n1 === neightbour && l.n2 === node);
        }).length > 0;
    }
}