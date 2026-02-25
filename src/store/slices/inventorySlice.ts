import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Inventory {
    id: string;
    name: string;
    recordsCount: number;
    lastModified: string;
    modifiedBy: string;
    owner: string;
    access: string;
}

interface InventoryState {
    items: Inventory[];
}

const initialState: InventoryState = {
    items: [
        {
            id: 'inv-1',
            name: 'Main Warehouse',
            recordsCount: 154,
            lastModified: '2026-02-25T10:30:00Z',
            modifiedBy: 'Admin User',
            owner: 'Admin User',
            access: 'Write only',
        },
        {
            id: 'inv-2',
            name: 'Retail Store A',
            recordsCount: 42,
            lastModified: '2026-02-24T14:15:00Z',
            modifiedBy: 'Store Manager',
            owner: 'Store Manager',
            access: 'Admin',
        },
        {
            id: 'inv-3',
            name: 'Retail Store B',
            recordsCount: 28,
            lastModified: '2026-02-22T09:45:00Z',
            modifiedBy: 'Store Manager',
            owner: 'Store Manager',
            access: 'Admin',
        }
    ],
};

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        addInventory: (state, action: PayloadAction<Inventory>) => {
            state.items.push(action.payload);
        },
        deleteInventory: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        updateInventory: (state, action: PayloadAction<Inventory>) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        }
    },
});

export const { addInventory, deleteInventory, updateInventory } = inventorySlice.actions;
export default inventorySlice.reducer;
