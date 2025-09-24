import Link from "next/link"
import { Button } from "./ui/button"
import { ArrowLeft, Grid3X3 } from "lucide-react"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { ReactNode } from "react";

interface ChildRouteHeaderProps {
  title: string;
  subtitle: string;
  titleIcon: ReactNode;
  backLink: string;
  backText: string;
}

const ChildRouteHeader = ({
  title,
  subtitle,
  titleIcon,
  backLink,
  backText,
}: ChildRouteHeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="w-fit hover:bg-muted"
      >
        <Link href={backLink} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          {backText}
        </Link>
      </Button>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20">
            {titleIcon}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>

  )
}

export default ChildRouteHeader
