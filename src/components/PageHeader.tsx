'use client'

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export interface PageHeaderProps {
  hasButton?: boolean;
  title: string;
  subtitle: string;
  herf?: string;
}

const PageHeader = ({ title, subtitle, herf, hasButton = true }: PageHeaderProps) => {
  const router = useRouter()
  return (
    <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center  text-foreground mb-4">
      <div>
        <h1 className="text-lg md:text-xl font-bold">
          {title}
        </h1>
        <h3 className="text-xs md:text-sm font-light">
          {subtitle}
        </h3>
      </div>
      {hasButton && <Button variant="default" className="flex-1 md:flex-none px-8" onClick={() => router.push(`${herf}`)}>Create New</Button>}
    </div>
  )
}

export default PageHeader 
