// Generated by CoffeeScript 1.4.0
(function() {
  var Fringe, Queue, SearchNode, SearchProblemGrader, Stack, root,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  SearchProblemGrader = (function(_super) {

    __extends(SearchProblemGrader, _super);

    function SearchProblemGrader(submission, problemState, parameters) {
      this.submission = submission;
      this.problemState = problemState;
      this.parameters = parameters != null ? parameters : {};
      SearchProblemGrader.__super__.constructor.call(this, this.submission, this.problemState, this.parameters);
      this.solvers = {
        totalNodesInCompleteTree: this.totalNodesInCompleteTree,
        bfs: this.bfs,
        dfs: this.dfs
      };
      this.problem = new SearchProblem({
        data: this.problemState.searchProblemData
      });
      this.solver = this.solvers[this.parameters.solver];
    }

    SearchProblemGrader.prototype.solve = function() {
      return this.solution = this.solver();
    };

    SearchProblemGrader.prototype.graphSearch = function(problem, fringe, reversePush) {
      var next, node, successors, visited, _i, _len, _ref;
      if (reversePush == null) {
        reversePush = false;
      }
      fringe.push(new SearchNode("S"));
      visited = [];
      while (!fringe.isEmpty()) {
        node = fringe.pop();
        if (node.state === "G") {
          return node.nodePath();
        }
        if (_ref = node.state, __indexOf.call(visited, _ref) < 0) {
          visited.push(node.state);
          successors = node.expand(problem);
          if (reversePush) {
            successors.reverse();
          }
          for (_i = 0, _len = successors.length; _i < _len; _i++) {
            next = successors[_i];
            fringe.push(next);
          }
        }
      }
      return null;
    };

    SearchProblemGrader.prototype.makeSolution = function(nodePath) {
      var node, result, state, statePath, _i, _len, _ref;
      statePath = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = nodePath.length; _i < _len; _i++) {
          node = nodePath[_i];
          _results.push(node.state);
        }
        return _results;
      })();
      result = {};
      _ref = this.problem.states;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        state = _ref[_i];
        if (__indexOf.call(statePath, state) >= 0) {
          result[state] = true;
        } else {
          result[state] = false;
        }
      }
      return result;
    };

    SearchProblemGrader.prototype.bfs = function() {
      var fringe, nodePath;
      fringe = new Queue();
      nodePath = this.graphSearch(this.problem.graph, fringe);
      return this.makeSolution(nodePath);
    };

    SearchProblemGrader.prototype.dfs = function() {
      var fringe, nodePath, reversePush;
      fringe = new Stack();
      reversePush = true;
      nodePath = this.graphSearch(this.problem.graph, fringe, reversePush);
      return this.makeSolution(nodePath);
    };

    SearchProblemGrader.prototype.totalNodesInCompleteTree = function() {
      var graph, helper, values;
      graph = this.problem.graph;
      values = {};
      helper = function(node) {
        var child, total, _i, _len, _ref;
        total = 1;
        _ref = graph[node];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          if (!(values[child] != null)) {
            values[child] = helper(child);
          }
          total += values[child];
        }
        return total;
      };
      return {
        numNodes: helper('S')
      };
    };

    SearchProblemGrader.prototype.grade = function() {
      var allCorrect, id, value, valueCorrect, _ref;
      if (!(this.solution != null)) {
        this.solve();
      }
      allCorrect = true;
      _ref = this.solution;
      for (id in _ref) {
        value = _ref[id];
        valueCorrect = this.submission != null ? value === this.submission[id] : false;
        this.evaluation[id] = valueCorrect;
        if (this.parameters.solver === 'totalNodesInCompleteTree') {
          this.evaluation[id + 'Value'] = value;
        }
        if (!valueCorrect) {
          allCorrect = false;
        }
      }
      this.evaluation['_all_'] = allCorrect;
      return allCorrect;
    };

    return SearchProblemGrader;

  })(XProblemGrader);

  SearchNode = (function() {

    function SearchNode(state, parent, pathCost, action) {
      this.state = state;
      this.parent = parent != null ? parent : null;
      if (pathCost == null) {
        pathCost = 0;
      }
      this.action = action != null ? action : null;
      if (this.parent != null) {
        this.pathCost = this.parent.pathCost + pathCost;
        this.depth = this.parent.depth + 1;
      } else {
        this.pathCost = pathCost;
        this.depth = 0;
      }
    }

    SearchNode.prototype.nodePath = function() {
      var current, result;
      current = this;
      result = [this];
      while (current.parent != null) {
        result.unshift(current.parent);
        current = current.parent;
      }
      return result;
    };

    SearchNode.prototype.expand = function(problem) {
      var next, result, _i, _len, _ref;
      result = [];
      problem[this.state].sort();
      _ref = problem[this.state];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        next = _ref[_i];
        result.push(new SearchNode(next, this, 1));
      }
      return result;
    };

    return SearchNode;

  })();

  Fringe = (function() {

    function Fringe() {
      this.fringe = [];
    }

    Fringe.prototype.push = function(node) {
      return this.fringe.push(node);
    };

    Fringe.prototype.pop = function() {
      return null;
    };

    Fringe.prototype.isEmpty = function() {
      return this.fringe.length === 0;
    };

    return Fringe;

  })();

  Queue = (function(_super) {

    __extends(Queue, _super);

    function Queue() {
      return Queue.__super__.constructor.apply(this, arguments);
    }

    Queue.prototype.pop = function() {
      return this.fringe.shift();
    };

    return Queue;

  })(Fringe);

  Stack = (function(_super) {

    __extends(Stack, _super);

    function Stack() {
      return Stack.__super__.constructor.apply(this, arguments);
    }

    Stack.prototype.pop = function() {
      return this.fringe.pop();
    };

    return Stack;

  })(Fringe);

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.graderClass = SearchProblemGrader;

}).call(this);
