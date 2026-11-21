
import createModule from "./algorithms.js";

// Load C WebAssembly module
const Module = await createModule();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Network nodes
const nodes = [
    { x: 100, y: 260, name: "A" },
    { x: 280, y: 130, name: "B" },
    { x: 280, y: 390, name: "C" },
    { x: 520, y: 130, name: "D" },
    { x: 520, y: 390, name: "E" },
    { x: 700, y: 260, name: "F" }
];

// Network connections
const edges = [
    [0, 1, 3],
    [0, 2, 2],
    [1, 3, 4],
    [2, 4, 2],
    [3, 5, 3],
    [4, 5, 4]
];

let currentPath = [];

// Check whether an edge belongs to selected path
function isPathEdge(a, b) {

    for (let i = 0; i < currentPath.length - 1; i++) {

        if (
            (currentPath[i] === a &&
             currentPath[i + 1] === b) ||

            (currentPath[i] === b &&
             currentPath[i + 1] === a)
        ) {
            return true;
        }
    }

    return false;
}

// Draw network
function drawGraph() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach(([a, b, cost]) => {

        const nodeA = nodes[a];
        const nodeB = nodes[b];

        ctx.beginPath();

        ctx.moveTo(nodeA.x, nodeA.y);
        ctx.lineTo(nodeB.x, nodeB.y);

        ctx.strokeStyle = isPathEdge(a, b)
            ? "#ef4444"
            : "#475569";

        ctx.lineWidth = isPathEdge(a, b) ? 6 : 3;

        ctx.stroke();

        // Edge cost
        const midX = (nodeA.x + nodeB.x) / 2;
        const midY = (nodeA.y + nodeB.y) / 2;

        ctx.fillStyle = "#facc15";
        ctx.font = "16px Arial";

        ctx.fillText(cost, midX, midY);
    });

    // Draw nodes
    nodes.forEach((node, index) => {

        ctx.beginPath();

        ctx.arc(node.x, node.y, 22, 0, Math.PI * 2);

        if (index === 0) {
            ctx.fillStyle = "#16a34a";
        }
        else if (index === 5) {
            ctx.fillStyle = "#dc2626";
        }
        else {
            ctx.fillStyle = "#0284c7";
        }

        ctx.fill();

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(node.name, node.x, node.y);
    });
}

// Call Dijkstra implemented in C
function calculateRoute() {

    const pathPointer = Module._malloc(
        nodes.length * Int32Array.BYTES_PER_ELEMENT
    );

    const pathLength = Module.ccall(
        "find_path",
        "number",
        ["number", "number", "number"],
        [0, 5, pathPointer]
    );

    if (pathLength > 0) {

        const startIndex = pathPointer / 4;

        currentPath = Array.from(
            Module.HEAP32.slice(
                startIndex,
                startIndex + pathLength
            )
        );

        const route = currentPath
            .map(index => nodes[index].name)
            .join(" → ");

        document.getElementById("attackerStatus")
            .textContent = "Route found!";

        document.getElementById("attackerPath")
            .textContent = route;

        document.getElementById("eventLog")
            .textContent = "Dijkstra selected: " + route;
    }
    else {

        currentPath = [];

        document.getElementById("attackerStatus")
            .textContent = "No route available";
    }

    Module._free(pathPointer);

    drawGraph();
}

// Button interaction
document.getElementById("findPath")
    .addEventListener("click", calculateRoute);

// Initial rendering
drawGraph();

console.log("C WebAssembly module loaded!");
