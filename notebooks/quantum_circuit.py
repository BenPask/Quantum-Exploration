import numpy as np

class QuantumCircuit:
    def __init__(self, n_qubits):
        self.n_qubits = n_qubits
        self.state_vector = np.zeros(2**n_qubits, dtype=np.complex128)
        self.state_vector[0] = 1.0

    def show_amp_bin(self):
        padding = self.n_qubits
        for i, amplitude in enumerate(self.state_vector):
            print(f"{amplitude.real}: {i:0{padding}b}")
