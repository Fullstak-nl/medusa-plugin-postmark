import { Button } from "@medusajs/ui"
import { Link } from "react-router-dom"

type DataTableActionProps = {
    label: string
    disabled?: boolean
} & (
        | {
            to: string
        }
        | {
            onClick: () => void
        }
    )

export const DataTableAction = ({
    label,
    disabled,
    ...props
}: DataTableActionProps) => {
    const buttonProps = {
        size: "small" as const,
        disabled: disabled ?? false,
        type: "button" as const,
        variant: "secondary" as const,
    }

    if ("to" in props) {
        return (
            <Button {...buttonProps} asChild>
                <Link to={props.to}>{label}</Link>
            </Button>
        )
    }

    return (
        <Button {...buttonProps} onClick={props.onClick}>
            {label}
        </Button>
    )
}


