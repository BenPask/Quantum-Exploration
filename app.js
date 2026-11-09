//PASTED WAITTIME HELPER FUNCTION
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

//Pyodide initialization
let pyodide;

async function start() {
    pyodide = await loadPyodide();
    await pyodide.loadPackage("numpy");
    await pyodide.loadPackage("matplotlib");

    const response = await fetch('quantum_circuit.py');
    const code = await response.text();
    pyodide.runPython(code);

    const visResponse = await fetch('visualizer_graphing.py');
    const visCode = await visResponse.text();
    pyodide.runPython(visCode);
    
    initializeApp();
    
}

start();

let qubits = [];

let numOfQubits = 3;

//ADD THIS TO DYNAMIC RESET SCRIPT WHEN ADDING ADD QUBIT FEATURES
let currentCounts = Array(2**numOfQubits).fill(0);

let cnotControl = NaN;

let gateState = 0;

class gateIcon {
    constructor(name, element, sig, ele, color){
        this.name = name;
        this.element = element;
        this.sig = sig;
        this.ele = ele;
        this.color = color
    }
}

const timelineElement = document.querySelector('.timeline');

const timeline = [];

//FOLLOWER ICON
const follower = document.createElement('div')
follower.setAttribute('class', 'follower-image')
follower.style = "position: fixed; background-color: palegoldenrod; display:flex; justify-content: center; align-items: center; width:50px; height:50px; z-index:9999; pointer-events:none;  transform: translate(-50%, -50%); "
const followerText = document.createElement('h1');
followerText.innerHTML = '?'
follower.appendChild(followerText);
follower.style.visibility = 'hidden';

document.querySelector('body').appendChild(follower)

window.addEventListener('mousemove', (e) => {
    follower.style.left = `${e.clientX}px`
    follower.style.top = `${e.clientY}px`
});

//CLICKABLE GATE ICONS
const hicon = document.createElement('div')
hicon.setAttribute('class', '.h-image')
hicon.style = "background-color: palegoldenrod; display:flex; justify-content: center; align-items: center; width:100%; height:100%;"
const hiconText = document.createElement('h1');
hiconText.innerHTML = 'H'
hicon.appendChild(hiconText);

const pxicon = document.createElement('div')
pxicon.setAttribute('class', '.px-image')
pxicon.style = "background-color: palevioletred; display:flex; justify-content: center; align-items: center; width:100%; height:100%;"
const pxiconText = document.createElement('h1');
pxiconText.innerHTML = 'X'
pxicon.appendChild(pxiconText);

const cnoticon = document.createElement('div')
cnoticon.setAttribute('class', '.cnot-image')
cnoticon.style = "background-color: palegreen; display:flex; justify-content: center; align-items: center; width:100%; height:100%;"
const cnoticonText = document.createElement('h1');
cnoticonText.innerHTML = 'CNOT'
cnoticon.appendChild(cnoticonText);

const gateIcons = {
    h:new gateIcon("Hadamard", document.querySelector('.hadamard'), 'h', hicon, 'palegoldenrod'), 
    px:new gateIcon("Pauli-X", document.querySelector('.pauli-x'), 'px', pxicon, 'palevioletred'),
    cnot:new gateIcon("Controlled Not (CNOT)", document.querySelector('.cnot'), 'cnot', cnoticon, 'palegreen')
}

for(const g of Object.values(gateIcons)){
    g.element.addEventListener("click", async function(){
        gateState = g;
        follower.style.visibility = 'visible';
        follower.style.backgroundColor = `${g.color}`
        followerText.innerHTML = g.sig;
    })
}

const measureButtons = {
    x1:document.querySelector(".measure-1x-button"),
    x10:document.querySelector(".measure-10x-button"),
    x1000:document.querySelector(".measure-1000x-button"),
}

measureButtons.x1.addEventListener("click", async function(){
    measureButtonPress(1, [500, 200]);
})

measureButtons.x10.addEventListener("click", async function(){
    measureButtonPress(10, [500, 200]);
})

measureButtons.x1000.addEventListener("click", async function(){
    for(let i = 0; i < 10; i++){
        await measureButtonPress(100, [20, 0]);
    }
})

async function measureButtonPress(shots, delayIn){
    pyodide.runPython(`temp_measurements = circuit.measure(${shots})`);
    pyodide.runPython(`current_measurements += temp_measurements`);

    const pyProxy = pyodide.runPython(`getPresentOrder(temp_measurements)`);
    const idxs_to_display = pyProxy.toJs();

    for(const i of idxs_to_display){
        const binString = i.toString(2).padStart(numOfQubits, '0')

        displayOutput(binString);
        
        for(let i = 0; i < qubits.length; i++){
            qubits[i].valueLabel.textContent = `${binString[(qubits.length-1)-i]}`
        }
        await delay(delayIn[0]); 
        displayOutput("...");
        if(delayIn[1]>0){
            for(const q of qubits){
            q.valueLabel.textContent = `?`
            }
            await delay(delayIn[1]); 
        }
        
    }
    displayHistogram()

    pyProxy.destroy();
}

function displayHistogram(){
    const imgUri = pyodide.runPython(`getHistogram(current_measurements, 4, 4)`);
    document.querySelector(".histogram-container").innerHTML = `<img src="${imgUri}" style="width:100%; height:100%; object-fit:contain;">`;
}

function displayOutput(result){
    const outputText = document.querySelector(".output-text");

    outputText.innerHTML = result
}

function addToTimeline(gate, idx){
    if(Array.isArray(idx)){
        timeline.push([gate, idx])
        updateTimeline()
    }
    else {
        timeline.push([gate, idx[0]])
        updateTimeline()
    }
    
}

function updateTimeline(){
    timelineElement.replaceChildren()
    timelineElement.style.width = '100%';
    timelineElement.style.display = 'flex';
    
    for(let i = 0; i < timeline.length; i++){
        if(Array.isArray(timeline[i][1])){
            const node = timeline[i][0].ele.cloneNode(true);
            node.style.boxShadow = 'inset 0 0 0 1px black';
            node.style.flex = '1';
            node.innerHTML = `<h1>${timeline[i][0].sig}: ${timeline[i][1][0]}c ${timeline[i][1][1]}t</h1>`;
            timelineElement.appendChild(node);
        }
        else{
            const node = timeline[i][0].ele.cloneNode(true);
            node.style.boxShadow = 'inset 0 0 0 1px black';
            node.style.flex = '1';
            
            node.innerHTML = `<h1>${timeline[i][0].sig}: ${timeline[i][1][0]}</h1>`;
            timelineElement.appendChild(node);
        }
        
    }
}

class Qubit {
    constructor(cirObj, qidx, x, y, label, valueLabel){
        this.cirObj = cirObj;
        this.qidx = qidx;
        this.x = x;
        this.y = y;
        this.label = label;
        this.valueLabel = valueLabel;
    }
}

function initializeApp(){
    qubits = [];

    const qubitContainer = document.querySelector(".qubit-container");

    qubitContainer.replaceChildren();

    pyodide.runPython(`circuit = QuantumCircuit(${numOfQubits})`)

    pyodide.runPython(`current_measurements = np.zeros(2**${numOfQubits})`);

    const containerHeight = qubitContainer.getBoundingClientRect().height;

    for(let i=0; i<numOfQubits; i++){
        const col = i % 10;

        const row = Math.floor(i/10);

        const x_perc = 100-col*10-5
        const y_val = (containerHeight/10)*(row+2)

        const newQubit = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        newQubit.setAttribute('class', 'qubit');
        newQubit.setAttribute('id', `q${i}`);
        newQubit.setAttribute('cx', `${x_perc}%`);
        newQubit.setAttribute('cy', `${y_val}px`);
        newQubit.dataset.qidx = i;

        newQubit.addEventListener("click", async function(){
            follower.style.visibility = 'hidden';
            pyodide.runPython(`current_measurements = np.zeros(2**${numOfQubits})`);
            document.querySelector(".histogram-container").innerHTML = "";
            if(gateState==gateIcons.cnot){
                gateState = 4;
                cnotControl = newQubit;
                follower.style.visibility = 'visible';
                follower.style.backgroundColor = `palegreen`
                followerText.innerHTML = 'TARGET';
            }
            else if(gateState==4) {
                pyodide.runPython(`circuit.cnot(${cnotControl.dataset.qidx}, ${newQubit.dataset.qidx})`);
                addToTimeline(gateIcons.cnot, [cnotControl.dataset.qidx, newQubit.dataset.qidx])
                gateState = 0;
            }
            else {
                pyodide.runPython(`circuit.${gateState.sig}(${newQubit.dataset.qidx})`);
                addToTimeline(gateState, newQubit.dataset.qidx)
                gateState = 0;
            }
            
        })

        const qubitLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        qubitLabel.setAttribute('class', 'qubit-label');
        qubitLabel.setAttribute('x', `${x_perc}%`);
        qubitLabel.setAttribute('y', `${y_val}px`);
        qubitLabel.setAttribute('dy', `-2%`);
        qubitLabel.setAttribute(`font-size`, '16');
        qubitLabel.setAttribute(`fill`, 'white');
        qubitLabel.setAttribute(`text-anchor`, 'middle');
        qubitLabel.textContent = `q${i}`

        const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        valueLabel.setAttribute('class', 'value-label');
        valueLabel.setAttribute('x', `${x_perc}%`);
        valueLabel.setAttribute('y', `${y_val}px`);
        valueLabel.setAttribute('dy', `3%`);
        valueLabel.setAttribute(`font-size`, '32');
        valueLabel.setAttribute(`fill`, 'white');
        valueLabel.setAttribute(`text-anchor`, 'middle');
        valueLabel.textContent = `?`

        qubits.push(new Qubit(newQubit, i, x_perc, 10, qubitLabel, valueLabel));
        
        qubitContainer.appendChild(newQubit);
        qubitContainer.appendChild(qubitLabel);
        qubitContainer.appendChild(valueLabel);
    }
}

const groundQubits = document.querySelector('.ground-qubits-button');

groundQubits.addEventListener('click', async function(){
    initializeApp();

    timeline.length = 0;
    updateTimeline();

    gateState = 0;
    follower.style.visibility = 'hidden';

    document.querySelector(".histogram-container").innerHTML = "";
})

const addQubit = document.querySelector('.add-qubit-button');

addQubit.addEventListener('click', async function(){
    numOfQubits += 1;

    initializeApp();

    timeline.length = 0;
    updateTimeline();

    gateState = 0;
    follower.style.visibility = 'hidden';

    document.querySelector(".histogram-container").innerHTML = "";
})

const subQubit = document.querySelector('.sub-qubit-button');

subQubit.addEventListener('click', async function(){
    numOfQubits -= 1;

    initializeApp();

    timeline.length = 0;
    updateTimeline();

    gateState = 0;
    follower.style.visibility = 'hidden';

    document.querySelector(".histogram-container").innerHTML = "";
})