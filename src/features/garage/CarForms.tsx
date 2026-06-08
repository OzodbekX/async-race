import { btn, cx, inputCls } from '../../ui'
import { useCarForm } from './useCarForm'
import ColorInputPair from './ColorInputPair'

interface CarFormsProps {
  disabled: boolean
}

export default function CarForms({ disabled }: CarFormsProps) {
  const { name, color, colorText, isEditing, isLoading, maxLength, isValid, setName, handleColorText, handleColorPicker, handleSubmit, handleCancel } = useCarForm()

  return (
    <form
      className="flex w-full flex-wrap items-center gap-2 rounded-2xl border border-edge bg-panel px-4 py-2 sm:w-auto sm:flex-nowrap sm:rounded-full"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className={cx(inputCls, 'min-w-0 flex-1 basis-full sm:basis-auto')}
        placeholder={isEditing ? 'Edit car name' : 'New car name'}
        maxLength={maxLength}
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={disabled}
      />
      <ColorInputPair
        color={color}
        colorText={colorText}
        onPickerChange={handleColorPicker}
        onTextChange={handleColorText}
        disabled={disabled}
      />
      <button className={btn('primary')} type="submit" disabled={disabled || isLoading || !isValid}>
        {isEditing ? 'Update' : 'Create'}
      </button>
      {isEditing && (
        <button className={btn('ghost')} type="button" onClick={handleCancel} disabled={disabled}>
          Cancel
        </button>
      )}
    </form>
  )
}
