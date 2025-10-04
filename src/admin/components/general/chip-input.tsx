import { XMarkMini } from "@medusajs/icons"
import { Badge, clx } from "@medusajs/ui"
import {
    FocusEvent,
    KeyboardEvent,
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
} from "react"

type ChipInputProps = {
    value?: string[]
    onChange?: (value: string[]) => void
    onBlur?: () => void
    name?: string
    disabled?: boolean
    allowDuplicates?: boolean
    showRemove?: boolean
    variant?: "base" | "contrast"
    placeholder?: string
    className?: string
}

export const ChipInput = forwardRef<HTMLInputElement, ChipInputProps>(
    (
        {
            value,
            onChange,
            onBlur,
            disabled,
            name,
            showRemove = true,
            variant = "base",
            allowDuplicates = false,
            placeholder,
            className,
        },
        ref
    ) => {
        const innerRef = useRef<HTMLInputElement>(null)

        const isControlledRef = useRef(typeof value !== "undefined")
        const isControlled = isControlledRef.current

        const [uncontrolledValue, setUncontrolledValue] = useState<string[]>([])

        useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
            ref,
            () => innerRef.current
        )

        const [duplicateIndex, setDuplicateIndex] = useState<number | null>(null)

        const chips = isControlled ? (value as string[]) : uncontrolledValue

        // Sort chips by numerical value
        const sortedChips = [...chips].sort((a, b) => {
            const numA = parseFloat(a) || 0
            const numB = parseFloat(b) || 0
            return numA - numB
        })

        const handleAddChip = (chip: string) => {
            const cleanValue = chip.trim()

            if (!cleanValue) {
                return
            }

            if (!allowDuplicates && sortedChips.includes(cleanValue)) {
                setDuplicateIndex(sortedChips.indexOf(cleanValue))

                setTimeout(() => {
                    setDuplicateIndex(null)
                }, 300)

                return
            }

            const newChips = [...chips, cleanValue]
            const sortedNewChips = newChips.sort((a, b) => {
                const numA = parseFloat(a) || 0
                const numB = parseFloat(b) || 0
                return numA - numB
            })

            onChange?.(sortedNewChips)

            if (!isControlled) {
                setUncontrolledValue(sortedNewChips)
            }
        }

        const handleRemoveChip = (chip: string) => {
            const filteredChips = chips.filter((v) => v !== chip)
            const sortedFilteredChips = filteredChips.sort((a, b) => {
                const numA = parseFloat(a) || 0
                const numB = parseFloat(b) || 0
                return numA - numB
            })

            onChange?.(sortedFilteredChips)

            if (!isControlled) {
                setUncontrolledValue(sortedFilteredChips)
            }
        }

        const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
            onBlur?.()

            if (e.target.value) {
                handleAddChip(e.target.value)
                e.target.value = ""
            }
        }

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" || e.key === ",") {
                e.preventDefault()

                if (!innerRef.current?.value) {
                    return
                }

                handleAddChip(innerRef.current?.value ?? "")
                innerRef.current.value = ""
                innerRef.current?.focus()
            }

            if (e.key === "Backspace" && innerRef.current?.value === "") {
                handleRemoveChip(sortedChips[sortedChips.length - 1])
            }
        }

        return (
            <div
                className={clx(
                    "shadow-borders-base flex min-h-8 flex-wrap items-center gap-1 rounded-md px-2 py-1.5",
                    "transition-fg focus-within:shadow-borders-interactive-with-active",
                    "has-[input:disabled]:bg-ui-bg-disabled has-[input:disabled]:text-ui-fg-disabled has-[input:disabled]:cursor-not-allowed",
                    {
                        "bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover":
                            variant === "contrast",
                        "bg-ui-bg-field hover:bg-ui-bg-field-hover": variant === "base",
                    },
                    className
                )}
                tabIndex={-1}
                onClick={() => innerRef.current?.focus()}
            >
                {sortedChips.map((v, index) => {
                    return (
                        <Badge
                            key={`${v}-${index}`}
                            size="2xsmall"
                            className={clx("gap-x-0.5 pl-1.5 pr-1.5", {
                                "transition-fg pr-1": showRemove,
                                "shadow-borders-focus": index === duplicateIndex,
                            })}
                        >
                            {v}
                            {showRemove && (
                                <button
                                    tabIndex={-1}
                                    type="button"
                                    onClick={() => handleRemoveChip(v)}
                                    className={clx(
                                        "text-ui-fg-subtle transition-fg outline-none"
                                    )}
                                >
                                    <XMarkMini />
                                </button>
                            )}
                        </Badge>
                    )
                })}
                <input
                    className={clx(
                        "caret-ui-fg-base text-ui-fg-base txt-compact-small flex-1 appearance-none bg-transparent",
                        "disabled:text-ui-fg-disabled disabled:cursor-not-allowed",
                        "focus:outline-none",
                        "placeholder:text-ui-fg-muted"
                    )}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    disabled={disabled}
                    name={name}
                    ref={innerRef}
                    placeholder={sortedChips.length === 0 ? placeholder : undefined}
                    autoComplete="off"
                />
            </div>
        )
    }
)

ChipInput.displayName = "ChipInput"
