//Pyodide initialization
let pyodide;

async function start() {
    pyodide = await loadPyodide();
    await pyodide.loadPackage("numpy")

    const response = await fetch('quantum_circuit.py');
    const code = await response.text();
    pyodide.runPython(code);

    pyodide.runPython("circuit = QuantumCircuit(2)")
}

start();

//qubitDisplay


function qubitDisplay(){
    const qubitContainer = document.querySelector(".qubit-container");

    const numOfQubits = 3;

    for(let i=0; i<numOfQubits; i++){
        const newQubit = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        newQubit.setAttribute('class', 'qubit');
        newQubit.setAttribute('id', `q${i}`);
        newQubit.setAttribute('cx', `${i*10+10}%`)
        newQubit.dataset.qidx = i
        qubitContainer.appendChild(newQubit);
    }

}

qubitDisplay();
