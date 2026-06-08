import type React from 'react'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { resetCreateForm, setCreateForm, setEditForm, stopEditing } from '../ui/uiSlice'
import { useCreateCarMutation, useUpdateCarMutation } from '../../api/racingApi'
import { MAX_CAR_NAME_LENGTH } from '../../constants'
import { isValidName, isValidHex } from '../../utils/validation'

export function useCarForm() {
  const dispatch = useAppDispatch()
  const createForm = useAppSelector((s) => s.ui.createForm)
  const editForm = useAppSelector((s) => s.ui.editForm)
  const [createCar, { isLoading: creating }] = useCreateCarMutation()
  const [updateCar, { isLoading: updating }] = useUpdateCarMutation()

  const isEditing = editForm.id !== null
  const name = isEditing ? editForm.name : createForm.name
  const color = isEditing ? editForm.color : createForm.color
  const isLoading = creating || updating

  const [colorText, setColorText] = useState(color)
  const [prevColor, setPrevColor] = useState(color)
  if (prevColor !== color) { setPrevColor(color); setColorText(color) }

  const setName = (value: string) =>
    dispatch(isEditing ? setEditForm({ name: value }) : setCreateForm({ name: value }))
  const setColor = (value: string) =>
    dispatch(isEditing ? setEditForm({ color: value }) : setCreateForm({ color: value }))
  const handleColorText = (value: string) => { setColorText(value); if (isValidHex(value)) setColor(value) }
  const handleColorPicker = (value: string) => { setColorText(value); setColor(value) }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isValidName(name)) return
    try {
      if (isEditing) { await updateCar({ id: editForm.id!, name: name.trim(), color }).unwrap(); dispatch(stopEditing()) }
      else { await createCar({ name: name.trim(), color }).unwrap(); dispatch(resetCreateForm()) }
    } catch { /* form stays open so the user can retry */ }
  }

  return { name, color, colorText, isEditing, isLoading, maxLength: MAX_CAR_NAME_LENGTH, isValid: isValidName(name), setName, handleColorText, handleColorPicker, handleSubmit, handleCancel: () => dispatch(stopEditing()) }
}
