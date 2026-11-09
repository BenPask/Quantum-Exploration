[![Dependencies](https://img.shields.io/badge/dependencies-numpy%20only-green)](https://github.com/numpy/numpy)

# Quantum Computing Exploration: Building an N-Qubit Statevector Simulator from Scratch (NumPy-Only)

This project serves as a log of my mathematical exploration and hands-on implementations of fundamental quantum computing concepts. It progresses from complex amplitudes and basic notation to implementing gate operations, entanglement, and measurement statistics.

[**INTERACTIVE CIRCUIT SIMULATOR WEB APP**](https://gramsofprotean.github.io/home/statevector-sim/index.html)


## Features

- **Mathematical exploration:** Files include the exploratory notebooks I used while independently attempting to figure out core quantum computing concepts. Materials include challenges faced and initial rough understanding for historical context and growth.
  
- **Quantum state representation:** Qubit statevectors represented as efficient, 1-D ```np.complex128()``` arrays.
  
- **Quantum gate operations:** Includes methods for Hadamard, Pauli-X, and CNOT gates.
  
- **Superposition and entanglement:** With the implementation of Hadamard and CNOT gates, it includes the ability to simulate qubit superposition and entanglement.
  
- **Statistical visualization:** Includes the ability to simulate measurement outcomes using shots, formatted for histogram analysis.

## Demo: Bell State Creation

Bell State (maximally entangled dual-qubit circuit):

$`
\psi = \frac{1}{\sqrt{2}}|00\rangle + 0.0|01\rangle + 0.0|10\rangle + \frac{1}{\sqrt{2}}|11\rangle
`$

We can see that this results in the circuit having only two potential measurement outcomes, 00 or 11 (both equally likely) when measured. This maximal entanglement perfectly represents what it means for qubits to be entangled: the state of one qubit directly affects the state of the other. The qubits' states no longer exist as independently measurable or operable items, but as a combined circuit of dependent vectors. 

_Note: Qubits are indexed from the right, with the 0th index of a given qubit being the least significant bit (the bit furthest to the right)_

This demo will show how to create that state using the ```QuantumCircuit()``` class found in [src/quantum_circuit.py](https://github.com/BenPask/Quantum-Exploration/blob/main/notebooks/05_measurement.ipynb) and bin its measurements over 1000 shots. To create the Bell State: initialize a qubit circuit object containing two qubits, apply a Hadamard gate to qubit index 0, and apply a CNOT with the index of control and target being 0 and 1, respectively. 

```
#Initialize a two-qubit quantum circuit 
circuit = QuantumCircuit(2)

#Apply Hadamard and CNOT gates
circuit.h(0).cnot(0, 1)

#Print probability amplitudes alongside ##binary representation of possibilities
circuit.show_amp_bin()

'''Save a copy of the 1D state array with the values now corresponding to the number of
times that possible state was measured'''

measurements = circuit.measure(1000)
```

To view these measurements as a histogram in matplotlib, check out the [dynamic graphing script](pathtofile) from notebook 05 that uses logarithmic circuit size calculations to avoid having to pass anything beyond the returned array of measurements.

## Supported Operations

Currently, the circuit simulation includes 3 gates and 2 utility methods, other than the init method:

### Init Method
- ```QuantumCircuit(n_qubits)``` Returns a QuantumCircuit object with _n_qubits_ being the number of qubits.

### Gate Methods

- ```.h(qubit_idx)``` Appplies a Hadamard gate to the qubit at _qubit_idx_ (indexed from right).

- ```.px(qubit_idx)``` Applies a Pauli-X gate to the qubit at _qubit_idx_ (indexed from right).

- ```.cnot(control_idx, target_idx)``` Applies a CNOT (Controlled NOT) gate to the qubit at _target_idx_ based on the qubit at _control_idx_ (indexed from right).

### Utility Methods

- ```.show_bin_amps()``` Very simple display utility, prints statevector amplitudes alongside their binary/index representation. Useful for bug fixing or simple demos.

- ```.measure(num_shots)``` Uses probabilities calculated via the Born rule to measure each qubit _num_shots_ number of times. Returns a NumPy array identical to the primary array of amplitudes, but replacing corresponding values with the number of times that combination was measured (like histogram bins).

## Installation & Requirements

To use the simulator in your own project, the only imports are [the file itself](pathtofile) and **NumPy**. Additionally, if you'd like to use the [dynamic histogram graphing script](https://github.com/BenPask/Quantum-Exploration/blob/main/notebooks/05_measurement.ipynb) featured in notebook 05, you'll need to import **matplotlib**:

```
import matplotlib.pyplot as plt
import numpy as np
from quantum_circuit.py import QuantumCircuit

###YOUR CODE GOES HERE!
###To start, you can do: circuit = QuantumCircuit(2)
```

## Notebooks

The center of this project's growth is the learning log that I've kept alongside it. Currently, that part of the project features 5 Jupyter notebooks and is available [here](https://github.com/BenPask/Quantum-Exploration/tree/main/notebooks).

When I had the idea to keep a log of my progress, I knew I wanted to keep the journals authentic and human. **The notebooks, especially the early ones, don't reflect my current understanding of the subject matter.** 

The following is a summary of each notebook and the topics covered in each:

- [01_what_is_quantum](https://github.com/BenPask/Quantum-Exploration/blob/main/notebooks/01_what_is_quantum.ipynb) | Began with identifying the goals, inspirations, and proposed methodology of the project. Then I started learning fundamental concepts and their quantum applications, such as complex numbers, qubits, amplitudes, and Dirac notation.

- [02_bridge_to_code](https://github.com/BenPask/Quantum-Exploration/blob/main/notebooks/02_bridge_to_code.ipynb) | Began with understanding tensor products before getting into the specific concepts of superposition and entanglement. This notebook served to develop my understanding to a point where I felt comfortable starting to experiment with code in the next one.

- [03_experimenting_with_code](https://github.com/BenPask/Quantum-Exploration/blob/main/notebooks/03_experimenting_with_code.ipynb) | The longest notebook, covered initial attempts to simulate qubits in Python. The notebook discusses the thought process behind, research, and early development of the simulator's structure. By the end of the notebook, I was able to implement the skeleton of the ```QuantumCircuit``` class and the ```.h()``` method.

- [04_more_gates](https://github.com/BenPask/Quantum-Exploration/blob/main/notebooks/04_more_gates.ipynb) | I knew by this point that I wanted to implement the Pauli-X and CNOT gates next, all to arrive at simulating entanglement, which I saw as a major challenge and milestone in the project's development. The code quality and efficiency got noticeably a bit better as I documented a few hours of theorizing and troubleshooting the best way to tackle the new gates. At the end of this notebook, I had implemented all of the core gates/methods necessary for the simulator I envisioned.

- [05_measurement](https://github.com/BenPask/Quantum-Exploration/blob/main/notebooks/05_measurement.ipynb) | This notebook wraps up the initial development by adding a realistic measurement method to simulate shots for frequency mapping on histograms (code calls matplotlib box plots because values are pre-binned by the ```.measure()``` method).







