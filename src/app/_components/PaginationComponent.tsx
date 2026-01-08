import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalProducts: number;
  onPageChange: (page: number) => void;
  pageSize?: number,
}

export default function Pagination({
  currentPage,
  totalProducts,
  onPageChange,
  pageSize = 10
}: PaginationProps) {

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };
  const totalPages =
    totalProducts !== 1 ? Math.ceil(totalProducts / pageSize) : 1;

  const getVisiblePages = () => {
    const maxVisible = 5
    if (totalPages < maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    let start = Math.max(currentPage - 2, 1)
    let end = start + maxVisible - 1
    if (end > totalPages) {
      end = totalPages
      start = end - maxVisible + 1
    }

    return Array.from({ length: end - start + 1 }, (_, i) => i + start)
  };

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
            {getVisiblePages().map((pageNum) => (
              <Button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                className="w-9 h-9"
              >
                {pageNum}
              </Button>
            ))}</div>
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

