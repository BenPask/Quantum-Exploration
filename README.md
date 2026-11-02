[![Dependencies](https://img.shields.io/badge/dependencies-numpy%20only-green)](https://github.com/numpy/numpy)

# Quantum Computing Exploration: Building an N-Qubit Statevector Simulator from Scratch (NumPy-Only)

This project serves as a log of my mathematical exploration and hands-on implementations of fundamental quantum computing concepts. It progresses from complex amplitudes and basic notation to implementing gate operations, entanglement, and measurement statistics.

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

We can see that this results in the circuit having only two potential measurement outcomes, 00 or 11 (both equally likely) when measured. This maximal entanglement perfectly represents what it means for qubits to be entangled, the state of one qubit directly affects the state of the other. The qubits' states no longer exist as independently measurable or operable items, but as a combined circuit of dependent vectors. 

_Note: Qubits are indexed from the right, with the 0th index of a given qubit being the least significant bit (the bit furthest to the right)_

This demo will show how to create that state using the ```QuantumCircuit()``` class found in [src/quantum_circuit.py](pathtofile) and bin its measurements over 1000 shots. To create the Bell State: initialize a qubit circuit object containing two qubits, apply a Hadamard gate to qubit index 0, and apply a CNOT with the index of control and target being 0 and 1, respectively. 

```
#Initialize a two-qubit quantum circuit 
circuit = QuantumCircuit(2)

#Apply Hadamard and CNOT gates
circuit.h(0).cnot(0, 1)

#Print probability amplitudes alongside ##binary representation of possibilities
circuit.show_amp_bin()

'''Save a copy of the 1D state array with the values now corresponding to the number of times that possible state was measured'''

measurements = circuit.measure(1000)
```

To view these measurements as a histogram in matplotlib, check out the [dynamic graphing script](pathtofile) from notebook 05 that uses logarithmic circuit size calculations to avoid having to pass anything beyond the returned array of measurements.
  
