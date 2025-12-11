"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Stat = {
  title: string;
  value: string | number;
};

const StatsCard = ({ title, value }: { title: string; value: string | number }) => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-4xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default StatsCard
