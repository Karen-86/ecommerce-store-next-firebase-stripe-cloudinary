"use client";

import ReactPaginate from "react-paginate";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PaginationDemo({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      previousLabel="<"
      pageCount={totalPages}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      forcePage={page - 1}
      onPageChange={(selectedItem) => {
        onPageChange(selectedItem.selected + 1);
      }}
      containerClassName="flex justify-center items-center gap-1 mt-8"
      pageClassName="flex cursor-pointer hover:bg-black/3  border rounded-md"
      pageLinkClassName=" h-9 w-9  flex items-center justify-center   text-sm"
      previousClassName="flex"
      nextClassName="flex"
      previousLinkClassName="hover:bg-black/3  cursor-pointer h-9 px-3 flex items-center justify-center rounded-md border text-sm"
      nextLinkClassName="hover:bg-black/3  cursor-pointer h-9 px-3 flex items-center justify-center rounded-md border text-sm"
      activeClassName="bg-primary! text-white! border-primary"
      breakClassName="flex items-center justify-center h-9 min-w-9"
    />
  );
}
