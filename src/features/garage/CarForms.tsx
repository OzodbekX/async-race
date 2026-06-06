import type React from 'react'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { resetCreateForm, setCreateForm, setEditForm, stopEditing } from '../ui/uiSlice'
import { useCreateCarMutation, useUpdateCarMutation } from '../../api/racingApi'
import { MAX_CAR_NAME_LENGTH } from '../../constants'
import { btn, colorInputCls, cx, inputCls } from '../../ui'

const isValidName = (name: string) =>
  name.trim().length > 0 && name.trim().length <= MAX_CAR_NAME_LENGTH

const isValidHex = (v: string) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)

interface CarFormsProps {
  disabled: boolean
}

export default function CarForms({ disabled }: CarFormsProps) {
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

  // Keep text in sync when color changes externally (e.g. switching selected car)
  useEffect(() => {
    setColorText(color)
  }, [color])

  const setName = (value: string) =>
    dispatch(isEditing ? setEditForm({ name: value }) : setCreateForm({ name: value }))

  const setColor = (value: string) =>
    dispatch(isEditing ? setEditForm({ color: value }) : setCreateForm({ color: value }))

  const handleColorText = (value: string) => {
    setColorText(value)
    if (isValidHex(value)) setColor(value)
  }

  const handleColorPicker = (value: string) => {
    setColorText(value)
    setColor(value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isValidName(name)) return

    if (isEditing) {
      await updateCar({ id: editForm.id!, name: name.trim(), color }).unwrap()
      dispatch(stopEditing())
    } else {
      await createCar({ name: name.trim(), color }).unwrap()
      dispatch(resetCreateForm())
    }
  }

  const handleCancel = () => dispatch(stopEditing())

  return (
    <form
      className="flex shrink-0 items-center gap-2 rounded-full border border-edge bg-panel px-4 py-2"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className={cx(inputCls, 'min-w-0 flex-1')}
        placeholder={isEditing ? 'Edit car name' : 'New car name'}
        maxLength={MAX_CAR_NAME_LENGTH}
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={disabled}
      />
      <input
        type="color"
        className={colorInputCls}
        value={color}
        onChange={(e) => handleColorPicker(e.target.value)}
        disabled={disabled}
      />
      <input
        type="text"
        className={cx(inputCls, 'w-24 font-mono text-xs')}
        placeholder="#000000"
        maxLength={7}
        value={colorText}
        onChange={(e) => handleColorText(e.target.value)}
        disabled={disabled}
        spellCheck={false}
      />
      <button
        className={btn('primary')}
        type="submit"
        disabled={disabled || isLoading || !isValidName(name)}
      >
        {isEditing ? 'Update' : 'Create'}
      </button>
      {isEditing && (
        <button
          className={btn('ghost')}
          type="button"
          onClick={handleCancel}
          disabled={disabled}
        >
          Cancel
        </button>
      )}
    </form>
  )
}
