import { Button, Input, Label, Select } from "@medusajs/ui"
import { Plus, Trash } from "@medusajs/icons"
import { useTranslation } from "react-i18next"
import { forwardRef, useMemo, useCallback } from "react"
import { Temporal } from "temporal-polyfill"
import { DurationFormat } from "@formatjs/intl-durationformat"

interface DurationInputProps {
    value?: string[]
    onChange?: (value: string[]) => void
}

const UNITS = ["months", "weeks", "days", "hours", "minutes"] as const

export const DurationInput = forwardRef<HTMLDivElement, DurationInputProps>(
    ({ value = [], onChange }, ref) => {
        const { t, i18n: { language = "en" } } = useTranslation("postmark")
        const formatter = useMemo(() => new DurationFormat(language, { style: "long" }), [language])

        const durations = useMemo(() =>
            value.map(iso => { try { return Temporal.Duration.from(iso) } catch { return null } })
                .filter((d): d is Temporal.Duration => d !== null),
            [value]
        )

        const formatUnit = useCallback((unit: string, val: number) => {
            try {
                return formatter.format(Temporal.Duration.from({ [unit]: val }))
                    .replace(/[\d\s]/g, "").trim()
            } catch {
                return unit
            }
        }, [formatter])

        const update = useCallback((updated: Temporal.Duration[]) =>
            onChange?.(updated.map(d => d.toString())), [onChange])

        const set = useCallback((i: number, unit: string, val: number) => {
            const updated = [...durations]
            updated[i] = Temporal.Duration.from({ [unit]: val })
            update(updated)
        }, [durations, update])

        const getUnitAndValue = useCallback((d: Temporal.Duration) => {
            for (const unit of UNITS) {
                if (d[unit]) return { unit, value: d[unit] }
            }
            return { unit: "hours", value: 1 }
        }, [])

        return (
            <div ref={ref} className="space-y-3">
                {durations.length > 0 && (
                    <div className="flex items-center gap-2 -mb-2">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                            <Label className="text-xs">{t("fields.value")}</Label>
                            <Label className="text-xs">{t("fields.unit")}</Label>
                        </div>
                        <Button size="small" variant="transparent" className="invisible" disabled>
                            <Trash />
                        </Button>
                    </div>
                )}

                {durations.map((duration, i) => {
                    const { unit, value: val } = getUnitAndValue(duration)

                    return (
                        <div key={i}>
                            {i > 0 && <div className="border-t border-ui-border-base my-3" />}
                            <div className="flex items-center gap-2">
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                    <Input
                                        type="number"
                                        min={0}
                                        value={val}
                                        onChange={e => {
                                            const num = parseInt(e.target.value)
                                            if (!isNaN(num) && num > 0) set(i, unit, num)
                                        }}
                                    />
                                    <Select value={unit} onValueChange={u => set(i, u, val)}>
                                        <Select.Trigger><Select.Value /></Select.Trigger>
                                        <Select.Content>
                                            {UNITS.map(u => (
                                                <Select.Item key={u} value={u}>
                                                    {formatUnit(u, val)}
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select>
                                </div>
                                <Button
                                    size="small"
                                    variant="transparent"
                                    onClick={() => update(durations.filter((_, idx) => idx !== i))}
                                    type="button"
                                    className="text-ui-fg-error hover:bg-ui-bg-error-hover"
                                >
                                    <Trash />
                                </Button>
                            </div>
                        </div>
                    )
                })}

                <Button
                    size="small"
                    variant="secondary"
                    onClick={() => update([...durations, Temporal.Duration.from({ hours: 1 })])}
                    type="button"
                    className="w-full"
                >
                    <Plus />
                    {t("actions.add")}
                </Button>
            </div>
        )
    }
)

DurationInput.displayName = "DurationInput"
