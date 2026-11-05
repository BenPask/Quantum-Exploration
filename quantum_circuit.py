import numpy as np

class QuantumCircuit:
    def __init__(self, n_qubits):
        self.n_qubits = n_qubits
        self.size = 2**n_qubits
        self.state_vector = np.zeros(2**n_qubits, dtype=np.complex128)
        self.state_vector[0] = 1.0

    def show_amp_bin(self):
        padding = self.n_qubits
        for i, amplitude in enumerate(self.state_vector):
            print(f"{amplitude.real}: {i:0{padding}b}")

    def h(self, target_idx):
        mask = 1 << target_idx
        h_mult = 1/np.sqrt(2)
        new_state = np.copy(self.state_vector)

        for i in range(self.size):
            if (i & mask) == 0:
                delta_i1 = (self.state_vector[i] + self.state_vector[i ^ mask])*h_mult
                delta_i2 = (self.state_vector[i] - self.state_vector[i ^ mask])*h_mult

                new_state[i] = delta_i1
                new_state[i ^ mask] = delta_i2

        self.state_vector = new_state

        return self

    def px(self, target_idx):
        mask = 1 << target_idx
        sv = self.state_vector

        total_indices = np.arange(len(sv))

        idx1 = total_indices[(total_indices & mask) == 0]
        idx2 = idx1 ^ mask

        sv[idx1], sv[idx2] = sv[idx2].copy(), sv[idx1].copy()

        return self

    def cnot(self, control_idx, target_idx):
        control_mask = 1 << control_idx
        target_mask = 1 << target_idx
        sv = self.state_vector

        total_indices = np.arange(len(sv))

        idxs_when_c1 = total_indices[(total_indices & control_mask) != 0]

        idxs_when_t0 = idxs_when_c1[(idxs_when_c1 & target_mask) == 0]
        idxs_when_t1 = idxs_when_t0 ^ target_mask

        sv[idxs_when_t0], sv[idxs_when_t1] = sv[idxs_when_t1].copy(), sv[idxs_when_t0].copy()

        return self

    def measure(self, shots):
        probabilities = np.abs(self.state_vector)**2 #Convert to %

        measurements = np.zeros(self.size)

        choices = np.random.choice(np.arange(len(probabilities)), size=shots, p=probabilities)  # p here is weighting the choices

        np.add.at(measurements, choices, 1)

        return measurements
