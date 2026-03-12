import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CustomField {
    id?: string;
    name: string;
    description?: string;
    type: string;
    isDisplay: boolean;
}

export interface InventoryAccess {
    id?: string;
    userId: string;
    accessType: string;
}

export interface Inventory {
    id: string;
    name: string;
    visibility?: string;
    recordsCount: number;
    lastModified: string;
    modifiedBy: string;
    owner: string;
    access: string;
    customIdMask?: string;
    fields?: CustomField[];
    accesses?: InventoryAccess[];
}

interface InventoryState {
    items: Inventory[];
}

const initialState: InventoryState = {
    items: [],
};

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        setInventories: (state, action: PayloadAction<Inventory[]>) => {
            state.items = action.payload;
        },
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
        },
        patchInventoryLocal: (state, action: PayloadAction<Partial<Inventory> & { id: string }>) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...action.payload };
            }
        }
    },
});

export const { setInventories, addInventory, deleteInventory, updateInventory, patchInventoryLocal } = inventorySlice.actions;
export default inventorySlice.reducer;
