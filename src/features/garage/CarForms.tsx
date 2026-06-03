import type { FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { resetCreateForm, setCreateForm, setEditForm, stopEditing } from '../ui/uiSlice'
import { useCreateCarMutation, useUpdateCarMutation } from '../../api/racingApi'
import { MAX_CAR_NAME_LENGTH } from '../../constants'
import { btn, colorInputCls, cx, inputCls } from '../../ui'

const isValidName = (name: string) =>
  name.trim().length > 0 && name.trim().length <= MAX_CAR_NAME_LENGTH

const groupCls = 'flex min-w-[220px] flex-1 items-center gap-2'

interface CarFormsProps {
  disabled: boolean
}

export default function CarForms({ disabled }: CarFormsProps) {
  const dispatch = useAppDispatch()
  const createForm = useAppSelector((s) => s.ui.createForm)
  const editForm = useAppSelector((s) => s.ui.editForm)
  const [createCar, { isLoading: creating }] = useCreateCarMutation()
  const [updateCar, { isLoading: updating }] = useUpdateCarMutation()

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValidName(createForm.name)) return
    await createCar({ name: createForm.name.trim(), color: createForm.color }).unwrap()
    dispatch(resetCreateForm())
  }

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()
    if (editForm.id === null || !isValidName(editForm.name)) return
    await updateCar({
      id: editForm.id,
      name: editForm.name.trim(),
      color: editForm.color,
    }).unwrap()
    dispatch(stopEditing())
  }

  return (
    <div className="mb-5 flex flex-wrap items-end gap-3 rounded-lg border border-edge bg-panel p-4">
      <form className={groupCls} onSubmit={handleCreate}>
        <input
          type="text"
          className={cx(inputCls, 'flex-1')}
          placeholder="New car name"
          maxLength={MAX_CAR_NAME_LENGTH}
          value={createForm.name}
          onChange={(e) => dispatch(setCreateForm({ name: e.target.value }))}
          disabled={disabled}
        />
        <input
          type="color"
          className={colorInputCls}
          value={createForm.color}
          onChange={(e) => dispatch(setCreateForm({ color: e.target.value }))}
          disabled={disabled}
        />
        <button
          className={btn('primary')}
          type="submit"
          disabled={disabled || creating || !isValidName(createForm.name)}
        >
          Create
        </button>
      </form>

      <form className={groupCls} onSubmit={handleUpdate}>
        <input
          type="text"
          className={cx(inputCls, 'flex-1')}
          placeholder="Select a car to edit"
          maxLength={MAX_CAR_NAME_LENGTH}
          value={editForm.name}
          onChange={(e) => dispatch(setEditForm({ name: e.target.value }))}
          disabled={disabled || editForm.id === null}
        />
        <input
          type="color"
          className={colorInputCls}
          value={editForm.color}
          onChange={(e) => dispatch(setEditForm({ color: e.target.value }))}
          disabled={disabled || editForm.id === null}
        />
        <button
          className={btn('primary')}
          type="submit"
          disabled={
            disabled || updating || editForm.id === null || !isValidName(editForm.name)
          }
        >
          Update
        </button>
      </form>
    </div>
  )
}
