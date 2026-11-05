//PASTED WAITTIME HELPER FUNCTION
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

//Pyodide initialization
let pyodide;

async function start() {
    pyodide = await loadPyodide();
    await pyodide.loadPackage("numpy")

    const response = await fetch('quantum_circuit.py');
    const code = await response.text();
    pyodide.runPython(code);
    

    initializeApp();
}

start();



const numOfQubits = 3;

const measureButtons = {
    x1:document.querySelector(".measure-1x-button"),
    x10:document.querySelector(".measure-10x-button"),
    x1000:document.querySelector(".measure-1000x-button"),
}

measureButtons.x1.addEventListener("click", async function(){
    const pyProxy = pyodide.runPython(`circuit.measure(1)`);
    const result = pyProxy.toJs();

    const nonZeroIdx = result.findIndex(num => num != 0);
    displayOutput(nonZeroIdx.toString(2).padStart(numOfQubits, '0'));
    await delay(500); 
    displayOutput("...");

    pyProxy.destroy();
})

measureButtons.x10.addEventListener("click", async function(){
    const pyProxy = pyodide.runPython(`circuit.measure(10)`);
    const result = pyProxy.toJs();

    for(let i = 0; i < 10; i++){
        const nonZeroIdx = result.findIndex(num => num != 0);
        result[nonZeroIdx] -= 1;
        displayOutput(nonZeroIdx.toString(2).padStart(numOfQubits, '0'));
        await delay(500); 
        displayOutput("...");
        await delay(200); 
    }

    pyProxy.destroy();
})

measureButtons.x1000.addEventListener("click", async function(){
    const pyProxy = pyodide.runPython(`circuit.measure(1000)`);
    const result = pyProxy.toJs();

    for(let i = 0; i < 1000; i++){
        const nonZeroIdx = result.findIndex(num => num != 0);
        result[nonZeroIdx] -= 1;
        displayOutput(nonZeroIdx.toString(2).padStart(numOfQubits, '0'));
        await delay(10); 
        displayOutput("...");
        await delay(5); 
    }

    pyProxy.destroy();
})

function displayOutput(result){
    const outputText = document.querySelector(".output-text");

    outputText.innerHTML = result
}

function initializeApp(){
    const qubitContainer = document.querySelector(".qubit-container");

    pyodide.runPython(`circuit = QuantumCircuit(${numOfQubits})`)

    for(let i=0; i<numOfQubits; i++){
        const newQubit = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        newQubit.setAttribute('class', 'qubit');
        newQubit.setAttribute('id', `q${i}`);
        newQubit.setAttribute('cx', `${i*10+10}%`)
        newQubit.dataset.qidx = i
        qubitContainer.appendChild(newQubit);
    }
}


