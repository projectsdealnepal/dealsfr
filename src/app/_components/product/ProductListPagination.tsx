import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalProducts: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalProducts,
  onPageChange,
}: PaginationProps) {
  const pageSize = 10;

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const totalPages =
    totalProducts !== 1 ? Math.ceil(totalProducts / pageSize) : 1;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
      <div className="text-sm text-slate-600">
        Showing {(currentPage - 1) * pageSize + 1} to{" "}
        {Math.min(currentPage * pageSize, totalProducts)} of{" "}
        {totalProducts || 0} products
      </div>
      {totalProducts > pageSize && (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from(
              { length: Math.min(5, totalPages) },
              (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    variant={
                      currentPage === pageNum ? "default" : "outline"
                    }
                    size="sm"
                    className="w-9 h-9"
                  >
                    {pageNum}
                  </Button>
                );
              }
            )}
          </div>
          <Button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>)}
    </div>
  )
}
