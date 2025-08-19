// Data Structure Visualizer - Main Application Logic

// Data structures configuration with operations and visualization details
const dataStructures = [
  {
    "name": "Array Operations",
    "description": "Learn how arrays work with insertion, deletion, and traversal operations",
    "icon": "📊",
    "color": "var(--color-bg-1)",
    "operations": [
      {"name": "Insert", "description": "Add element at specific position"},
      {"name": "Delete", "description": "Remove element from specific position"},
      {"name": "Search", "description": "Find element in array"},
      {"name": "Traverse", "description": "Visit all elements"}
    ]
  },
  {
    "name": "Linked List",
    "description": "Understand dynamic data structures with pointer-based operations",
    "icon": "🔗",
    "color": "var(--color-bg-2)",
    "operations": [
      {"name": "Insert at Head", "description": "Add element at beginning"},
      {"name": "Insert at Tail", "description": "Add element at end"},
      {"name": "Delete", "description": "Remove element from list"},
      {"name": "Search", "description": "Find element in linked list"}
    ]
  },
  {
    "name": "Stack (LIFO)",
    "description": "Master Last-In-First-Out data structure operations",
    "icon": "📚",
    "color": "var(--color-bg-3)",
    "operations": [
      {"name": "Push", "description": "Add element to top of stack"},
      {"name": "Pop", "description": "Remove element from top of stack"},
      {"name": "Peek/Top", "description": "View top element without removing"},
      {"name": "isEmpty", "description": "Check if stack is empty"}
    ]
  },
  {
    "name": "Queue (FIFO)",
    "description": "Learn First-In-First-Out data structure operations",
    "icon": "🚶",
    "color": "var(--color-bg-4)",
    "operations": [
      {"name": "Enqueue", "description": "Add element to rear of queue"},
      {"name": "Dequeue", "description": "Remove element from front of queue"},
      {"name": "Front", "description": "View front element"},
      {"name": "isEmpty", "description": "Check if queue is empty"}
    ]
  },
  {
    "name": "Binary Tree",
    "description": "Explore hierarchical data structures and tree operations",
    "icon": "🌳",
    "color": "var(--color-bg-5)",
    "operations": [
      {"name": "Insert", "description": "Add node to binary search tree"},
      {"name": "Delete", "description": "Remove node from tree"},
      {"name": "Inorder Traversal", "description": "Visit nodes in left-root-right order"},
      {"name": "Preorder Traversal", "description": "Visit nodes in root-left-right order"}
    ]
  },
  {
    "name": "Sorting Algorithms",
    "description": "Visualize different sorting techniques step by step",
    "icon": "🔢",
    "color": "var(--color-bg-6)",
    "operations": [
      {"name": "Bubble Sort", "description": "Compare adjacent elements and swap"},
      {"name": "Selection Sort", "description": "Find minimum and place in position"},
      {"name": "Insertion Sort", "description": "Insert elements in sorted portion"},
      {"name": "Quick Sort", "description": "Divide and conquer approach"}
    ]
  }
];

// Global application state
let currentDS = null;
let currentOperation = null;
let animationData = [];
let currentStep = 0;
let isPlaying = false;
let animationSpeed = 2;
let animationTimer = null;

// Canvas and drawing context
let canvas, ctx;

// Educational tips for each data structure
const tips = {
  "Array Operations": "Arrays provide O(1) access time but O(n) insertion/deletion in worst case!",
  "Linked List": "Linked lists excel at dynamic sizing but lack random access like arrays.",
  "Stack (LIFO)": "Stacks are perfect for function calls, undo operations, and expression evaluation.",
  "Queue (FIFO)": "Queues are essential for breadth-first search and handling requests in order.",
  "Binary Tree": "Binary search trees maintain sorted data with O(log n) average search time.",
  "Sorting Algorithms": "Different sorting algorithms excel in different scenarios - choose wisely!"
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    populateDataStructures();
});

function initializeApp() {
    canvas = document.getElementById('visualizationCanvas');
    ctx = canvas.getContext('2d');
    
    // Set up canvas properties
    ctx.font = '14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Clear any existing content
    clearCanvas();
}

function setupEventListeners() {
    // Navigation
    document.querySelector('.start-learning-btn').addEventListener('click', () => {
        document.getElementById('learn').scrollIntoView({ behavior: 'smooth' });
    });

    // Data structure selector
    document.getElementById('dsSelector').addEventListener('change', handleDSSelection);
    document.getElementById('operationSelector').addEventListener('change', handleOperationSelection);
    
    // Controls
    document.getElementById('addValueBtn').addEventListener('click', addValue);
    document.getElementById('playBtn').addEventListener('click', playAnimation);
    document.getElementById('pauseBtn').addEventListener('click', pauseAnimation);
    document.getElementById('stepBtn').addEventListener('click', stepAnimation);
    document.getElementById('resetBtn').addEventListener('click', resetAnimation);
    document.getElementById('exampleDataBtn').addEventListener('click', loadExampleData);
    
    // Speed control
    document.getElementById('speedSlider').addEventListener('input', (e) => {
        animationSpeed = parseInt(e.target.value);
    });

    // Input field enter key
    document.getElementById('inputValue').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addValue();
        }
    });
}

function populateDataStructures() {
    const grid = document.getElementById('dataStructuresGrid');
    const dsSelector = document.getElementById('dsSelector');
    
    dataStructures.forEach((ds, index) => {
        // Create card
        const card = createDataStructureCard(ds, index);
        grid.appendChild(card);
        
        // Add to selector
        const option = document.createElement('option');
        option.value = ds.name;
        option.textContent = ds.name;
        dsSelector.appendChild(option);
    });
}

function createDataStructureCard(ds, index) {
    const card = document.createElement('div');
    card.className = 'ds-card';
    card.style.background = ds.color;
    
    card.innerHTML = `
        <div class="ds-card-header">
            <div class="ds-icon" style="background: ${ds.color};">
                ${ds.icon}
            </div>
            <h3 class="ds-card-title">${ds.name}</h3>
        </div>
        <p class="ds-card-description">${ds.description}</p>
        <div class="ds-card-footer">
            <span class="operation-count">${ds.operations.length} operations</span>
            <button class="btn btn--primary btn--sm explore-btn">Explore</button>
        </div>
    `;
    
    // Fix: Properly attach event listener to explore button
    const exploreBtn = card.querySelector('.explore-btn');
    exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectDataStructure(ds.name);
    });
    
    return card;
}

function selectDataStructure(dsName) {
    // Fix: Show visualization section and scroll to it
    document.getElementById('visualization').classList.remove('hidden');
    document.getElementById('dsSelector').value = dsName;
    handleDSSelection();
    
    // Scroll to visualization section
    setTimeout(() => {
        document.getElementById('visualization').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function handleDSSelection() {
    const dsName = document.getElementById('dsSelector').value;
    const operationSelector = document.getElementById('operationSelector');
    
    if (!dsName) {
        operationSelector.disabled = true;
        operationSelector.innerHTML = '<option value="">Select Operation</option>';
        currentDS = null;
        return;
    }
    
    currentDS = dataStructures.find(ds => ds.name === dsName);
    
    // Update UI
    document.getElementById('currentDS').textContent = currentDS.name;
    document.getElementById('dsDescription').textContent = currentDS.description;
    document.getElementById('tipContent').textContent = tips[currentDS.name];
    
    // Populate operations
    operationSelector.innerHTML = '<option value="">Select Operation</option>';
    currentDS.operations.forEach(op => {
        const option = document.createElement('option');
        option.value = op.name;
        option.textContent = op.name;
        operationSelector.appendChild(option);
    });
    
    operationSelector.disabled = false;
    
    // Initialize and draw the data structure
    initializeDataStructure();
    clearCanvas();
    drawDataStructure();
}

function handleOperationSelection() {
    const operationName = document.getElementById('operationSelector').value;
    
    if (!operationName || !currentDS) {
        currentOperation = null;
        document.getElementById('operationDescription').textContent = 'Choose an operation to see how it works.';
        return;
    }
    
    currentOperation = currentDS.operations.find(op => op.name === operationName);
    document.getElementById('operationDescription').textContent = currentOperation.description;
    
    // Update complexity info based on operation
    updateComplexityInfo(currentDS.name, operationName);
    
    resetAnimation();
}

function updateComplexityInfo(dsName, operation) {
    const complexities = {
        'Array Operations': {
            'Insert': { time: 'O(n)', space: 'O(1)' },
            'Delete': { time: 'O(n)', space: 'O(1)' },
            'Search': { time: 'O(n)', space: 'O(1)' },
            'Traverse': { time: 'O(n)', space: 'O(1)' }
        },
        'Stack (LIFO)': {
            'Push': { time: 'O(1)', space: 'O(1)' },
            'Pop': { time: 'O(1)', space: 'O(1)' },
            'Peek/Top': { time: 'O(1)', space: 'O(1)' },
            'isEmpty': { time: 'O(1)', space: 'O(1)' }
        },
        'Queue (FIFO)': {
            'Enqueue': { time: 'O(1)', space: 'O(1)' },
            'Dequeue': { time: 'O(1)', space: 'O(1)' },
            'Front': { time: 'O(1)', space: 'O(1)' },
            'isEmpty': { time: 'O(1)', space: 'O(1)' }
        },
        'Linked List': {
            'Insert at Head': { time: 'O(1)', space: 'O(1)' },
            'Insert at Tail': { time: 'O(n)', space: 'O(1)' },
            'Delete': { time: 'O(n)', space: 'O(1)' },
            'Search': { time: 'O(n)', space: 'O(1)' }
        },
        'Binary Tree': {
            'Insert': { time: 'O(log n)', space: 'O(1)' },
            'Delete': { time: 'O(log n)', space: 'O(1)' },
            'Inorder Traversal': { time: 'O(n)', space: 'O(h)' },
            'Preorder Traversal': { time: 'O(n)', space: 'O(h)' }
        },
        'Sorting Algorithms': {
            'Bubble Sort': { time: 'O(n²)', space: 'O(1)' },
            'Selection Sort': { time: 'O(n²)', space: 'O(1)' },
            'Insertion Sort': { time: 'O(n²)', space: 'O(1)' },
            'Quick Sort': { time: 'O(n log n)', space: 'O(log n)' }
        }
    };
    
    const complexity = complexities[dsName]?.[operation] || { time: 'O(n)', space: 'O(1)' };
    document.getElementById('timeComplexity').textContent = complexity.time;
    document.getElementById('spaceComplexity').textContent = complexity.space;
}

// Data structure initialization and visualization
let dataElements = [];

function initializeDataStructure() {
    if (!currentDS) return;
    
    switch (currentDS.name) {
        case 'Array Operations':
            dataElements = [10, 20, 30, 40, 50];
            break;
        case 'Stack (LIFO)':
            dataElements = [10, 20, 30];
            break;
        case 'Queue (FIFO)':
            dataElements = [10, 20, 30];
            break;
        case 'Linked List':
            dataElements = [10, 20, 30];
            break;
        case 'Sorting Algorithms':
            dataElements = [64, 34, 25, 12, 22, 11];
            break;
        case 'Binary Tree':
            dataElements = [50, 30, 70, 20, 40, 60, 80];
            break;
        default:
            dataElements = [];
    }
}

function drawDataStructure() {
    if (!currentDS || !canvas || !ctx) return;
    
    clearCanvas();
    
    if (dataElements.length === 0) {
        // Draw empty state message
        ctx.fillStyle = '#626C71';
        ctx.font = '16px Arial, sans-serif';
        ctx.fillText('No data to display. Add some values or use example data.', canvas.width/2, canvas.height/2);
        return;
    }
    
    switch (currentDS.name) {
        case 'Array Operations':
            drawArray();
            break;
        case 'Stack (LIFO)':
            drawStack();
            break;
        case 'Queue (FIFO)':
            drawQueue();
            break;
        case 'Linked List':
            drawLinkedList();
            break;
        case 'Sorting Algorithms':
            drawSortingArray();
            break;
        case 'Binary Tree':
            drawBinaryTree();
            break;
    }
}

function drawArray() {
    const startX = 50;
    const startY = 200;
    const cellWidth = 80;
    const cellHeight = 60;
    
    dataElements.forEach((element, index) => {
        const x = startX + index * cellWidth;
        
        // Draw cell
        ctx.fillStyle = '#1FB8CD';
        ctx.fillRect(x, startY, cellWidth, cellHeight);
        
        // Draw border
        ctx.strokeStyle = '#13343B';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, startY, cellWidth, cellHeight);
        
        // Draw value
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial, sans-serif';
        ctx.fillText(element.toString(), x + cellWidth/2, startY + cellHeight/2);
        
        // Draw index
        ctx.fillStyle = '#5D878F';
        ctx.font = '12px Arial, sans-serif';
        ctx.fillText(index.toString(), x + cellWidth/2, startY - 15);
    });
    
    // Reset font
    ctx.font = '14px Arial, sans-serif';
}

function drawStack() {
    const startX = 350;
    const startY = 320;
    const cellWidth = 100;
    const cellHeight = 50;
    
    dataElements.forEach((element, index) => {
        const y = startY - index * cellHeight;
        
        // Draw cell - highlight top element
        ctx.fillStyle = index === dataElements.length - 1 ? '#FFC185' : '#1FB8CD';
        ctx.fillRect(startX, y, cellWidth, cellHeight);
        
        // Draw border
        ctx.strokeStyle = '#13343B';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, y, cellWidth, cellHeight);
        
        // Draw value
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial, sans-serif';
        ctx.fillText(element.toString(), startX + cellWidth/2, y + cellHeight/2);
    });
    
    // Draw "TOP" indicator
    if (dataElements.length > 0) {
        ctx.fillStyle = '#B4413C';
        ctx.font = 'bold 14px Arial, sans-serif';
        ctx.fillText('TOP ↑', startX + cellWidth/2, startY - (dataElements.length - 1) * cellHeight - 20);
    }
    
    // Reset font
    ctx.font = '14px Arial, sans-serif';
}

function drawQueue() {
    const startX = 50;
    const startY = 200;
    const cellWidth = 80;
    const cellHeight = 60;
    
    dataElements.forEach((element, index) => {
        const x = startX + index * cellWidth;
        
        // Draw cell - highlight front and rear
        let fillColor = '#1FB8CD';
        if (index === 0) fillColor = '#FFC185'; // Front
        if (index === dataElements.length - 1 && dataElements.length > 1) fillColor = '#ECEBD5'; // Rear
        
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, startY, cellWidth, cellHeight);
        
        // Draw border
        ctx.strokeStyle = '#13343B';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, startY, cellWidth, cellHeight);
        
        // Draw value
        ctx.fillStyle = '#000000';
        ctx.font = '16px Arial, sans-serif';
        ctx.fillText(element.toString(), x + cellWidth/2, startY + cellHeight/2);
    });
    
    // Draw FRONT and REAR indicators
    if (dataElements.length > 0) {
        ctx.fillStyle = '#B4413C';
        ctx.font = 'bold 12px Arial, sans-serif';
        ctx.fillText('FRONT', startX + cellWidth/2, startY - 20);
        if (dataElements.length > 1) {
            ctx.fillText('REAR', startX + (dataElements.length - 1) * cellWidth + cellWidth/2, startY + cellHeight + 25);
        }
    }
    
    // Reset font
    ctx.font = '14px Arial, sans-serif';
}

function drawLinkedList() {
    const startX = 50;
    const startY = 200;
    const nodeWidth = 100;
    const nodeHeight = 60;
    const spacing = 130;
    
    dataElements.forEach((element, index) => {
        const x = startX + index * spacing;
        
        // Draw data part
        ctx.fillStyle = '#1FB8CD';
        ctx.fillRect(x, startY, nodeWidth * 0.7, nodeHeight);
        
        // Draw pointer part
        ctx.fillStyle = '#5D878F';
        ctx.fillRect(x + nodeWidth * 0.7, startY, nodeWidth * 0.3, nodeHeight);
        
        // Draw borders
        ctx.strokeStyle = '#13343B';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, startY, nodeWidth * 0.7, nodeHeight);
        ctx.strokeRect(x + nodeWidth * 0.7, startY, nodeWidth * 0.3, nodeHeight);
        
        // Draw value
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial, sans-serif';
        ctx.fillText(element.toString(), x + nodeWidth * 0.35, startY + nodeHeight/2);
        
        // Draw arrow to next node
        if (index < dataElements.length - 1) {
            ctx.strokeStyle = '#B4413C';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x + nodeWidth, startY + nodeHeight/2);
            ctx.lineTo(x + spacing - 10, startY + nodeHeight/2);
            ctx.stroke();
            
            // Arrow head
            ctx.beginPath();
            ctx.moveTo(x + spacing - 10, startY + nodeHeight/2);
            ctx.lineTo(x + spacing - 20, startY + nodeHeight/2 - 8);
            ctx.moveTo(x + spacing - 10, startY + nodeHeight/2);
            ctx.lineTo(x + spacing - 20, startY + nodeHeight/2 + 8);
            ctx.stroke();
        } else {
            // Draw NULL
            ctx.fillStyle = '#B4413C';
            ctx.font = '12px Arial, sans-serif';
            ctx.fillText('NULL', x + nodeWidth * 0.85, startY + nodeHeight/2);
        }
    });
    
    // Reset font
    ctx.font = '14px Arial, sans-serif';
}

function drawSortingArray() {
    const startX = 50;
    const startY = 250;
    const barWidth = 40;
    const maxHeight = 150;
    const maxValue = Math.max(...dataElements);
    
    dataElements.forEach((element, index) => {
        const x = startX + index * (barWidth + 10);
        const barHeight = (element / maxValue) * maxHeight;
        const y = startY - barHeight;
        
        // Draw bar
        ctx.fillStyle = '#1FB8CD';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw border
        ctx.strokeStyle = '#13343B';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, barWidth, barHeight);
        
        // Draw value on top
        ctx.fillStyle = '#13343B';
        ctx.font = '12px Arial, sans-serif';
        ctx.fillText(element.toString(), x + barWidth/2, y - 10);
    });
    
    // Reset font
    ctx.font = '14px Arial, sans-serif';
}

function drawBinaryTree() {
    const centerX = 400;
    const startY = 80;
    const levelHeight = 80;
    const nodeRadius = 25;
    
    // Simple binary tree layout for first 7 elements
    const positions = [
        {x: centerX, y: startY}, // Root
        {x: centerX - 100, y: startY + levelHeight}, // Left child
        {x: centerX + 100, y: startY + levelHeight}, // Right child
        {x: centerX - 150, y: startY + 2*levelHeight}, // Left-left
        {x: centerX - 50, y: startY + 2*levelHeight}, // Left-right
        {x: centerX + 50, y: startY + 2*levelHeight}, // Right-left
        {x: centerX + 150, y: startY + 2*levelHeight} // Right-right
    ];
    
    // Draw connections first
    ctx.strokeStyle = '#5D878F';
    ctx.lineWidth = 2;
    
    // Draw connections between nodes
    const connections = [[0,1], [0,2], [1,3], [1,4], [2,5], [2,6]];
    connections.forEach(([parent, child]) => {
        if (child < dataElements.length) {
            ctx.beginPath();
            ctx.moveTo(positions[parent].x, positions[parent].y);
            ctx.lineTo(positions[child].x, positions[child].y);
            ctx.stroke();
        }
    });
    
    // Draw nodes
    dataElements.slice(0, 7).forEach((element, index) => {
        const pos = positions[index];
        
        // Draw circle
        ctx.fillStyle = '#1FB8CD';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#13343B';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw value
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Arial, sans-serif';
        ctx.fillText(element.toString(), pos.x, pos.y);
    });
}

function clearCanvas() {
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Animation controls
function addValue() {
    const input = document.getElementById('inputValue');
    const value = input.value.trim();
    
    if (!value || !currentDS) return;
    
    const numValue = isNaN(value) ? value : parseInt(value);
    dataElements.push(numValue);
    input.value = '';
    
    drawDataStructure();
    updateStepInfo();
}

function loadExampleData() {
    if (!currentDS) return;
    
    switch (currentDS.name) {
        case 'Array Operations':
            dataElements = [15, 23, 8, 42, 16, 4];
            break;
        case 'Stack (LIFO)':
            dataElements = [5, 10, 15, 20];
            break;
        case 'Queue (FIFO)':
            dataElements = [100, 200, 300, 400];
            break;
        case 'Linked List':
            dataElements = [7, 14, 21, 28];
            break;
        case 'Sorting Algorithms':
            dataElements = [64, 34, 25, 12, 22, 11, 90];
            break;
        case 'Binary Tree':
            dataElements = [50, 30, 70, 20, 40, 60, 80];
            break;
    }
    
    drawDataStructure();
    updateStepInfo();
}

function playAnimation() {
    if (!currentOperation || isPlaying || !currentDS) return;
    
    isPlaying = true;
    document.getElementById('playBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = false;
    
    // Generate animation steps based on current operation
    generateAnimationSteps();
    
    if (animationData.length > 0) {
        currentStep = 0;
        runAnimationStep();
    } else {
        pauseAnimation();
    }
}

function pauseAnimation() {
    isPlaying = false;
    document.getElementById('playBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    
    if (animationTimer) {
        clearTimeout(animationTimer);
        animationTimer = null;
    }
}

function stepAnimation() {
    if (!currentOperation || !currentDS) return;
    
    if (animationData.length === 0) {
        generateAnimationSteps();
    }
    
    if (currentStep < animationData.length) {
        executeAnimationStep(animationData[currentStep]);
        currentStep++;
        updateStepInfo();
    }
}

function resetAnimation() {
    pauseAnimation();
    currentStep = 0;
    animationData = [];
    if (currentDS) {
        drawDataStructure();
    }
    updateStepInfo();
}

function generateAnimationSteps() {
    animationData = [];
    
    if (!currentOperation || !currentDS || dataElements.length === 0) return;
    
    // Generate animation steps based on operation
    switch (currentOperation.name) {
        case 'Search':
            // Search through each element
            for (let i = 0; i < dataElements.length; i++) {
                animationData.push({
                    type: 'highlight',
                    index: i,
                    description: `Checking element at index ${i}: ${dataElements[i]}`
                });
            }
            break;
            
        case 'Traverse':
            // Visit each element
            dataElements.forEach((element, index) => {
                animationData.push({
                    type: 'visit',
                    index: index,
                    description: `Visiting element ${element} at index ${index}`
                });
            });
            break;
            
        case 'Insert':
        case 'Insert at Head':
        case 'Insert at Tail':
            animationData.push({
                type: 'insert',
                description: `Inserting new element into ${currentDS.name}`
            });
            break;
            
        case 'Push':
            animationData.push({
                type: 'push',
                description: 'Adding element to top of stack'
            });
            break;
            
        case 'Enqueue':
            animationData.push({
                type: 'enqueue',
                description: 'Adding element to rear of queue'
            });
            break;
            
        default:
            animationData.push({
                type: 'demo',
                description: `Demonstrating ${currentOperation.name} operation`
            });
    }
    
    updateStepInfo();
}

function runAnimationStep() {
    if (!isPlaying || currentStep >= animationData.length) {
        pauseAnimation();
        return;
    }
    
    executeAnimationStep(animationData[currentStep]);
    currentStep++;
    updateStepInfo();
    
    const delay = animationSpeed === 1 ? 1500 : animationSpeed === 2 ? 1000 : 500;
    animationTimer = setTimeout(runAnimationStep, delay);
}

function executeAnimationStep(step) {
    // Draw the data structure with highlighting based on step
    drawDataStructure();
    
    if (step.type === 'highlight' || step.type === 'visit') {
        highlightElement(step.index);
    }
}

function highlightElement(index) {
    if (!currentDS || index >= dataElements.length) return;
    
    const highlightColor = '#DB4545';
    
    // Add highlighting logic based on data structure type
    switch (currentDS.name) {
        case 'Array Operations':
        case 'Sorting Algorithms':
            const startX = 50;
            const startY = 200;
            const cellWidth = 80;
            const cellHeight = 60;
            
            const x = startX + index * cellWidth;
            
            // Highlight the cell
            ctx.fillStyle = highlightColor;
            ctx.fillRect(x, startY, cellWidth, cellHeight);
            
            // Redraw border and value
            ctx.strokeStyle = '#13343B';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, startY, cellWidth, cellHeight);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '16px Arial, sans-serif';
            ctx.fillText(dataElements[index].toString(), x + cellWidth/2, startY + cellHeight/2);
            break;
            
        case 'Stack (LIFO)':
            const stackX = 350;
            const stackY = 320;
            const stackCellWidth = 100;
            const stackCellHeight = 50;
            
            const y = stackY - index * stackCellHeight;
            
            // Highlight the cell
            ctx.fillStyle = highlightColor;
            ctx.fillRect(stackX, y, stackCellWidth, stackCellHeight);
            
            // Redraw border and value
            ctx.strokeStyle = '#13343B';
            ctx.lineWidth = 2;
            ctx.strokeRect(stackX, y, stackCellWidth, stackCellHeight);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '16px Arial, sans-serif';
            ctx.fillText(dataElements[index].toString(), stackX + stackCellWidth/2, y + stackCellHeight/2);
            break;
    }
    
    // Reset font
    ctx.font = '14px Arial, sans-serif';
}

function updateStepInfo() {
    document.getElementById('currentStep').textContent = currentStep;
    document.getElementById('totalSteps').textContent = animationData.length;
    
    if (currentStep > 0 && currentStep <= animationData.length) {
        document.getElementById('stepDescription').textContent = 
            animationData[currentStep - 1]?.description || 'Executing operation...';
    } else {
        document.getElementById('stepDescription').textContent = 
            currentOperation ? 'Click Play to start animation or Step to advance manually' :
            'Select an operation to begin visualization';
    }
}
