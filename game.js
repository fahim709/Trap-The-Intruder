const connections = [
  [0, 1, 3],
  [0, 2, 2],
  [1, 3, 4],
  [2, 4, 2],
  [3, 5, 3],
  [4, 5, 4]
];

const nodeNames = ["A", "B", "C", "D", "E", "F"];
const edgeElements = [...document.querySelectorAll(".topology-box .edge")];
const routeButton = document.getElementById("findPath");
const statusElement = document.getElementById("attackerStatus");
const pathElement = document.getElementById("attackerPath");
const eventLog = document.getElementById("eventLog");
let logCount = 2;

function findShortestPath(start, target) {
  const distances = Array(nodeNames.length).fill(Infinity);
  const previous = Array(nodeNames.length).fill(null);
  const visited = new Set();
  distances[start] = 0;

  while (visited.size < nodeNames.length) {
    let current = -1;
    for (let i = 0; i < distances.length; i++) {
      if (!visited.has(i) && (current === -1 || distances[i] < distances[current])) {
        current = i;
      }
    }

    if (current === -1 || distances[current] === Infinity) break;
    if (current === target) break;
    visited.add(current);

    for (const [a, b, cost] of connections) {
      const neighbor = a === current ? b : b === current ? a : -1;
      if (neighbor !== -1 && distances[current] + cost < distances[neighbor]) {
        distances[neighbor] = distances[current] + cost;
        previous[neighbor] = current;
      }
    }
  }

  if (distances[target] === Infinity) return [];

  const path = [];
  for (let node = target; node !== null; node = previous[node]) {
    path.unshift(node);
  }
  return path;
}

function calculateRoute() {
  const path = findShortestPath(0, nodeNames.length - 1);
  const routeEdges = new Set();

  for (let i = 0; i < path.length - 1; i++) {
    routeEdges.add(`${path[i]}-${path[i + 1]}`);
    routeEdges.add(`${path[i + 1]}-${path[i]}`);
  }

  edgeElements.forEach((edge, index) => {
    const [a, b] = connections[index];
    edge.classList.toggle("edge-active", routeEdges.has(`${a}-${b}`));
  });

  if (path.length) {
    const route = path.map(index => nodeNames[index]).join(" → ");
    statusElement.textContent = "Route found!";
    pathElement.textContent = route;
    addLog(`Dijkstra selected: ${route}`);
  } else {
    statusElement.textContent = "No route available";
    pathElement.textContent = "—";
    addLog("No route is available.");
  }
}

function addLog(message) {
  const item = document.createElement("li");
  const time = document.createElement("span");
  time.className = "log-time";
  time.textContent = `[00:${String(logCount++).padStart(2, "0")}]`;
  item.append(time, document.createTextNode(message));
  eventLog.prepend(item);
}

routeButton.addEventListener("click", calculateRoute);
