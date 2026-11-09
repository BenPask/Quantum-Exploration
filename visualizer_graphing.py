import matplotlib
matplotlib.use('Agg')

import matplotlib.pyplot as plt
import io, base64
import numpy as np

def getHistogram(counts, width, height):

    counts = np.array(counts)

    fig, ax = plt.subplots(figsize=(width, height))

    ax.set_position([0.15, 0.25, 0.75, 0.45])

    active_indices = np.where(counts > 0)[0]
    active_counts  = counts[active_indices]

    labels = [np.binary_repr(idx, width=int(np.log2(len(counts)))) for idx in active_indices]

    x_pos = np.arange(len(active_indices))
    
    ax.bar(x_pos, active_counts)
    ax.set_xticks(x_pos)
    ax.set_xticklabels(labels, rotation=45, ha='right')
 
    plt.xlabel('State Index (Non-Zero)')
    plt.ylabel('Frequency')

    buf = io.BytesIO()
    
    plt.savefig(buf, format='png', bbox_inches='tight')
    plt.close()
    
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode() 

def getPresentOrder(measurements):
    measurements_int = np.array(measurements).astype(np.int32)

    all_indices = np.arange(len(measurements_int))

    presented_idx_order = np.repeat(all_indices, measurements_int)
    np.random.shuffle(presented_idx_order)

    return presented_idx_order