'use client'

import Link from "next/link";
import { Button } from "./ui/button";

export interface PageHeaderProps {
  hasButton?: boolean;
  title: string;
  subtitle: string;
  herf?: string;
  buttonText?: string;
  onClick?: () => void;
}

const PageHeader = ({ title, subtitle, herf, hasButton = true, buttonText = "Create New", onClick }: PageHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center  text-foreground mb-4">
      <div>
        <h1 className="text-lg md:text-xl font-bold mb-2">
          {title}
        </h1>
        <h3 className="text-xs md:text-sm text-muted-foreground">
          {subtitle}
        </h3>
      </div>
      {onClick &&
        <Button variant="default" className="flex-1 md:flex-none px-8" onClick={onClick}>
          {buttonText}
        </Button>
      }
      {!onClick &&
        <Button variant="default" className="flex-1 md:flex-none px-8" asChild>
          <Link href={herf || "#"}>
            {buttonText}
          </Link>
        </Button>
      }
    </div>
  )
}

export default PageHeader 
