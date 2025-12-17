<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>A* Pathfinding Visualizer</title>
<style>
    body { 
        font-family: Arial, sans-serif; 
        display: flex; 
        flex-direction: column; 
        align-items: center;
        padding: 20px;
        background: #f5f5f5;
    }
    
    .container {
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    h2 { 
        margin: 0 0 10px 0; 
        color: #333;
    }
    
    .instructions {
        background: #e3f2fd;
        padding: 15px;
        border-radius: 5px;
        margin: 15px 0;
        border-left: 4px solid #2196F3;
    }
    
    .instructions h3 {
        margin-top: 0;
        color: #1976D2;
    }
    
    .instructions ol {
        margin: 10px 0;
        padding-left: 20px;
    }
    
    .instructions li {
        margin: 5px 0;
    }
    
    .legend {
        display: flex;
        gap: 20px;
        margin: 15px 0;
        flex-wrap: wrap;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .legend-box {
        width: 20px;
        height: 20px;
        border: 1px solid #333;
    }
    
    .controls {
        display: flex;
        gap: 10px;
        margin: 20px 0;
        flex-wrap: wrap;
    }
    
    button {
        padding: 10px 20px;
        font-size: 14px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s;
        font-weight: bold;
    }
    
    button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    button:active {
        transform: translateY(0);
    }
    
    .btn-start { background: #4CAF50; color: white; }
    .btn-end { background: #f44336; color: white; }
    .btn-wall { background: #333; color: white; }
    .btn-run { background: #2196F3; color: white; }
    .btn-clear { background: #ff9800; color: white; }
    .btn-reset { background: #9C27B0; color: white; }
    
    .btn-active {
        box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.5);
    }
    
    #grid { 
        display: grid; 
        grid-template-columns: repeat(20, 25px); 
        margin: 20px 0;
        border: 2px solid #333;
        position: relative;
    }
    
    .cell {
        width: 25px; 
        height: 25px; 
        border: 1px solid #ddd;
        box-sizing: border-box; 
        cursor: pointer;
        transition: background 0.2s;
        position: relative;
    }
    
    .cell:hover {
        opacity: 0.8;
    }
    
    .start { background: #4CAF50; }
    .end { background: #f44336; }
    .wall { background: #333; }
    .path { background: #FFEB3B; }
    .closed { background: #90CAF9; }
    .open { background: #C5E1A5; }
    
    .pathfinder {
        width: 20px;
        height: 20px;
        background: #FF5722;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        box-shadow: 0 0 10px rgba(255, 87, 34, 0.8);
        transition: all 0.3s ease-in-out;
    }
    
    .pathfinder::after {
        content: '→';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 14px;
        font-weight: bold;
    }
    
    .pathfinder.moving::after {
        animation: pulse 0.3s ease-in-out;
    }
    
    @keyframes pulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.3); }
    }
    
    #status {
        margin-top: 15px;
        padding: 10px;
        border-radius: 5px;
        font-weight: bold;
        text-align: center;
    }
    
    .status-success { background: #C8E6C9; color: #2E7D32; }
    .status-error { background: #FFCDD2; color: #C62828; }
    .status-info { background: #B3E5FC; color: #01579B; }
</style>
</head>
<body>

<div class="container">
    <h2>🤖 A* Pathfinding Visualizer</h2>
    
    <div class="instructions">
        <h3>📋 How to Use:</h3>
        <ol>
            <li><strong>Click "Set Start"</strong> button, then click a cell to place the start point (green)</li>
            <li><strong>Click "Set End"</strong> button, then click a cell to place the end point (red)</li>
            <li><strong>Click "Add Walls"</strong> button, then click cells to draw obstacles (black)</li>
            <li><strong>Click "Run Pathfinding"</strong> to watch the pathfinder (orange circle) navigate!</li>
            <li>Watch as it explores the grid and then follows the optimal path to the destination</li>
        </ol>
    </div>
    
    <div class="legend">
        <div class="legend-item">
            <div class="legend-box start"></div>
            <span>Start</span>
        </div>
        <div class="legend-item">
            <div class="legend-box end"></div>
            <span>End</span>
        </div>
        <div class="legend-item">
            <div class="legend-box wall"></div>
            <span>Wall</span>
        </div>
        <div class="legend-item">
            <div class="legend-box open"></div>
            <span>Explored</span>
        </div>
        <div class="legend-item">
            <div class="legend-box path"></div>
            <span>Path</span>
        </div>
        <div class="legend-item">
            <div style="width: 20px; height: 20px; background: #FF5722; border-radius: 50%; border: 1px solid #333;"></div>
            <span>Pathfinder</span>
        </div>
    </div>

    <div class="controls">
        <button class="btn-start" onclick="setMode('start')">Set Start</button>
        <button class="btn-end" onclick="setMode('end')">Set End</button>
        <button class="btn-wall btn-active" onclick="setMode('wall')">Add Walls</button>
        <button class="btn-run" onclick="runAStar()">▶ Run Pathfinding</button>
        <button class="btn-clear" onclick="clearPath()">Clear Path</button>
        <button class="btn-reset" onclick="resetGrid()">Reset All</button>
    </div>

    <div id="grid"></div>
    
    <div id="status"></div>
</div>

<script>
const rows = 20, cols = 20;
let grid = [];
let mode = "wall";
let startCell = null, endCell = null;
let isRunning = false;
let pathfinder = null;

// CREATE GRID
const gridDiv = document.getElementById("grid");

for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.row = r;
        cell.dataset.col = c;

        cell.addEventListener("click", () => handleCellClick(cell));

        grid[r][c] = cell;
        gridDiv.appendChild(cell);
    }
}

function setMode(newMode) {
    mode = newMode;
    document.querySelectorAll('.controls button').forEach(btn => {
        btn.classList.remove('btn-active');
    });
    event.target.classList.add('btn-active');
    updateStatus(`Mode: ${newMode === 'start' ? 'Click to place START' : newMode === 'end' ? 'Click to place END' : 'Click to draw WALLS'}`, 'info');
}

function handleCellClick(cell) {
    if (isRunning) return;
    
    if (mode === "start") {
        if (startCell) startCell.classList.remove("start");
        startCell = cell;
        cell.classList.remove("wall", "end", "path", "closed", "open");
        cell.classList.add("start");
        updateStatus("Start point set! Now set the end point.", "info");
    }
    else if (mode === "end") {
        if (endCell) endCell.classList.remove("end");
        endCell = cell;
        cell.classList.remove("wall", "start", "path", "closed", "open");
        cell.classList.add("end");
        updateStatus("End point set! Now draw walls or run pathfinding.", "info");
    }
    else if (mode === "wall") {
        if (!cell.classList.contains("start") && !cell.classList.contains("end")) {
            cell.classList.toggle("wall");
            cell.classList.remove("path", "closed", "open");
        }
    }
}

function updateStatus(message, type) {
    const statusDiv = document.getElementById("status");
    statusDiv.textContent = message;
    statusDiv.className = `status-${type}`;
}

function clearPath() {
    if (isRunning) return;
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            grid[r][c].classList.remove("path", "closed", "open");
        }
    }
    
    if (pathfinder) {
        pathfinder.remove();
        pathfinder = null;
    }
    
    updateStatus("Path cleared! Ready to run again.", "info");
}

function resetGrid() {
    if (isRunning) return;
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            grid[r][c].className = "cell";
        }
    }
    
    if (pathfinder) {
        pathfinder.remove();
        pathfinder = null;
    }
    
    startCell = null;
    endCell = null;
    updateStatus("Grid reset! Set start and end points.", "info");
}

function createPathfinder(r, c) {
    if (pathfinder) pathfinder.remove();
    
    pathfinder = document.createElement("div");
    pathfinder.className = "pathfinder";
    
    const cell = grid[r][c];
    cell.style.position = "relative";
    cell.appendChild(pathfinder);
    
    return pathfinder;
}

function movePathfinder(r, c) {
    if (!pathfinder) return;
    
    const targetCell = grid[r][c];
    const currentCell = pathfinder.parentElement;
    
    if (currentCell) {
        currentCell.style.position = "";
    }
    
    targetCell.style.position = "relative";
    targetCell.appendChild(pathfinder);
    
    pathfinder.classList.add("moving");
    setTimeout(() => pathfinder.classList.remove("moving"), 300);
    
    // Update arrow direction based on movement
    const oldR = parseInt(currentCell.dataset.row);
    const oldC = parseInt(currentCell.dataset.col);
    const dr = r - oldR;
    const dc = c - oldC;
    
    if (dc > 0) pathfinder.style.transform = "translate(-50%, -50%) rotate(0deg)";
    else if (dc < 0) pathfinder.style.transform = "translate(-50%, -50%) rotate(180deg)";
    else if (dr > 0) pathfinder.style.transform = "translate(-50%, -50%) rotate(90deg)";
    else if (dr < 0) pathfinder.style.transform = "translate(-50%, -50%) rotate(-90deg)";
}

async function runAStar() {
    if (isRunning) return;
    
    if (!startCell || !endCell) {
        updateStatus("⚠️ Please set both start and end points first!", "error");
        return;
    }

    isRunning = true;
    clearPath();

    const start = {
        r: parseInt(startCell.dataset.row),
        c: parseInt(startCell.dataset.col),
        g: 0,
        h: 0,
        f: 0,
        parent: null
    };

    const end = {
        r: parseInt(endCell.dataset.row),
        c: parseInt(endCell.dataset.col)
    };

    start.h = heuristic(start.r, start.c, end.r, end.c);
    start.f = start.g + start.h;

    // Create pathfinder at start position
    createPathfinder(start.r, start.c);

    let openList = [start];
    let closedSet = new Set();

    function getNeighbors(node) {
        const dirs = [[1,0], [-1,0], [0,1], [0,-1]];
        let list = [];
        dirs.forEach(([dr, dc]) => {
            let nr = node.r + dr, nc = node.c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                const cell = grid[nr][nc];
                if (!cell.classList.contains("wall"))
                    list.push({r: nr, c: nc});
            }
        });
        return list;
    }

    function heuristic(r1, c1, r2, c2) { 
        return Math.abs(r1 - r2) + Math.abs(c1 - c2); 
    }

    function reconstruct(node) {
        let path = [];
        let curr = node;
        while (curr.parent) {
            path.unshift(curr);
            curr = curr.parent;
        }
        return path;
    }

    function findInOpenList(r, c) {
        return openList.find(x => x.r === r && x.c === c);
    }

    updateStatus("🔍 Pathfinder exploring the grid...", "info");

    while (openList.length > 0) {
        openList.sort((a, b) => a.f - b.f);
        let current = openList.shift();
        let key = current.r + "-" + current.c;

        // Move pathfinder to current node
        movePathfinder(current.r, current.c);
        await sleep(50);

        // Check if we reached the goal
        if (current.r === end.r && current.c === end.c) {
            const path = reconstruct(current);
            
            updateStatus("✨ Path found! Pathfinder moving to destination...", "success");
            await sleep(500);
            
            // Move pathfinder back to start
            movePathfinder(start.r, start.c);
            await sleep(300);
            
            // Visualize and follow the final path
            for (let node of path) {
                const cell = grid[node.r][node.c];
                if (!cell.classList.contains("start") && !cell.classList.contains("end")) {
                    cell.classList.remove("closed", "open");
                    cell.classList.add("path");
                }
                movePathfinder(node.r, node.c);
                await sleep(200);
            }
            
            updateStatus(`✅ Destination reached! Path length: ${path.length} steps`, "success");
            isRunning = false;
            return;
        }

        closedSet.add(key);
        
        // Visualize exploration
        const currCell = grid[current.r][current.c];
        if (!currCell.classList.contains("start") && !currCell.classList.contains("end")) {
            currCell.classList.add("closed");
        }

        let neighbors = getNeighbors(current);
        
        for (let n of neighbors) {
            const nKey = n.r + "-" + n.c;
            if (closedSet.has(nKey)) continue;

            let tentativeG = current.g + 1;
            let h = heuristic(n.r, n.c, end.r, end.c);
            let f = tentativeG + h;

            let existing = findInOpenList(n.r, n.c);
            
            if (!existing) {
                openList.push({
                    r: n.r,
                    c: n.c,
                    g: tentativeG,
                    h: h,
                    f: f,
                    parent: current
                });
                
                const cell = grid[n.r][n.c];
                if (!cell.classList.contains("start") && !cell.classList.contains("end")) {
                    cell.classList.add("open");
                }
            } else if (tentativeG < existing.g) {
                existing.g = tentativeG;
                existing.f = tentativeG + existing.h;
                existing.parent = current;
            }
        }
    }

    updateStatus("❌ No path found! Try removing some walls.", "error");
    isRunning = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize status
updateStatus("Ready! Set start and end points to begin.", "info");
</script>

</body>
</html>
