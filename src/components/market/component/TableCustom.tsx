"use client";

import {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/DataTable/Table";
import Pagination from "@/components/common/Pagination";
import Spinner from "@/components/common/Spinner";
import ArrowUpDownIcon from "@/components/common/Icons/ArrowUpDownIcon";

interface TableCustomProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total?: number;
  onChangePagination?: (page: number) => void;
  onClickRow?: (data: TData) => void;
  showPagination?: boolean;
  sorting?: SortingState;
  setSorting?: OnChangeFn<SortingState>;
  isLoading?: boolean;
}

function TableCustom<TData, TValue>({
  columns,
  data,
  total,
  onChangePagination,
  onClickRow,
  showPagination = false,
  sorting,
  setSorting,
  isLoading,
}: TableCustomProps<TData, TValue>) {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 2,
    pageSize: 10,
  });
  
  const pagination = useMemo(() => {
    onChangePagination && onChangePagination(pageIndex + 1);
    return {
      pageIndex,
      pageSize,
    };
  }, [pageIndex, pageSize]);
  const pageCount = useMemo(() => Math.ceil((total || 0) / pagination.pageSize), [total, pagination.pageSize]);
  const noData = useMemo(() => total === 0, [total]);
  const table = useReactTable({
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    pageCount,
    onPaginationChange: setPagination,
    state: {
      pagination,
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleOnClickRow = (e: MouseEvent<HTMLDivElement>, data: TData) => {
    e.preventDefault();
    e.stopPropagation();
    onClickRow && onClickRow(data);
  };

  return (
    <>
      <div
        className="rounded overflow-auto scroll-table flex flex-col"
        // ref={tableWrapper}
      >
        <Table className={cn("relative rounded")}>
          <TableHeader className="relative">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="sticky bg-background-tertiary border-b border-divider-secondary"
              >
                {headerGroup.headers.map((header, index) => {
                  const heightSpan = table.getRowModel().rows?.length * 68 + 48;
                  const meta: any = header.column.columnDef.meta;
                  const isFixed = meta?.fixed;
                  const width = meta?.width;
                  const show = meta?.show === false ? false : true;
                  const showArrow = meta?.showArrow;
                  return show ? (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "text-caption-12B relative text-typo-secondary",
                        isFixed &&
                          "shadow-left bg-light-white sticky right-0 z-10 border-b",
                        header.column.getCanSort()
                          ? "select-none cursor-pointer"
                          : ""
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        width: `${width}px`,
                        minWidth: `${width}px`,
                      }}
                    >
                      {isFixed && !noData ? (
                        <span
                          style={{ height: `${heightSpan}px`, right: 0 }}
                          className="absolute top-0 w-full bg-light-2 shadow-fixed"
                        />
                      ) : null}
                      <p className="flex items-center gap-x-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {showArrow === true
                          ? {
                              asc: (
                                <ArrowUpDownIcon
                                  className="h-4 w-4 "
                                  sort={true}
                                />
                              ),
                              desc: (
                                <ArrowUpDownIcon
                                  className="h-4 w-4 "
                                  sort={false}
                                />
                              ),
                            }[header.column.getIsSorted() as string] ?? (
                              <ArrowUpDownIcon className=" h-4 w-4" />
                            )
                          : null}
                      </p>
                    </TableHead>
                  ) : null;
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody
            className="min-h-[500px]"
            //   ref={bodyWrapper}
          >
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="h-96 relative text-typo-primary">
                    <Spinner
                      className="absolute transform left-1/2 top-1/2 !-translate-x-1/2 !-translate-y-1/2"
                      size="xs"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ) :
            !noData ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    onClick={(e) => handleOnClickRow(e, row.original)}
                    data-state={row.getIsSelected() && "selected"}
                    className="relative h-17 cursor-pointer hover:bg-background-secondary text-typo-secondary"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const meta: any = cell.column.columnDef.meta;
                      const isFixed = meta?.fixed;
                      const width = meta?.width;
                      const show = meta?.show === false ? false : true;
                      return show ? (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            isFixed &&
                              "shadow-left sticky right-0 z-3 bg-support-white"
                          )}
                          style={{
                            width: `${width}px`,
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ) : null;
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!noData && !isLoading ? (
        <div className="flex justify-center lg:justify-end mt-2 lg:mt-0">
          <Pagination
            onPreviousPage={table.previousPage}
            onNextPage={table.nextPage}
            pageCount={table.getPageCount()}
            pageIndex={table.getState().pagination.pageIndex}
            setPageIndex={table.setPageIndex}
            canNextPage={!table.getCanNextPage()}
            canPreviousPage={!table.getCanPreviousPage()}
          />
        </div>
      ) : null}
    </>
  );
}

export default TableCustom;
