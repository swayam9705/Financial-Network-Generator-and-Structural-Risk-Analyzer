const API_BASE_URL = 'http://localhost:8000';

export async function fetchGeneratedNetwork(numCore = 5, numPeriphery = 8, seed = 42) {
    const response = await fetch(`${API_BASE_URL}/api/generate-network`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            num_core: Number(numCore),
            num_periphery: Number(numPeriphery),
            seed: Number(seed)
        })
    });
    if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
    }
    return response.json();
}

export async function fetchSimulatedShock(numCore, numPeriphery, seed, shockedBankId, shockMultiplier) {
    const response = await fetch(`${API_BASE_URL}/api/simulate-shock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            num_core: Number(numCore),
            num_periphery: Number(numPeriphery),
            seed: Number(seed),
            shocked_bank_id: Number(shockedBankId),
            shock_multiplier: Number(shockMultiplier)
        })
    });
    if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
    }
    return response.json();
}