import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { SortOrder, WinnersSortField } from '../../types'
import { DEFAULT_CAR_COLOR } from '../../constants'

/**
 * Persistent UI state. Because pagination, sort, and form inputs live here
 * (not in component state), they survive navigating between Garage and
 * Winners — the views unmount, but this slice does not.
 */
interface UiState {
  garagePage: number
  winnersPage: number
  winnersSort: WinnersSortField
  winnersOrder: SortOrder
  createForm: { name: string; color: string }
  // Edit form targets a specific car; null when nothing is being edited.
  editForm: { id: number | null; name: string; color: string }
}

const initialState: UiState = {
  garagePage: 1,
  winnersPage: 1,
  winnersSort: 'id',
  winnersOrder: 'ASC',
  createForm: { name: '', color: DEFAULT_CAR_COLOR },
  editForm: { id: null, name: '', color: DEFAULT_CAR_COLOR },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGaragePage(state, action: PayloadAction<number>) {
      state.garagePage = action.payload
    },
    setWinnersPage(state, action: PayloadAction<number>) {
      state.winnersPage = action.payload
    },
    setWinnersSort(state, action: PayloadAction<WinnersSortField>) {
      // Clicking the active column toggles order; a new column resets to ASC.
      if (state.winnersSort === action.payload) {
        state.winnersOrder = state.winnersOrder === 'ASC' ? 'DESC' : 'ASC'
      } else {
        state.winnersSort = action.payload
        state.winnersOrder = 'ASC'
      }
    },
    setCreateForm(state, action: PayloadAction<Partial<UiState['createForm']>>) {
      state.createForm = { ...state.createForm, ...action.payload }
    },
    resetCreateForm(state) {
      state.createForm = { name: '', color: DEFAULT_CAR_COLOR }
    },
    startEditing(
      state,
      action: PayloadAction<{ id: number; name: string; color: string }>,
    ) {
      state.editForm = action.payload
    },
    setEditForm(state, action: PayloadAction<Partial<UiState['editForm']>>) {
      state.editForm = { ...state.editForm, ...action.payload }
    },
    stopEditing(state) {
      state.editForm = { id: null, name: '', color: DEFAULT_CAR_COLOR }
    },
  },
})

export const {
  setGaragePage,
  setWinnersPage,
  setWinnersSort,
  setCreateForm,
  resetCreateForm,
  startEditing,
  setEditForm,
  stopEditing,
} = uiSlice.actions

export default uiSlice.reducer
