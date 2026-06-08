import { colorInputCls, cx, inputCls } from '../../ui'

interface ColorInputPairProps {
  color: string
  colorText: string
  onPickerChange: (value: string) => void
  onTextChange: (value: string) => void
  disabled: boolean
}

export default function ColorInputPair({ color, colorText, onPickerChange, onTextChange, disabled }: ColorInputPairProps) {
  return (
    <>
      <input
        type="color"
        className={colorInputCls}
        value={color}
        onChange={(e) => onPickerChange(e.target.value)}
        disabled={disabled}
      />
      <input
        type="text"
        className={cx(inputCls, 'w-24 font-mono text-xs')}
        placeholder="#000000"
        maxLength={7}
        value={colorText}
        onChange={(e) => onTextChange(e.target.value)}
        disabled={disabled}
        spellCheck={false}
      />
    </>
  )
}
